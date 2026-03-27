'use client'

import type { ReactNode } from 'react'
import { SessionContext, type ClientSession } from '@/contexts/session-context'

export default function SessionProvider({
  session,
  children,
}: {
  session: ClientSession
  children: ReactNode
}) {
  return (
    <SessionContext value={session}>
      {children}
    </SessionContext>
  )
}
