import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import SessionProvider from '@/components/session-provider'
import LayoutShell from '@/components/layout/layout-shell'
import { getMenuItemsFromDB } from '@/lib/services/menu-service'

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  if (!session) {
    redirect('/login')
  }

  const clientSession = {
    userId: session.userId,
    userName: session.userName,
    custCd: session.custCd,
    custNm: session.custNm,
    plantCd: session.plantCd,
    ownerCd: session.ownerCd,
    ownerNm: session.ownerNm,
    langCd: session.langCd,
    expiresAt: session.expiresAt,
  }

  const menuItems = await getMenuItemsFromDB(
    {
      server: session.dbServer,
      port: session.dbPort,
      database: session.dbName,
      user: session.dbUser,
      password: session.dbPassword,
    },
    session.userId
  )

  return (
    <SessionProvider session={clientSession}>
      <LayoutShell menuItems={menuItems}>
        {children}
      </LayoutShell>
    </SessionProvider>
  )
}
