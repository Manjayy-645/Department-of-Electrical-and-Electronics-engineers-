import { promises as fs } from 'fs'
import path from 'path'
import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'
import {
  SiteContentData,
  HeroContent,
  AnnouncementContent,
  AboutContent,
  ProgrammesContent,
  SiteSettingsContent,
  StaffMember,
  DEFAULT_HERO_CONTENT,
  DEFAULT_ANNOUNCEMENT_CONTENT,
  DEFAULT_ABOUT_CONTENT,
  DEFAULT_PROGRAMMES_CONTENT,
  DEFAULT_SITE_SETTINGS,
  DEFAULT_STAFF_MEMBERS
} from './default-content'

export type { SiteContentData }

export interface AdminUserRecord {
  id: string
  userId: string
  role: string
  email?: string
  fullName?: string
  permissions: string[]
  canEditCms: boolean
  createdAt: string
}

export const DEFAULT_ADMINS: AdminUserRecord[] = [
  {
    id: 'admin-td',
    userId: '00000000-0000-0000-0000-000000000001',
    role: 'technical_director',
    email: 'tech.director@uniport.edu.ng',
    fullName: 'Technical Director',
    permissions: ['read', 'write', 'cms_edit', 'staff_edit', 'audit'],
    canEditCms: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'admin-pro',
    userId: '00000000-0000-0000-0000-000000000002',
    role: 'pro',
    email: 'pro.eee@uniport.edu.ng',
    fullName: 'Public Relations Officer (PRO)',
    permissions: ['read', 'write', 'cms_edit', 'staff_edit', 'audit'],
    canEditCms: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'admin-editor',
    userId: '00000000-0000-0000-0000-000000000003',
    role: 'editor',
    email: 'cms.editor@uniport.edu.ng',
    fullName: 'Editorial & Content Manager',
    permissions: ['read', 'write', 'cms_edit', 'staff_edit', 'audit'],
    canEditCms: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'admin-general',
    userId: '00000000-0000-0000-0000-000000000004',
    role: 'admin',
    email: 'department.admin@uniport.edu.ng',
    fullName: 'Departmental Administrator',
    permissions: ['read', 'write', 'cms_edit', 'staff_edit', 'audit'],
    canEditCms: true,
    createdAt: new Date().toISOString()
  }
]

const DATA_DIR = path.join(process.cwd(), 'data')
const CMS_FILE = path.join(DATA_DIR, 'site-content.json')
const STAFF_FILE = path.join(DATA_DIR, 'staff-members.json')
const ADMIN_FILE = path.join(DATA_DIR, 'admin-roles.json')

// Helper to ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true })
  } catch (err) {
    // Ignore if already exists
  }
}

/**
 * Returns an effective Supabase client:
 * 1. Attempts to use server client with user's cookies (preserves user session for RLS)
 * 2. Falls back to admin service-role client
 */
async function getEffectiveSupabaseClient(): Promise<{ client: any; userId?: string | null }> {
  try {
    const { createClient: createServerSupabase } = await import('@/lib/supabase/server')
    const userClient = await createServerSupabase()
    const { data: { user } } = await userClient.auth.getUser()
    if (user) {
      return { client: userClient, userId: user.id }
    }
  } catch {
    // Not in request context
  }

  return { client: createAdminClient(), userId: null }
}

export async function getAllSiteContent(): Promise<SiteContentData> {
  const defaultData: SiteContentData = {
    hero: { ...DEFAULT_HERO_CONTENT },
    announcement: { ...DEFAULT_ANNOUNCEMENT_CONTENT },
    about: { ...DEFAULT_ABOUT_CONTENT },
    programmes: { ...DEFAULT_PROGRAMMES_CONTENT },
    settings: { ...DEFAULT_SITE_SETTINGS },
  }

  // 1. Try to read from local file backup
  try {
    await ensureDataDir()
    const fileExists = await fs.stat(CMS_FILE).then(() => true).catch(() => false)
    if (fileExists) {
      const fileData = await fs.readFile(CMS_FILE, 'utf-8')
      const parsed = JSON.parse(fileData)
      if (parsed) {
        if (parsed.hero) defaultData.hero = { ...defaultData.hero, ...parsed.hero }
        if (parsed.announcement) defaultData.announcement = { ...defaultData.announcement, ...parsed.announcement }
        if (parsed.about) defaultData.about = { ...defaultData.about, ...parsed.about }
        if (parsed.programmes) defaultData.programmes = { ...defaultData.programmes, ...parsed.programmes }
        if (parsed.settings) defaultData.settings = { ...defaultData.settings, ...parsed.settings }
      }
    }
  } catch (e) {
    console.warn('[CMS] Could not read local site-content.json backup:', e)
  }

  // 2. Try to fetch from Supabase site_content table
  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co') {
      const { client } = await getEffectiveSupabaseClient()
      const { data, error } = await client
        .from('site_content')
        .select('section_key, content')

      if (!error && data && data.length > 0) {
        for (const row of data) {
          const key = row.section_key as keyof SiteContentData
          if (key in defaultData && row.content) {
            defaultData[key] = {
              ...defaultData[key],
              ...row.content
            }
          }
        }
      }
    }
  } catch (err) {
    // Supabase query failed or not initialized; gracefully proceed with file/default data
  }

  return defaultData
}

