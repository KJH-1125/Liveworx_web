import { queryBoard, executeBoard } from '../db-board'
import type { BoardDbConfig } from '../db-board'

// ── Types ──

export interface QnaListItem {
  QNA_SEQ: number
  QNA_CSEQ: number | null
  QNA_FSEQ: number
  QNA_KEY: string
  QNA_GBN: string
  QNA_TITLE: string
  QNA_CONTS: string
  QNA_EMAIL: string
  QNA_TEL: string
  QNA_UPDUSERID: string
  QNA_INSDTTM: string
  QNA_UPDDTTM: string
  QNA_REPFLAG: string
  QNA_PARENT: number
  QNA_FIXYN: string | null
  QNA_FILE: string
  ATTACH_GRPNO: string | null
  BCOUNT: number
  LV: number
}

export interface QnaDetail {
  QNA_SEQ: number
  QNA_KEY: string
  QNA_GBN: string
  QNA_TITLE: string
  QNA_CONTS: string
  QNA_RTF: string
  QNA_EMAIL: string
  QNA_TEL: string
  QNA_EMAILYN: string
  QNA_UPDUSERID: string
  QNA_UPDDTTM: string
  QNA_REPNAME: string
  QNA_REPDTTM: string
  QNA_REPCONTENTS: string
  ATTACH_GRPNO: string | null
}

export interface QnaStatusCount {
  NUM1: number
  NUM2: number
  NUM3: number
  NUM4: number
}

export interface QnaManhourInfo {
  EXPDTTM: string
  CONDTTM: string
  EMAIL: string
  NAME: string
  MANHOUR1: number
  MANHOUR2: number
  PAY_SUM: number
  PAY_USE: number
  PAY_HOUR: number
}

export interface SearchParams {
  keyword?: string
  dateFrom: string
  dateTo: string
  repFlags: string[]
  dbName: string
  isAdmin?: boolean  // DB_PACKAGE_KOREASOFT 여부
}

// ── Queries ──

