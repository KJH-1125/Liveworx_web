import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decrypt } from '@/lib/session-crypto'

const protectedRoutes = ['/dashboard']
const publicRoutes = ['/login']

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname
  const isProtected = protectedRoutes.some((r) => path.startsWith(r))
  const isPublic = publicRoutes.some((r) => path.startsWith(r))

  const sessionCookie = request.cookies.get('session')?.value
  const session = sessionCookie ? await decrypt(sessionCookie) : null

  if (isProtected && !session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (isPublic && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
