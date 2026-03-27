'use client'

import { createContext, useContext } from 'react'
import type { SessionPayload } from '@/lib/definitions'

type ClientSession = Omit<SessionPayload, 'dbServer' | 'dbPort' | 'dbName' | 'dbUser' | 'dbPassword' | 'boardDbServer' | 'boardDbPort' | 'boardDbName' | 'boardDbUser' | 'boardDbPassword'>

const SessionContext = createContext<ClientSession | null>(null)

export function useSession() {
  const ctx = useContext(SessionContext)
  if (!ctx) {
    throw new Error('useSession must be used within SessionProvider')
  }
  return ctx
}

export { SessionContext }
export type { ClientSession }
