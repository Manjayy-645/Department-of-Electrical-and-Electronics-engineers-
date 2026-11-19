'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { saveStaffMember, deleteStaffMember, resetStaffToDefault } from '@/lib/content/cms'
import { StaffMember } from '@/lib/content/default-content'

export async function saveStaffMemberAction(
  formData: FormData
): Promise<{ success: boolean; data?: StaffMember; error?: string }> {
  try {
    const id = formData.get('id') as string | undefined
    const name = formData.get('name') as string
    const title = formData.get('title') as string
    const cadre = formData.get('cadre') as 'professor' | 'lecturer' | 'technologist'
    const categoryLabel = formData.get('categoryLabel') as string || cadre
    const specialization = formData.get('specialization') as string || ''
    const focusArea = (formData.get('focusArea') as any) || 'general'
    const email = formData.get('email') as string || ''
    const office = formData.get('office') as string || ''
    const biography = formData.get('biography') as string || ''
    const displayOrder = parseInt(formData.get('display_order') as string) || 0
    let photoUrl = (formData.get('photo_url') as string) || null

    // Qualifications parsing (comma or newline separated)
    const rawQualifications = (formData.get('qualifications') as string) || ''
    const qualifications = rawQualifications
      .split('\n')
      .map(q => q.trim())
      .filter(Boolean)

    // Check if an image file was uploaded
    const file = formData.get('file') as File | null
    if (file && file.size > 0) {
      try {
        const supabase = createAdminClient()
        const fileExt = file.name.split('.').pop()
        const fileName = `staff/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
        const buffer = Buffer.from(await file.arrayBuffer())

        const { error: uploadError } = await supabase.storage
          .from('media-assets')
          .upload(fileName, buffer, { contentType: file.type })

        if (!uploadError) {
          const { data: publicUrlData } = supabase.storage
            .from('media-assets')
            .getPublicUrl(fileName)
          photoUrl = publicUrlData.publicUrl
        }
      } catch (err) {
        console.warn('Storage upload failed:', err)
      }
    }

    const memberData: Omit<StaffMember, 'id'> & { id?: string } = {
      ...(id ? { id } : {}),
      name,
      title,
      cadre,
      categoryLabel,
      qualifications,
      specialization,
      focusArea,
      email,
      office,
      biography,
      photo_url: photoUrl || undefined,
      display_order: displayOrder
    }

    return await saveStaffMember(memberData)
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to save staff member' }
  }
}

export async function deleteStaffMemberAction(id: string) {
  try {
    return await deleteStaffMember(id)
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to delete staff member' }
  }
}

export async function resetStaffAction() {
  try {
    return await resetStaffToDefault()
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to reset staff roster' }
  }
}
