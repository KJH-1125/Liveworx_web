'use server'

import { getSession } from '@/lib/session'
import {
  searchCustomers as searchCustomersDB,
  getCustomer as getCustomerDB,
  createCustomer as createCustomerDB,
  updateCustomer as updateCustomerDB,
} from '@/lib/services/customer-service'
import type { CustomerListItem, CustomerDetail } from '@/lib/services/customer-service'

interface SearchState {
  customers?: CustomerListItem[]
  totalCount?: number
  page?: number
  pageSize?: number
  error?: string
}

interface DetailResult {
  customer?: CustomerDetail
  error?: string
}

interface SaveState {
  success?: boolean
  custCd?: string
  warning?: string
  error?: string
}

function getDbConfig(session: { dbServer: string; dbPort: number; dbName: string; dbUser: string; dbPassword: string }) {
  return {
    server: session.dbServer,
    port: session.dbPort,
    database: session.dbName,
    user: session.dbUser,
    password: session.dbPassword,
  }
}

export async function searchCustomersAction(
  _prevState: SearchState | undefined,
  formData: FormData
): Promise<SearchState> {
  const session = await getSession()
  if (!session) return { error: '세션이 만료되었습니다.' }

  try {
    const page = parseInt(formData.get('page') as string) || 1
    const pageSize = parseInt(formData.get('pageSize') as string) || 20

    const result = await searchCustomersDB(getDbConfig(session), {
      keyword: formData.get('keyword') as string,
      useFlag: formData.get('useFlag') as string,
      page,
      pageSize,
    })
    return { customers: result.items, totalCount: result.totalCount, page, pageSize }
  } catch (err) {
    console.error('[searchCustomers]', err)
    return { error: '조회 중 오류가 발생했습니다.' }
  }
}

export async function getCustomerDetail(custCd: string): Promise<DetailResult> {
  const session = await getSession()
  if (!session) return { error: '세션이 만료되었습니다.' }

  try {
    const customer = await getCustomerDB(getDbConfig(session), custCd)
    if (!customer) return { error: '거래처 정보를 찾을 수 없습니다.' }
    return { customer }
  } catch (err) {
    console.error('[getCustomerDetail]', err)
    return { error: '상세 조회 중 오류가 발생했습니다.' }
  }
}

export async function saveCustomer(
  _prevState: SaveState | undefined,
  formData: FormData
): Promise<SaveState> {
  const session = await getSession()
  if (!session) return { error: '세션이 만료되었습니다.' }

  const mode = formData.get('_mode') as string
  const custCd = formData.get('K01CUSGBCD') as string

  // 필수값 체크
  const sanghox = formData.get('K01SANGHOX') as string
  if (!sanghox?.trim()) return { error: '상호는 필수 입력 항목입니다.' }

  // FormData → Record
  const data: Record<string, string> = {}
  for (const [key, value] of formData.entries()) {
    if (!key.startsWith('_')) {
      data[key] = String(value)
    }
  }

  const dbConfig = getDbConfig(session)

  try {
    if (mode === 'new') {
      const result = await createCustomerDB(dbConfig, data, session.userId, session.plantCd)
      return { success: true, custCd: result.custCd, warning: result.warning }
    } else {
      const result = await updateCustomerDB(dbConfig, custCd, data, session.userId)
      return { success: true, custCd, warning: result.warning }
    }
  } catch (err) {
    console.error('[saveCustomer]', err)
    return { error: '저장 중 오류가 발생했습니다.' }
  }
}
