import { SignJWT, jwtVerify } from 'jose'
import type { SessionPayload } from './definitions'

const secretKey = process.env.SESSION_SECRET
const encodedKey = () => new TextEncoder().encode(secretKey)

export async function encrypt(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('8h')
    .sign(encodedKey())
}

export async function decrypt(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, encodedKey(), {
      algorithms: ['HS256'],
    })
    return payload as unknown as SessionPayload
  } catch {
    return null
  }
}