export async function getSiteSection<K extends keyof SiteContentData>(
  section: K
): Promise<SiteContentData[K]> {
  const allContent = await getAllSiteContent()
  return allContent[section]
}

export async function updateSiteSection<K extends keyof SiteContentData>(
  section: K,
  data: Partial<SiteContentData[K]>
): Promise<{ success: boolean; error?: string }> {
  try {
    // Get current content and merge
    const allContent = await getAllSiteContent()
    const mergedSection = {
      ...allContent[section],
      ...data
    }
    allContent[section] = mergedSection

    // 1. Write to local file store
    await ensureDataDir()
    await fs.writeFile(CMS_FILE, JSON.stringify(allContent, null, 2), 'utf-8')

    // 2. Write to Supabase site_content table if configured
    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co') {
        const { client, userId } = await getEffectiveSupabaseClient()
        const payload: any = {
          section_key: section,
          content: mergedSection,
          updated_at: new Date().toISOString(),
        }
        if (userId) {
          payload.updated_by = userId
        }

        const { error: upsertErr } = await client
          .from('site_content')
          .upsert(payload)

        if (upsertErr) {
          console.warn(`[CMS] Supabase upsert with primary client:`, upsertErr.message)
          // Fallback to service-role client if service key is set
          if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
            const adminClient = createAdminClient()
            await adminClient
              .from('site_content')
              .upsert(payload)
          }
        }
      }
    } catch (dbErr) {
      console.warn(`[CMS] Supabase upsert for ${section} skipped or failed:`, dbErr)
    }

    // 3. Revalidate public routes
    try {
      revalidatePath('/')
      revalidatePath('/about')
      revalidatePath('/programmes')
      revalidatePath('/staff')
      revalidatePath('/directory')
      revalidatePath('/documents')
      revalidatePath('/portal/dues')
      revalidatePath('/admin/cms')
    } catch (e) {
      // Revalidate might fail if called outside request context
    }

    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update section' }
  }
}

// Reset section back to official defaults
export async function resetSiteSectionToDefault<K extends keyof SiteContentData>(
  section: K
): Promise<{ success: boolean; error?: string }> {
  let defaultVal: any = null
  if (section === 'hero') defaultVal = DEFAULT_HERO_CONTENT
  if (section === 'announcement') defaultVal = DEFAULT_ANNOUNCEMENT_CONTENT
  if (section === 'about') defaultVal = DEFAULT_ABOUT_CONTENT
  if (section === 'programmes') defaultVal = DEFAULT_PROGRAMMES_CONTENT
  if (section === 'settings') defaultVal = DEFAULT_SITE_SETTINGS

  return updateSiteSection(section, defaultVal)
}

// ==========================================
// STAFF & FACULTY MANAGEMENT
// ==========================================

export async function getStaffMembers(): Promise<StaffMember[]> {
  let staffList = [...DEFAULT_STAFF_MEMBERS]

  // 1. Read from local file store if present
  try {
    await ensureDataDir()
    const fileExists = await fs.stat(STAFF_FILE).then(() => true).catch(() => false)
    if (fileExists) {
      const fileData = await fs.readFile(STAFF_FILE, 'utf-8')
      const parsed = JSON.parse(fileData)
      if (Array.isArray(parsed) && parsed.length > 0) {
        staffList = parsed
      }
    } else {
      // Initialize file with default staff
      await fs.writeFile(STAFF_FILE, JSON.stringify(DEFAULT_STAFF_MEMBERS, null, 2), 'utf-8')
    }
  } catch (e) {
    console.warn('[CMS] Could not read staff-members.json backup:', e)
  }

  // 2. Query Supabase faculty_staff table if configured
  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co') {
      const { client } = await getEffectiveSupabaseClient()
      const { data, error } = await client
        .from('faculty_staff')
        .select('*')
        .order('display_order', { ascending: true })

      if (!error && data && data.length > 0) {
        staffList = data.map((d: any) => ({
          id: d.id,
          name: d.name,
          title: d.title,
          cadre: d.cadre,
          categoryLabel: d.category_label || d.cadre,
          qualifications: Array.isArray(d.qualifications) ? d.qualifications : [],
          specialization: d.specialization || '',
          focusArea: d.focus_area || 'general',
          email: d.email || '',
          office: d.office || '',
          biography: d.biography || '',
          photo_url: d.photo_url || null,
          display_order: d.display_order || 0
        }))
      }
    }
  } catch (err) {
    // Graceful fallback to file/default staff
  }

  return staffList
}