export async function searchQna(boardDb: BoardDbConfig, params: SearchParams): Promise<QnaListItem[]> {
  const { keyword, dateFrom, dateTo, repFlags, dbName, isAdmin } = params
  const dtFrom = dateFrom.replace(/-/g, '')
  const dtTo = dateTo.replace(/-/g, '')

  let keywordFilter = ''
  const sqlParams: Record<string, unknown> = { dtFrom, dtTo, dbName }

  if (keyword && keyword.trim()) {
    const words = keyword.trim().split(/\s+/)
    words.forEach((word, idx) => {
      const paramKey = `kw_${idx}`
      if (word.startsWith('-') && word.length > 1) {
        sqlParams[paramKey] = word.substring(1)
        keywordFilter += ` AND QNA_TITLE NOT LIKE '%' + @${paramKey} + '%'`
      } else {
        sqlParams[paramKey] = word
        keywordFilter += ` AND (QNA_FIXYN = 'Y' OR QNA_UPDUSERID LIKE '%' + @${paramKey} + '%'
          OR QNA_SEQ LIKE '%' + @${paramKey} + '%'
          OR QNA_CONTS LIKE '%' + @${paramKey} + '%'
          OR QNA_TITLE LIKE '%' + @${paramKey} + '%')`
      }
    })
  }

  // 관리자: DB 필터 없음 / 일반 사용자: 자사 DB + QNA_DB2 + 공지
  let dbFilter = ''
  if (!isAdmin) {
    dbFilter = ` AND (QNA_DB = @dbName OR QNA_DB2 LIKE '%' + @dbName + '%' OR QNA_FIXYN = 'Y')`
  }

  let repFilter = ''
  if (repFlags.length > 0) {
    const conditions = repFlags.map((f) => {
      if (f === '미답변') return `QNA_REPFLAG = N'미답변'`
      if (f === '접수중') return `QNA_REPFLAG = N'접수중'`
      if (f === '진행중') return `QNA_REPFLAG IN (N'진행중', N'작업완료')`
      if (f === '완료') return `QNA_REPFLAG = N'완료'`
      return ''
    }).filter(Boolean)
    if (conditions.length > 0) {
      repFilter = ` AND (QNA_FIXYN = 'Y' OR QNA_REPFLAG IS NULL OR ${conditions.join(' OR ')})`
    }
  }

  const sql = `
    ;WITH TEMP AS (
      SELECT DISTINCT QNA_FSEQ AS FSEQ
      FROM TB_QNA WITH(NOLOCK)
      WHERE QNA_USEYN = 'Y'
      ${keywordFilter}
    ),
    TREE_BOARD AS (
      SELECT QNA_TITLE, QNA_CONTS, QNA_EMAIL,
             QNA_USERINFO3 AS QNA_TEL,
             QNA_INSYMD, QNA_INSDTTM, QNA_UPDUSERID, QNA_UPDDTTM,
             QNA_KEY, QNA_SEQ, QNA_CSEQ, QNA_GBN, QNA_PARENT,
             QNA_CD, QNA_DB, QNA_DB2, QNA_REPFLAG, QNA_FIXYN,
             ATTACH_GRPNO,
             DENSE_RANK() OVER (ORDER BY QNA_FSEQ DESC) AS BCOUNT,
             CONVERT(varchar(255), QNA_SEQ) AS sort,
             0 AS LV,
             QNA_SEQ AS FSEQ
      FROM TEMP WITH(NOLOCK)
      LEFT OUTER JOIN TB_QNA WITH(NOLOCK) ON FSEQ = QNA_SEQ
      WHERE QNA_USEYN = 'Y'
        AND (QNA_INSYMD BETWEEN @dtFrom AND @dtTo OR QNA_FIXYN = 'Y')
        ${dbFilter}
        ${repFilter}

      UNION ALL

      SELECT TB1.QNA_TITLE, TB1.QNA_CONTS, TB1.QNA_EMAIL,
             TB1.QNA_USERINFO3 AS QNA_TEL,
             TB1.QNA_INSYMD, TB1.QNA_INSDTTM, TB1.QNA_UPDUSERID, TB1.QNA_UPDDTTM,
             TB1.QNA_KEY, TB1.QNA_SEQ, TB1.QNA_CSEQ, TB1.QNA_GBN, TB1.QNA_PARENT,
             TB1.QNA_CD, TB1.QNA_DB, TB1.QNA_DB2, TB1.QNA_REPFLAG, TB1.QNA_FIXYN,
             TB1.ATTACH_GRPNO,
             TB2.BCOUNT,
             CONVERT(varchar(255), CONVERT(varchar(255), TB2.sort) + '>' + CONVERT(varchar(255), TB1.QNA_SEQ)) AS sort,
             TB2.LV + 1 AS LV,
             TB2.FSEQ
      FROM TB_QNA TB1 WITH(NOLOCK), TREE_BOARD TB2
      WHERE TB1.QNA_PARENT = TB2.QNA_SEQ
        AND TB1.QNA_USEYN = 'Y'
    )
    SELECT REPLICATE('     ', LV) + IIF(LV > 0, REPLICATE(N'┗▶', 1), '') + QNA_TITLE AS QNA_TITLE,
           QNA_CONTS, QNA_EMAIL, QNA_TEL, QNA_UPDUSERID,
           CONVERT(VARCHAR, ISNULL(ATTACH_GRPNO, 0)) AS QNA_FILE,
           ATTACH_GRPNO,
           QNA_INSYMD,
           CONVERT(char(19), QNA_INSDTTM, 120) AS QNA_INSDTTM,
           CONVERT(char(19), QNA_UPDDTTM, 120) AS QNA_UPDDTTM,
           QNA_KEY, QNA_SEQ, QNA_CSEQ, QNA_GBN, QNA_PARENT,
           REPLACE(QNA_REPFLAG, N'작업완료', N'진행중') AS QNA_REPFLAG,
           QNA_FIXYN, BCOUNT, LV, FSEQ AS QNA_FSEQ
    FROM TREE_BOARD
    WHERE 1=1
    ORDER BY FSEQ DESC, sort
  `

  return queryBoard<QnaListItem>(boardDb, sql, sqlParams)
}

export async function getQnaDetail(boardDb: BoardDbConfig, seq: number): Promise<QnaDetail | null> {
  const sql = `
    SELECT QNA_TITLE, QNA_CONTS, QNA_RTF, QNA_EMAIL,
           QNA_USERINFO3 AS QNA_TEL,
           QNA_EMAILYN, QNA_UPDUSERID,
           CONVERT(varchar, QNA_UPDDTTM, 120) AS QNA_UPDDTTM,
           QNA_KEY, QNA_GBN, QNA_SEQ,
           QNA_REPNAME, QNA_REPDTTM, QNA_REPCONTENTS,
           ATTACH_GRPNO
    FROM TB_QNA WITH(NOLOCK)
    WHERE QNA_SEQ = @seq
  `
  const rows = await queryBoard<QnaDetail>(boardDb, sql, { seq })
  return rows[0] || null
}

