'use server'

import { getSession } from '@/lib/session'
import type { BoardDbConfig } from '@/lib/db-board'
import {
  searchQna as searchQnaDB,
  getQnaDetail as getQnaDetailDB,
  getStatusCounts as getStatusCountsDB,
  getManhourInfo as getManhourInfoDB,
  getNewBoardNo,
  createQna as createQnaDB,
  updateQna as updateQnaDB,
  deleteQna as deleteQnaDB,
} from '@/lib/services/qna-service'
import type { QnaListItem, QnaDetail, QnaStatusCount, QnaManhourInfo } from '@/lib/services/qna-service'

function getBoardDb(session: {
  boardDbServer: string; boardDbPort: number;
  boardDbName: string; boardDbUser: string; boardDbPassword: string
}): BoardDbConfig {
  return {
    server: session.boardDbServer,
    port: session.boardDbPort,
    database: session.boardDbName,
    user: session.boardDbUser,
    password: session.boardDbPassword,
  }
}

// ── Search ──

interface SearchState {
  items?: QnaListItem[]
  statusCounts?: QnaStatusCount
  manhour?: QnaManhourInfo | null
  error?: string
}

export async function searchQnaAction(
  _prevState: SearchState | undefined,
  formData: FormData
): Promise<SearchState> {
  const session = await getSession()
  if (!session) return { error: '세션이 만료되었습니다.' }

  const boardDb = getBoardDb(session)
  if (!boardDb.server) return { error: '게시판 DB 접속 정보가 없습니다. 다시 로그인해주세요.' }

  try {
    const dateFrom = formData.get('dateFrom') as string || ''
    const dateTo = formData.get('dateTo') as string || ''
    const keyword = formData.get('keyword') as string || ''
    const repFlagsRaw = formData.getAll('repFlag') as string[]

    const isAdmin = session.dbName === 'DB_PACKAGE_KOREASOFT'

    const items = await searchQnaDB(boardDb, {
      keyword,
      dateFrom,
      dateTo,
      repFlags: repFlagsRaw,
      dbName: session.dbName,
      isAdmin,
    })

    const statusCounts = await getStatusCountsDB(boardDb, session.dbName, dateFrom, dateTo)
    const manhour = await getManhourInfoDB(boardDb, session.dbName)

    return { items, statusCounts, manhour }
  } catch (err) {
    console.error('[searchQna]', err)
    return { error: '조회 중 오류가 발생했습니다.' }
  }
}

// ── Detail ──

interface DetailResult {
  detail?: QnaDetail
  error?: string
}

export async function getQnaDetailAction(seq: number): Promise<DetailResult> {
  const session = await getSession()
  if (!session) return { error: '세션이 만료되었습니다.' }

  const boardDb = getBoardDb(session)

  try {
    const detail = await getQnaDetailDB(boardDb, seq)
    if (!detail) return { error: '게시글을 찾을 수 없습니다.' }
    return { detail }
  } catch (err) {
    console.error('[getQnaDetail]', err)
    return { error: '상세 조회 중 오류가 발생했습니다.' }
  }
}

// ── Create ──

interface SaveState {
  success?: boolean
  seq?: number
  error?: string
}

export async function createQnaAction(
  _prevState: SaveState | undefined,
  formData: FormData
): Promise<SaveState> {
  const session = await getSession()
  if (!session) return { error: '세션이 만료되었습니다.' }

  const boardDb = getBoardDb(session)
  const title = (formData.get('title') as string || '').trim()
  const content = (formData.get('content') as string || '').trim()
  const email = (formData.get('email') as string || '').trim()
  const tel = (formData.get('tel') as string || '').trim()
  const parentSeq = parseInt(formData.get('parentSeq') as string) || 0
  const gbn = (formData.get('gbn') as string) || 'QNA'

  if (!title) return { error: '제목을 입력해주세요.' }
  if (!content) return { error: '내용을 입력해주세요.' }

  try {
    const qnaKey = await getNewBoardNo(boardDb)
    const seq = await createQnaDB(boardDb, {
      qnaKey,
      title,
      content,
      email,
      tel,
      userId: session.userName,
      dbName: session.dbName,
      parentSeq,
      gbn,
    })
    return { success: true, seq }
  } catch (err) {
    console.error('[createQna]', err)
    return { error: '등록 중 오류가 발생했습니다.' }
  }
}

// ── Update ──

export async function updateQnaAction(
  _prevState: SaveState | undefined,
  formData: FormData
): Promise<SaveState> {
  const session = await getSession()
  if (!session) return { error: '세션이 만료되었습니다.' }

  const boardDb = getBoardDb(session)
  const seq = parseInt(formData.get('seq') as string) || 0
  const title = (formData.get('title') as string || '').trim()
  const content = (formData.get('content') as string || '').trim()
  const email = (formData.get('email') as string || '').trim()
  const tel = (formData.get('tel') as string || '').trim()

  if (!title) return { error: '제목을 입력해주세요.' }
  if (!content) return { error: '내용을 입력해주세요.' }

  try {
    await updateQnaDB(boardDb, seq, {
      title,
      content,
      email,
      tel,
      userId: session.userName,
    })
    return { success: true, seq }
  } catch (err) {
    console.error('[updateQna]', err)
    return { error: '수정 중 오류가 발생했습니다.' }
  }
}

// ── Delete ──

interface DeleteResult {
  success?: boolean
  error?: string
}

export async function deleteQnaAction(seq: number): Promise<DeleteResult> {
  const session = await getSession()
  if (!session) return { error: '세션이 만료되었습니다.' }

  const boardDb = getBoardDb(session)

  try {
    await deleteQnaDB(boardDb, seq)
    return { success: true }
  } catch (err) {
    console.error('[deleteQna]', err)
    return { error: '삭제 중 오류가 발생했습니다.' }
  }
}