export async function saveStaffMember(
  member: Omit<StaffMember, 'id'> & { id?: string }
): Promise<{ success: boolean; data?: StaffMember; error?: string }> {
  try {
    const currentStaff = await getStaffMembers()
    const id = member.id || `staff-${Date.now()}`
    const updatedMember: StaffMember = {
      ...member,
      id,
      display_order: member.display_order ?? currentStaff.length + 1
    }

    const existingIndex = currentStaff.findIndex((s) => s.id === id)
    let newStaffList: StaffMember[]
    if (existingIndex >= 0) {
      newStaffList = [
        ...currentStaff.slice(0, existingIndex),
        updatedMember,
        ...currentStaff.slice(existingIndex + 1)
      ]
    } else {
      newStaffList = [...currentStaff, updatedMember]
    }

    // 1. Write to local file
    await ensureDataDir()
    await fs.writeFile(STAFF_FILE, JSON.stringify(newStaffList, null, 2), 'utf-8')

    // 2. Write to Supabase if configured
    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co') {
        const { client } = await getEffectiveSupabaseClient()
        const payload = {
          id: updatedMember.id,
          name: updatedMember.name,
          title: updatedMember.title,
          cadre: updatedMember.cadre,
          category_label: updatedMember.categoryLabel,
          qualifications: updatedMember.qualifications,
          specialization: updatedMember.specialization,
          focus_area: updatedMember.focusArea,
          email: updatedMember.email,
          office: updatedMember.office,
          biography: updatedMember.biography,
          photo_url: updatedMember.photo_url,
          display_order: updatedMember.display_order
        }

        const { error: upsertErr } = await client
          .from('faculty_staff')
          .upsert(payload)

        if (upsertErr && process.env.SUPABASE_SERVICE_ROLE_KEY) {
          const adminClient = createAdminClient()
          await adminClient.from('faculty_staff').upsert(payload)
        }
      }
    } catch (e) {
      console.warn('[CMS] Supabase staff upsert failed:', e)
    }

    revalidatePath('/staff')
    revalidatePath('/admin/staff')
    return { success: true, data: updatedMember }
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to save staff member' }
  }
}

export async function deleteStaffMember(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const currentStaff = await getStaffMembers()
    const newStaffList = currentStaff.filter((s) => s.id !== id)

    // 1. Write to local file
    await ensureDataDir()
    await fs.writeFile(STAFF_FILE, JSON.stringify(newStaffList, null, 2), 'utf-8')

    // 2. Write to Supabase if configured
    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co') {
        const { client } = await getEffectiveSupabaseClient()
        const { error: delErr } = await client.from('faculty_staff').delete().eq('id', id)
        if (delErr && process.env.SUPABASE_SERVICE_ROLE_KEY) {
          const adminClient = createAdminClient()
          await adminClient.from('faculty_staff').delete().eq('id', id)
        }
      }
    } catch (e) {
      console.warn('[CMS] Supabase staff delete failed:', e)
    }

    revalidatePath('/staff')
    revalidatePath('/admin/staff')
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to delete staff member' }
  }
}