export async function getStatusCounts(boardDb: BoardDbConfig, dbName: string, dtFrom: string, dtTo: string): Promise<QnaStatusCount> {
  const from = dtFrom.replace(/-/g, '')
  const to = dtTo.replace(/-/g, '')

  const sql = `
    SELECT TOP 1
      (SELECT COUNT(*) FROM TB_QNA WITH(NOLOCK) WHERE QNA_DB = @dbName AND QNA_USEYN = 'Y' AND QNA_SEQ = QNA_FSEQ AND QNA_REPFLAG = N'미답변' AND QNA_INSYMD BETWEEN @from AND @to AND (QNA_FIXYN IS NULL OR QNA_FIXYN = '')) AS NUM1,
      (SELECT COUNT(*) FROM TB_QNA WITH(NOLOCK) WHERE QNA_DB = @dbName AND QNA_USEYN = 'Y' AND QNA_SEQ = QNA_FSEQ AND QNA_REPFLAG = N'접수중' AND QNA_INSYMD BETWEEN @from AND @to AND (QNA_FIXYN IS NULL OR QNA_FIXYN = '')) AS NUM2,
      (SELECT COUNT(*) FROM TB_QNA WITH(NOLOCK) WHERE QNA_DB = @dbName AND QNA_USEYN = 'Y' AND QNA_SEQ = QNA_FSEQ AND QNA_REPFLAG IN (N'진행중', N'작업완료') AND QNA_INSYMD BETWEEN @from AND @to AND (QNA_FIXYN IS NULL OR QNA_FIXYN = '')) AS NUM3,
      (SELECT COUNT(*) FROM TB_QNA WITH(NOLOCK) WHERE QNA_DB = @dbName AND QNA_USEYN = 'Y' AND QNA_SEQ = QNA_FSEQ AND QNA_REPFLAG = N'완료' AND QNA_INSYMD BETWEEN @from AND @to AND (QNA_FIXYN IS NULL OR QNA_FIXYN = '')) AS NUM4
    FROM TB_QNA WITH(NOLOCK)
  `
  const rows = await queryBoard<QnaStatusCount>(boardDb, sql, { dbName, from, to })
  return rows[0] || { NUM1: 0, NUM2: 0, NUM3: 0, NUM4: 0 }
}

export async function getManhourInfo(boardDb: BoardDbConfig, dbName: string): Promise<QnaManhourInfo | null> {
  const sql = `
    SELECT
      CONVERT(VARCHAR, (SELECT TOP 1 MH_EXPDTTM FROM TB_MANHOUR WITH(NOLOCK) WHERE MH_COMPANY = @dbName ORDER BY MH_EXPDTTM DESC), 120) AS EXPDTTM,
      CONVERT(VARCHAR, (SELECT TOP 1 MH_CONDTTM FROM TB_MANHOUR WITH(NOLOCK) WHERE MH_COMPANY = @dbName ORDER BY MH_EXPDTTM DESC), 120) AS CONDTTM,
      (SELECT TOP 1 MH_EMAIL FROM TB_MANHOUR WITH(NOLOCK) WHERE MH_COMPANY = @dbName ORDER BY MH_EXPDTTM DESC) AS EMAIL,
      (SELECT TOP 1 MH_ADMIN FROM TB_MANHOUR WITH(NOLOCK) WHERE MH_COMPANY = @dbName ORDER BY MH_EXPDTTM DESC) AS NAME,
      ISNULL((SELECT TOP 1 MH_TOTALHOUR FROM TB_MANHOUR WITH(NOLOCK) WHERE MH_COMPANY = @dbName ORDER BY MH_EXPDTTM DESC), 0) AS MANHOUR1,
      ISNULL((SELECT SUM(QNA_MANHOUR) FROM TB_QNA WITH(NOLOCK) WHERE QNA_DB = @dbName AND CONVERT(DATE, QNA_INSDTTM) BETWEEN
        (SELECT TOP 1 MH_CONDTTM FROM TB_MANHOUR WITH(NOLOCK) WHERE MH_COMPANY = @dbName ORDER BY MH_EXPDTTM DESC) AND
        (SELECT TOP 1 MH_EXPDTTM FROM TB_MANHOUR WITH(NOLOCK) WHERE MH_COMPANY = @dbName AND QNA_MHYN = 'Y' AND QNA_PARENT = 0 ORDER BY MH_EXPDTTM DESC)), 0) AS MANHOUR2,
      ISNULL((SELECT SUM(PAY_HOUR) FROM TB_PAY WITH(NOLOCK) WHERE PAY_COMPANY = @dbName), 0) AS PAY_SUM,
      ISNULL((SELECT SUM(QNA_PAYHOUR) FROM TB_QNA WITH(NOLOCK) WHERE QNA_DB = @dbName), 0) AS PAY_USE,
      (SELECT ISNULL(SUM(PAY_HOUR), 0) FROM TB_PAY WITH(NOLOCK) WHERE PAY_COMPANY = @dbName)
        - (SELECT ISNULL(SUM(QNA_PAYHOUR), 0) FROM TB_QNA WITH(NOLOCK) WHERE QNA_DB = @dbName AND QNA_MHYN = 'Y' AND QNA_PARENT = '0') AS PAY_HOUR
    FROM TB_QNA WITH(NOLOCK)
  `
  const rows = await queryBoard<QnaManhourInfo>(boardDb, sql, { dbName })
  return rows[0] || null
}

