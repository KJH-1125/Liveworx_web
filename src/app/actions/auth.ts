'use server'

import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { authenticateUser, logLogout } from '@/lib/services/auth-service'
import { createSession, getSession, deleteSession } from '@/lib/session'
import type { LoginFormState, SessionPayload } from '@/lib/definitions'

export async function login(
  _prevState: LoginFormState | undefined,
  formData: FormData
): Promise<LoginFormState> {
  const custCd = formData.get('custCd') as string
  const userId = formData.get('userId') as string
  const password = formData.get('password') as string

  const errors: LoginFormState['errors'] = {}
  if (!custCd?.trim()) errors.custCd = ['거래처코드를 입력하세요.']
  if (!userId?.trim()) errors.userId = ['사용자 ID를 입력하세요.']
  if (!password?.trim()) errors.password = ['비밀번호를 입력하세요.']

  if (Object.keys(errors).length > 0) {
    return { errors }
  }

  const headersList = await headers()
  const clientIp =
    headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headersList.get('x-real-ip') ||
    '0.0.0.0'

  const result = await authenticateUser(custCd.trim(), userId.trim(), password, clientIp)

  if (!result.success) {
    return { message: result.message }
  }

  const { user, dbConfig, boardDbConfig } = result

  const payload: SessionPayload = {
    userId: user!.USER_ID,
    userName: user!.USER_NM,
    custCd: user!.CUST_CD,
    custNm: user!.CUST_NM,
    plantCd: user!.PLANT_CD,
    ownerCd: user!.OWNER_CD,
    ownerNm: user!.OWNER_NM,
    langCd: process.env.DEFAULT_LANG || 'KO',
    dbServer: dbConfig!.server,
    dbPort: dbConfig!.port || 1433,
    dbName: dbConfig!.database,
    dbUser: dbConfig!.user,
    dbPassword: dbConfig!.password,
    boardDbServer: boardDbConfig?.server || '',
    boardDbPort: boardDbConfig?.port || 1433,
    boardDbName: boardDbConfig?.database || '',
    boardDbUser: boardDbConfig?.user || '',
    boardDbPassword: boardDbConfig?.password || '',
    expiresAt: '',
  }

  await createSession(payload)
  redirect('/dashboard')
}

export async function logout(): Promise<void> {
  const session = await getSession()
  if (session) {
    const headersList = await headers()
    const clientIp =
      headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      headersList.get('x-real-ip') ||
      '0.0.0.0'

    await logLogout(
      {
        server: session.dbServer,
        port: session.dbPort,
        database: session.dbName,
        user: session.dbUser,
        password: session.dbPassword,
      },
      session.userId,
      session.custCd,
      clientIp
    )
  }
  await deleteSession()
  redirect('/login')
}