export async function resetStaffToDefault(): Promise<{ success: boolean; error?: string }> {
  try {
    await ensureDataDir()
    await fs.writeFile(STAFF_FILE, JSON.stringify(DEFAULT_STAFF_MEMBERS, null, 2), 'utf-8')
    revalidatePath('/staff')
    revalidatePath('/admin/staff')
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

// ==========================================
// ADMIN ROLES & CMS PERMISSION MANAGEMENT
// ==========================================

export async function getAllAdmins(): Promise<AdminUserRecord[]> {
  let adminList = [...DEFAULT_ADMINS]

  // 1. Read from local file store if present
  try {
    await ensureDataDir()
    const fileExists = await fs.stat(ADMIN_FILE).then(() => true).catch(() => false)
    if (fileExists) {
      const fileData = await fs.readFile(ADMIN_FILE, 'utf-8')
      const parsed = JSON.parse(fileData)
      if (Array.isArray(parsed) && parsed.length > 0) {
        adminList = parsed
      }
    } else {
      await fs.writeFile(ADMIN_FILE, JSON.stringify(DEFAULT_ADMINS, null, 2), 'utf-8')
    }
  } catch (e) {
    console.warn('[CMS] Could not read admin-roles.json backup:', e)
  }

  // 2. Query Supabase admin_roles table if configured
  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co') {
      const { client } = await getEffectiveSupabaseClient()
      const { data, error } = await client
        .from('admin_roles')
        .select('*')

      if (!error && data && data.length > 0) {
        // Merge Supabase admins into list
        const dbAdmins: AdminUserRecord[] = data.map((d: any) => ({
          id: d.user_id,
          userId: d.user_id,
          role: d.role || 'admin',
          email: d.email || `admin-${d.user_id.slice(0, 8)}@uniport.edu.ng`,
          fullName: d.full_name || (d.role === 'technical_director' ? 'Technical Director' : d.role === 'pro' ? 'Public Relations Officer' : 'Department Administrator'),
          permissions: Array.isArray(d.permissions) ? d.permissions : ['read', 'write', 'cms_edit', 'staff_edit', 'audit'],
          canEditCms: d.can_edit_cms !== false, // default true: read & write power
          createdAt: d.created_at || new Date().toISOString()
        }))

        // Combine unique by userId
        const map = new Map<string, AdminUserRecord>()
        for (const a of adminList) map.set(a.userId, a)
        for (const a of dbAdmins) map.set(a.userId, a)
        adminList = Array.from(map.values())
      }
    }
  } catch (err) {
    // Graceful fallback
  }

  return adminList
}

export async function saveAdminRole(
  adminData: {
    userId?: string
    role: string
    email: string
    fullName: string
    canEditCms?: boolean
  }
): Promise<{ success: boolean; data?: AdminUserRecord; error?: string }> {
  try {
    const currentAdmins = await getAllAdmins()
    const userId = adminData.userId || `usr-${Date.now()}`
    
    const newRecord: AdminUserRecord = {
      id: userId,
      userId,
      role: adminData.role || 'admin',
      email: adminData.email,
      fullName: adminData.fullName,
      permissions: ['read', 'write', 'cms_edit', 'staff_edit', 'audit'],
      canEditCms: adminData.canEditCms ?? true, // Full read & write power guaranteed
      createdAt: new Date().toISOString()
    }

    const existingIdx = currentAdmins.findIndex(a => a.userId === userId || Boolean(a.email && adminData.email && a.email.toLowerCase() === adminData.email.toLowerCase()))
    let updatedList: AdminUserRecord[]
    if (existingIdx >= 0) {
      updatedList = [
        ...currentAdmins.slice(0, existingIdx),
        { ...currentAdmins[existingIdx], ...newRecord },
        ...currentAdmins.slice(existingIdx + 1)
      ]
    } else {
      updatedList = [...currentAdmins, newRecord]
    }

    // 1. Write local store
    await ensureDataDir()
    await fs.writeFile(ADMIN_FILE, JSON.stringify(updatedList, null, 2), 'utf-8')

    // 2. Write to Supabase if configured
    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co') {
        const { client } = await getEffectiveSupabaseClient()
        const payload = {
          user_id: newRecord.userId,
          role: newRecord.role,
          email: newRecord.email,
          full_name: newRecord.fullName,
          permissions: newRecord.permissions,
          can_edit_cms: newRecord.canEditCms
        }
        const { error: upsertErr } = await client.from('admin_roles').upsert(payload)
        if (upsertErr && process.env.SUPABASE_SERVICE_ROLE_KEY) {
          const adminClient = createAdminClient()
          await adminClient.from('admin_roles').upsert(payload)
        }
      }
    } catch (e) {
      console.warn('[CMS] Supabase admin_roles upsert failed:', e)
    }

    revalidatePath('/admin/roles')
    revalidatePath('/admin')
    revalidatePath('/admin/cms')
    return { success: true, data: newRecord }
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to save admin role' }
  }
}

export async function deleteAdminRole(userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const currentAdmins = await getAllAdmins()
    const updatedList = currentAdmins.filter(a => a.userId !== userId && a.id !== userId)

    await ensureDataDir()
    await fs.writeFile(ADMIN_FILE, JSON.stringify(updatedList, null, 2), 'utf-8')

    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co') {
        const { client } = await getEffectiveSupabaseClient()
        await client.from('admin_roles').delete().eq('user_id', userId)
      }
    } catch (e) {
      console.warn('[CMS] Supabase admin delete failed:', e)
    }

    revalidatePath('/admin/roles')
    revalidatePath('/admin')
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to remove admin' }
  }
}
