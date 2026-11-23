import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'

  const supabase = createServerClient(
    url,
    key,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // Compatibility routes for /checkout, /onboarding, /receipt
  if (pathname === '/checkout') {
    return NextResponse.redirect(new URL('/portal/dues', request.url))
  }
  if (pathname === '/onboarding' || pathname === '/portal/onboarding') {
    return NextResponse.redirect(new URL('/signup', request.url))
  }
  if (pathname === '/receipt') {
    return NextResponse.redirect(new URL('/portal/receipts', request.url))
  }
  if (pathname.startsWith('/receipt/')) {
    const id = pathname.replace('/receipt/', '')
    return NextResponse.redirect(new URL(`/portal/receipts/${id}`, request.url))
  }

  const isPortal = pathname.startsWith('/portal')
  const isAdmin = pathname.startsWith('/admin')

  // Not logged in -> redirect to login
  if (!user && (isPortal || isAdmin)) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Detect admin status from multiple sources
  const userMetaRole = String(user?.user_metadata?.role || user?.app_metadata?.role || '').toLowerCase()
  const isKnownAdminRole = ['admin', 'super_admin', 'editor', 'technical_director', 'pro', 'staff', 'hod'].some(
    r => userMetaRole.includes(r)
  )
  const isClaimsAdmin = Boolean(user?.app_metadata?.claims_admin)

  if (user && isPortal) {
    // Check if student profile exists
    const { data: student } = await supabase
      .from('students')
      .select('id')
      .eq('id', user.id)
      .maybeSingle()

    if (!student) {
      // If the user is an admin accessing portal, redirect them directly to admin back-office
      if (isKnownAdminRole || isClaimsAdmin) {
        return NextResponse.redirect(new URL('/admin', request.url))
      }

      // Check admin_roles table
      const { data: adminRow } = await supabase
        .from('admin_roles')
        .select('user_id')
        .eq('user_id', user.id)
        .maybeSingle()

      if (adminRow) {
        return NextResponse.redirect(new URL('/admin', request.url))
      }

      // Otherwise regular unregistered user, redirect to signup
      return NextResponse.redirect(new URL('/signup', request.url))
    }
  }

  if (user && isAdmin) {
    // Any user with admin metadata or claims_admin has full access
    if (isKnownAdminRole || isClaimsAdmin) {
      return response
    }

    // Check if user has an active admin role in the admin_roles table (any role is permitted)
    const { data: admin } = await supabase
      .from('admin_roles')
      .select('user_id, role')
      .eq('user_id', user.id)
      .maybeSingle()

    if (!admin) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
