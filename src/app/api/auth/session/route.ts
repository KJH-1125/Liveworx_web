import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'

export async function GET() {
  const session = await getSession()

  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      userId: session.userId,
      userName: session.userName,
      custCd: session.custCd,
      custNm: session.custNm,
      plantCd: session.plantCd,
      ownerCd: session.ownerCd,
      ownerNm: session.ownerNm,
      langCd: session.langCd,
    },
  })
}
