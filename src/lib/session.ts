import 'server-only'
import { cookies } from 'next/headers'
import { encrypt, decrypt } from './session-crypto'
import type { SessionPayload } from './definitions'

const COOKIE_NAME = 'session'

export async function createSession(payload: SessionPayload): Promise<void> {
  const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000)
  payload.expiresAt = expiresAt.toISOString()
  const token = await encrypt(payload)

  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: expiresAt,
  })
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null
  return decrypt(token)
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}
