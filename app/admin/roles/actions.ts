'use server'

import { saveAdminRole, deleteAdminRole, AdminUserRecord } from '@/lib/content/cms'
import { revalidatePath } from 'next/cache'

export async function addAdminAction(
  formData: FormData
): Promise<{ success: boolean; data?: AdminUserRecord; error?: string }> {
  try {
    const email = (formData.get('email') as string || '').trim().toLowerCase()
    const fullName = (formData.get('fullName') as string || '').trim()
    const role = (formData.get('role') as string || 'admin').trim()
    const userId = (formData.get('userId') as string || '').trim() || undefined

    if (!email || !email.includes('@')) {
      return { success: false, error: 'A valid email address is required.' }
    }
    if (!fullName) {
      return { success: false, error: 'Administrator full name or designation is required.' }
    }

    // Every admin is granted full Read & Write CMS powers
    const result = await saveAdminRole({
      userId,
      email,
      fullName,
      role,
      canEditCms: true
    })

    if (result.success) {
      revalidatePath('/admin/roles')
      revalidatePath('/admin/cms')
      revalidatePath('/admin')
    }

    return result
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to grant admin power' }
  }
}

export async function removeAdminAction(userId: string) {
  try {
    if (!userId) {
      return { success: false, error: 'User ID is required.' }
    }

    const result = await deleteAdminRole(userId)
    if (result.success) {
      revalidatePath('/admin/roles')
      revalidatePath('/admin/cms')
      revalidatePath('/admin')
    }
    return result
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to remove admin' }
  }
}
