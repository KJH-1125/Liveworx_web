'use server'

import { getSession } from '@/lib/session'
import {
  searchItems as searchItemsDB,
  getItem as getItemDB,
  createItem as createItemDB,
  updateItem as updateItemDB,
  deleteItem as deleteItemDB,
} from '@/lib/services/item-service'
import type { ItemListItem, ItemDetail } from '@/lib/services/item-service'

interface SearchState {
  items?: ItemListItem[]
  totalCount?: number
  page?: number
  pageSize?: number
  error?: string
}

interface DetailResult {
  item?: ItemDetail
  error?: string
}

interface SaveState {
  success?: boolean
  itemCd?: string
  warning?: string
  error?: string
}

interface DeleteResult {
  success?: boolean
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

export async function searchItemsAction(
  _prevState: SearchState | undefined,
  formData: FormData
): Promise<SearchState> {
  const session = await getSession()
  if (!session) return { error: '세션이 만료되었습니다.' }

  try {
    const page = parseInt(formData.get('page') as string) || 1
    const pageSize = parseInt(formData.get('pageSize') as string) || 20

    const result = await searchItemsDB(getDbConfig(session), {
      keyword: formData.get('keyword') as string,
      useFlag: formData.get('useFlag') as string,
      page,
      pageSize,
    })
    return { items: result.items, totalCount: result.totalCount, page, pageSize }
  } catch (err) {
    console.error('[searchItems]', err)
    return { error: '조회 중 오류가 발생했습니다.' }
  }
}

export async function getItemDetail(itemCd: string): Promise<DetailResult> {
  const session = await getSession()
  if (!session) return { error: '세션이 만료되었습니다.' }

  try {
    const item = await getItemDB(getDbConfig(session), itemCd)
    if (!item) return { error: '제품 정보를 찾을 수 없습니다.' }
    return { item }
  } catch (err) {
    console.error('[getItemDetail]', err)
    return { error: '상세 조회 중 오류가 발생했습니다.' }
  }
}

export async function saveItem(
  _prevState: SaveState | undefined,
  formData: FormData
): Promise<SaveState> {
  const session = await getSession()
  if (!session) return { error: '세션이 만료되었습니다.' }

  const mode = formData.get('_mode') as string
  const itemCd = formData.get('K02JPMGBCD') as string

  // 필수값 체크
  const pumgbn2 = formData.get('K02PUMGBN2') as string
  if (!pumgbn2?.trim()) return { error: '품명은 필수 입력 항목입니다.' }

  const subulut = formData.get('K02SUBULUT') as string
  if (!subulut?.trim()) return { error: '수불단위는 필수 입력 항목입니다.' }

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
      const result = await createItemDB(dbConfig, data, session.userId, session.plantCd)
      return { success: true, itemCd: result.itemCd, warning: result.warning }
    } else {
      const result = await updateItemDB(dbConfig, itemCd, data, session.userId)
      return { success: true, itemCd, warning: result.warning }
    }
  } catch (err) {
    console.error('[saveItem]', err)
    return { error: '저장 중 오류가 발생했습니다.' }
  }
}

export async function deleteItemAction(itemCd: string): Promise<DeleteResult> {
  const session = await getSession()
  if (!session) return { error: '세션이 만료되었습니다.' }

  try {
    await deleteItemDB(getDbConfig(session), itemCd)
    return { success: true }
  } catch (err) {
    console.error('[deleteItem]', err)
    return { error: '삭제 중 오류가 발생했습니다.' }
  }
}