export async function getNewBoardNo(boardDb: BoardDbConfig): Promise<string> {
  const sql = `SELECT DBO.FN_GETBOARD('Y') AS BOARD_NO`
  const rows = await queryBoard<{ BOARD_NO: string }>(boardDb, sql)
  return rows[0]?.BOARD_NO || ''
}

export async function createQna(boardDb: BoardDbConfig, data: {
  qnaKey: string
  title: string
  content: string
  email: string
  tel: string
  userId: string
  dbName: string
  parentSeq: number
  gbn: string
}): Promise<number> {
  const sql = `
    INSERT INTO TB_QNA (
      QNA_KEY, QNA_TITLE, QNA_CONTS, QNA_RTF, QNA_EMAIL, QNA_USERINFO3,
      QNA_UPDUSERID, QNA_INSUSERID, QNA_INSDTTM, QNA_UPDDTTM,
      QNA_INSYMD, QNA_DB, QNA_PARENT, QNA_GBN,
      QNA_USEYN, QNA_REPFLAG, QNA_FSEQ, QNA_EMAILYN
    )
    OUTPUT INSERTED.QNA_SEQ
    VALUES (
      @qnaKey, @title, @content, @content, @email, @tel,
      @userId, @userId, GETDATE(), GETDATE(),
      CONVERT(VARCHAR(8), GETDATE(), 112), @dbName, @parentSeq, @gbn,
      'Y', N'미답변', 0, 'N'
    )
  `
  const rows = await queryBoard<{ QNA_SEQ: number }>(boardDb, sql, {
    qnaKey: data.qnaKey,
    title: data.title,
    content: data.content,
    email: data.email,
    tel: data.tel,
    userId: data.userId,
    dbName: data.dbName,
    parentSeq: data.parentSeq,
    gbn: data.gbn,
  })

  const newSeq = rows[0]?.QNA_SEQ || 0

  if (data.parentSeq === 0) {
    await executeBoard(boardDb,
      `UPDATE TB_QNA SET QNA_FSEQ = @seq WHERE QNA_SEQ = @seq`,
      { seq: newSeq }
    )
  } else {
    await executeBoard(boardDb,
      `UPDATE TB_QNA SET QNA_FSEQ = (SELECT QNA_FSEQ FROM TB_QNA WHERE QNA_SEQ = @parent) WHERE QNA_SEQ = @seq`,
      { parent: data.parentSeq, seq: newSeq }
    )
  }

  return newSeq
}

export async function updateQna(boardDb: BoardDbConfig, seq: number, data: {
  title: string
  content: string
  email: string
  tel: string
  userId: string
}): Promise<void> {
  const sql = `
    UPDATE TB_QNA
    SET QNA_TITLE = @title,
        QNA_CONTS = @content,
        QNA_RTF = @content,
        QNA_EMAIL = @email,
        QNA_USERINFO3 = @tel,
        QNA_UPDUSERID = @userId,
        QNA_UPDDTTM = GETDATE()
    WHERE QNA_SEQ = @seq
  `
  await executeBoard(boardDb, sql, { seq, ...data })
}

export async function deleteQna(boardDb: BoardDbConfig, seq: number): Promise<void> {
  await executeBoard(boardDb, `UPDATE TB_QNA SET QNA_USEYN = 'N' WHERE QNA_SEQ = @seq`, { seq })
}
