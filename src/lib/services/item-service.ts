import { queryDynamic, executeDynamic } from '../db-dynamic'

interface DbConfig {
  server: string
  database: string
  user: string
  password: string
  port?: number
}

export interface ItemListItem {
  K02JPMGBCD: string
  K02PUMGBN1: string
  K02PUMGBN2: string
  K02PUMGBN3: string
  K02PUMGBN4: string
  K02SUBULUT: string
  K02CLASSCD_NM: string
  K02GUBUN01_NM: string
  K02USEFLAG: string
  K02IPGPRC1: number
  K02PANPRC1: number
}

export interface ItemDetail {
  // 기본정보
  K02JPMGBCD: string
  K02PUMGBN1: string
  K02PUMGBN2: string
  K02PUMGBN3: string
  K02PUMGBN4: string
  K02PUMGBN5: string
  K02PUMGBN6: string
  K02PUMGBN7: string
  K02PUMGBN8: string
  K02PUMGBN9: string
  K02SUBULUT: string
  K02JPMWGT3: string
  K02PACKAGE: string
  K02PALLET: string
  K02CLASSCD: string
  K02CLASSCD2: string
  K02CLASSCD3: string
  K02CLASSCD4: string
  K02GUBUN01: string
  K02GUBUN02: string
  K02GUBUN03: string
  K02EXPIR_YN: string
  K02EXPIRDT: string
  K02EXPIRVLD: string
  K02PACKAGECD: string
  K02DXDSTSYN: string
  K02USEFLAG: string
  // 단가/재고
  K02IPGPRC1: string
  K02PANPRC1: string
  K02IPGPRC2: string
  K02PANPRC2: string
  K02SAFESK1: string
  K02BALJUX1: string
  K02OVERSK1: string
  K02SITE: string
  K02LOCATION: string
  K02CUSGBCD: string
  K02DLVRYDATE: string
  // 추가정보
  K02LOTCODE: string
  K02VATGBNM: string
  K02LOCKCD: string
  K02LOCK_REMARK: string
  K02INS_YN: string
  K02INS_YN2: string
  K02OWNERCD: string
  K02ITEMDEPT: string
  K02ETCCODE1: string
  K02ETCCODE2: string
  K02ETCCODE3: string
  K02ETCCODE4: string
  K02ETCCODE5: string
  K02BIGOXX1: string
  K02BIGOXX2: string
  K02BIGOXX3: string
  K02BIGOXX4: string
  K02BIGOXX5: string
  K02RELEASE_DATE: string
}

interface SearchFilters {
  keyword?: string
  useFlag?: string
  page?: number
  pageSize?: number
}

export interface SearchResult {
  items: ItemListItem[]
  totalCount: number
}

export async function searchItems(
  dbConfig: DbConfig,
  filters: SearchFilters
): Promise<SearchResult> {
  const keyword = filters.keyword?.trim() || ''
  const useFlag = filters.useFlag || ''
  const page = filters.page || 1
  const pageSize = filters.pageSize || 20
  const offset = (page - 1) * pageSize

  const whereClause = `WHERE K02JPMGBCD IS NOT NULL
       AND (@keyword = '' OR K02PUMGBN1 LIKE '%'+@keyword+'%' OR K02PUMGBN2 LIKE '%'+@keyword+'%' OR K02PUMGBN3 LIKE '%'+@keyword+'%')
       AND (@useFlag = '' OR ISNULL(K02USEFLAG,'Y') = @useFlag)`

  const params = { keyword, useFlag, offset, pageSize }

  const [countRows, items] = await Promise.all([
    queryDynamic<{ cnt: number }>(
      dbConfig,
      `SELECT COUNT(*) AS cnt
       FROM TBK02 WITH (NOLOCK)
       LEFT JOIN T_STD_CDMST TC1 ON TC1.SubCode = K02CLASSCD AND TC1.ClassCode = 'ITEMCLASS'
       LEFT JOIN T_STD_CDMST TC2 ON TC2.SubCode = K02GUBUN01 AND TC2.ClassCode = 'ITEMGUBUN'
       ${whereClause}`,
      { keyword, useFlag }
    ),
    queryDynamic<ItemListItem>(
      dbConfig,
      `SELECT K02JPMGBCD, ISNULL(K02PUMGBN1,'') AS K02PUMGBN1, ISNULL(K02PUMGBN2,'') AS K02PUMGBN2,
              ISNULL(K02PUMGBN3,'') AS K02PUMGBN3, ISNULL(K02PUMGBN4,'') AS K02PUMGBN4,
              ISNULL(K02SUBULUT,'') AS K02SUBULUT,
              ISNULL(TC1.CodeName,'') AS K02CLASSCD_NM,
              ISNULL(TC2.CodeName,'') AS K02GUBUN01_NM,
              ISNULL(K02USEFLAG,'Y') AS K02USEFLAG,
              ISNULL(K02IPGPRC1,0) AS K02IPGPRC1,
              ISNULL(K02PANPRC1,0) AS K02PANPRC1
       FROM TBK02 WITH (NOLOCK)
       LEFT JOIN T_STD_CDMST TC1 ON TC1.SubCode = K02CLASSCD AND TC1.ClassCode = 'ITEMCLASS'
       LEFT JOIN T_STD_CDMST TC2 ON TC2.SubCode = K02GUBUN01 AND TC2.ClassCode = 'ITEMGUBUN'
       ${whereClause}
       ORDER BY K02JPMGBCD
       OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY`,
      params
    ),
  ])

  return { items, totalCount: countRows[0]?.cnt ?? 0 }
}

export async function getItem(
  dbConfig: DbConfig,
  itemCd: string
): Promise<ItemDetail | null> {
  const rows = await queryDynamic<ItemDetail>(
    dbConfig,
    `SELECT K02JPMGBCD,
            ISNULL(K02PUMGBN1,'') AS K02PUMGBN1, ISNULL(K02PUMGBN2,'') AS K02PUMGBN2,
            ISNULL(K02PUMGBN3,'') AS K02PUMGBN3, ISNULL(K02PUMGBN4,'') AS K02PUMGBN4,
            ISNULL(K02PUMGBN5,'') AS K02PUMGBN5,
            ISNULL(K02PUMGBN6,'') AS K02PUMGBN6, ISNULL(K02PUMGBN7,'') AS K02PUMGBN7,
            ISNULL(K02PUMGBN8,'') AS K02PUMGBN8, ISNULL(K02PUMGBN9,'') AS K02PUMGBN9,
            ISNULL(K02SUBULUT,'') AS K02SUBULUT,
            ISNULL(CONVERT(varchar, K02JPMWGT3),'') AS K02JPMWGT3,
            ISNULL(CONVERT(varchar, K02PACKAGE),'') AS K02PACKAGE,
            ISNULL(CONVERT(varchar, K02PALLET),'') AS K02PALLET,
            ISNULL(K02CLASSCD,'') AS K02CLASSCD, ISNULL(K02CLASSCD2,'') AS K02CLASSCD2,
            ISNULL(K02CLASSCD3,'') AS K02CLASSCD3, ISNULL(K02CLASSCD4,'') AS K02CLASSCD4,
            ISNULL(K02GUBUN01,'') AS K02GUBUN01, ISNULL(K02GUBUN02,'') AS K02GUBUN02,
            ISNULL(K02GUBUN03,'') AS K02GUBUN03,
            ISNULL(K02EXPIR_YN,'N') AS K02EXPIR_YN,
            ISNULL(CONVERT(varchar, K02EXPIRDT),'') AS K02EXPIRDT,
            ISNULL(CONVERT(varchar, K02EXPIRVLD),'') AS K02EXPIRVLD,
            ISNULL(K02PACKAGECD,'N') AS K02PACKAGECD,
            ISNULL(K02DXDSTSYN,'N') AS K02DXDSTSYN,
            ISNULL(K02USEFLAG,'Y') AS K02USEFLAG,
            ISNULL(CONVERT(varchar, K02IPGPRC1),'') AS K02IPGPRC1,
            ISNULL(CONVERT(varchar, K02PANPRC1),'') AS K02PANPRC1,
            ISNULL(CONVERT(varchar, K02IPGPRC2),'') AS K02IPGPRC2,
            ISNULL(CONVERT(varchar, K02PANPRC2),'') AS K02PANPRC2,
            ISNULL(CONVERT(varchar, K02SAFESK1),'') AS K02SAFESK1,
            ISNULL(CONVERT(varchar, K02BALJUX1),'') AS K02BALJUX1,
            ISNULL(CONVERT(varchar, K02OVERSK1),'') AS K02OVERSK1,
            ISNULL(K02SITE,'') AS K02SITE, ISNULL(K02LOCATION,'') AS K02LOCATION,
            ISNULL(K02CUSGBCD,'') AS K02CUSGBCD,
            ISNULL(CONVERT(varchar, K02DLVRYDATE),'') AS K02DLVRYDATE,
            ISNULL(K02LOTCODE,'N') AS K02LOTCODE,
            ISNULL(K02VATGBNM,'') AS K02VATGBNM,
            ISNULL(K02LOCKCD,'N') AS K02LOCKCD, ISNULL(K02LOCK_REMARK,'') AS K02LOCK_REMARK,
            ISNULL(K02INS_YN,'N') AS K02INS_YN, ISNULL(K02INS_YN2,'N') AS K02INS_YN2,
            ISNULL(K02OWNERCD,'') AS K02OWNERCD, ISNULL(K02ITEMDEPT,'') AS K02ITEMDEPT,
            ISNULL(K02ETCCODE1,'') AS K02ETCCODE1, ISNULL(K02ETCCODE2,'') AS K02ETCCODE2,
            ISNULL(K02ETCCODE3,'') AS K02ETCCODE3, ISNULL(K02ETCCODE4,'') AS K02ETCCODE4,
            ISNULL(K02ETCCODE5,'') AS K02ETCCODE5,
            ISNULL(K02BIGOXX1,'') AS K02BIGOXX1, ISNULL(K02BIGOXX2,'') AS K02BIGOXX2,
            ISNULL(K02BIGOXX3,'') AS K02BIGOXX3, ISNULL(K02BIGOXX4,'') AS K02BIGOXX4,
            ISNULL(K02BIGOXX5,'') AS K02BIGOXX5,
            ISNULL(CONVERT(varchar(10), K02RELEASE_DATE, 23),'') AS K02RELEASE_DATE
     FROM TBK02 WITH (NOLOCK)
     WHERE K02JPMGBCD = @itemCd`,
    { itemCd }
  )
  return rows.length > 0 ? rows[0] : null
}

export async function createItem(
  dbConfig: DbConfig,
  data: Record<string, unknown>,
  userId: string,
  plantCd: string
): Promise<{ itemCd: string; warning?: string }> {
  // 품번 중복 체크
  let warning: string | undefined
  const pumgbn1 = String(data.K02PUMGBN1 || '').trim()
  if (pumgbn1) {
    const dupes = await queryDynamic<{ K02JPMGBCD: string; K02PUMGBN2: string }>(
      dbConfig,
      `SELECT K02JPMGBCD, K02PUMGBN2 FROM TBK02 WITH (NOLOCK)
       WHERE K02PUMGBN1 = @pumgbn1`,
      { pumgbn1 }
    )
    if (dupes.length > 0) {
      warning = `동일 품번 제품 존재: ${dupes.map(d => `${d.K02JPMGBCD}(${d.K02PUMGBN2})`).join(', ')}`
    }
  }

  // INSERT (K02JPMGBCD is identity auto-increment)
  await executeDynamic(
    dbConfig,
    `INSERT INTO TBK02 (
       K02KOREACD,
       K02PUMGBN1, K02PUMGBN2, K02PUMGBN3, K02PUMGBN4, K02PUMGBN5,
       K02PUMGBN6, K02PUMGBN7, K02PUMGBN8, K02PUMGBN9,
       K02SUBULUT, K02JPMWGT3, K02PACKAGE, K02PALLET,
       K02CLASSCD, K02CLASSCD2, K02CLASSCD3, K02CLASSCD4,
       K02GUBUN01, K02GUBUN02, K02GUBUN03,
       K02EXPIR_YN, K02EXPIRDT, K02EXPIRVLD,
       K02PACKAGECD, K02DXDSTSYN, K02USEFLAG,
       K02IPGPRC1, K02PANPRC1, K02IPGPRC2, K02PANPRC2,
       K02SAFESK1, K02BALJUX1, K02OVERSK1,
       K02SITE, K02LOCATION, K02CUSGBCD, K02DLVRYDATE,
       K02LOTCODE, K02VATGBNM, K02LOCKCD, K02LOCK_REMARK,
       K02INS_YN, K02INS_YN2, K02OWNERCD, K02ITEMDEPT,
       K02ETCCODE1, K02ETCCODE2, K02ETCCODE3, K02ETCCODE4, K02ETCCODE5,
       K02BIGOXX1, K02BIGOXX2, K02BIGOXX3, K02BIGOXX4, K02BIGOXX5,
       K02RELEASE_DATE,
       K02SYSDATE, K02SYSUSER
     ) VALUES (
       @plantCd,
       @K02PUMGBN1, @K02PUMGBN2, @K02PUMGBN3, @K02PUMGBN4, @K02PUMGBN5,
       @K02PUMGBN6, @K02PUMGBN7, @K02PUMGBN8, @K02PUMGBN9,
       @K02SUBULUT,
       CASE WHEN @K02JPMWGT3 = '' THEN NULL ELSE CONVERT(decimal(18,4), @K02JPMWGT3) END,
       CASE WHEN @K02PACKAGE = '' THEN NULL ELSE CONVERT(int, @K02PACKAGE) END,
       CASE WHEN @K02PALLET = '' THEN NULL ELSE CONVERT(int, @K02PALLET) END,
       @K02CLASSCD, @K02CLASSCD2, @K02CLASSCD3, @K02CLASSCD4,
       @K02GUBUN01, @K02GUBUN02, @K02GUBUN03,
       @K02EXPIR_YN,
       CASE WHEN @K02EXPIRDT = '' THEN NULL ELSE CONVERT(int, @K02EXPIRDT) END,
       CASE WHEN @K02EXPIRVLD = '' THEN NULL ELSE CONVERT(int, @K02EXPIRVLD) END,
       @K02PACKAGECD, @K02DXDSTSYN, @K02USEFLAG,
       CASE WHEN @K02IPGPRC1 = '' THEN NULL ELSE CONVERT(decimal(18,2), @K02IPGPRC1) END,
       CASE WHEN @K02PANPRC1 = '' THEN NULL ELSE CONVERT(decimal(18,2), @K02PANPRC1) END,
       CASE WHEN @K02IPGPRC2 = '' THEN NULL ELSE CONVERT(decimal(18,2), @K02IPGPRC2) END,
       CASE WHEN @K02PANPRC2 = '' THEN NULL ELSE CONVERT(decimal(18,2), @K02PANPRC2) END,
       CASE WHEN @K02SAFESK1 = '' THEN NULL ELSE CONVERT(decimal(18,2), @K02SAFESK1) END,
       CASE WHEN @K02BALJUX1 = '' THEN NULL ELSE CONVERT(decimal(18,2), @K02BALJUX1) END,
       CASE WHEN @K02OVERSK1 = '' THEN NULL ELSE CONVERT(decimal(18,2), @K02OVERSK1) END,
       @K02SITE, @K02LOCATION, @K02CUSGBCD,
       CASE WHEN @K02DLVRYDATE = '' THEN NULL ELSE CONVERT(int, @K02DLVRYDATE) END,
       @K02LOTCODE, @K02VATGBNM, @K02LOCKCD, @K02LOCK_REMARK,
       @K02INS_YN, @K02INS_YN2, @K02OWNERCD, @K02ITEMDEPT,
       @K02ETCCODE1, @K02ETCCODE2, @K02ETCCODE3, @K02ETCCODE4, @K02ETCCODE5,
       @K02BIGOXX1, @K02BIGOXX2, @K02BIGOXX3, @K02BIGOXX4, @K02BIGOXX5,
       CASE WHEN @K02RELEASE_DATE = '' THEN NULL ELSE @K02RELEASE_DATE END,
       GETDATE(), @userId
     )`,
    { plantCd, userId, ...buildParams(data) }
  )

  // SCOPE_IDENTITY 대신 MAX 조회 (identity)
  const result = await queryDynamic<{ NEWCD: string }>(
    dbConfig,
    `SELECT CONVERT(varchar, IDENT_CURRENT('TBK02')) AS NEWCD`
  )

  return { itemCd: result[0]?.NEWCD || '', warning }
}

export async function updateItem(
  dbConfig: DbConfig,
  itemCd: string,
  data: Record<string, unknown>,
  userId: string
): Promise<{ warning?: string }> {
  // 품번 중복 체크
  let warning: string | undefined
  const pumgbn1 = String(data.K02PUMGBN1 || '').trim()
  if (pumgbn1) {
    const dupes = await queryDynamic<{ K02JPMGBCD: string; K02PUMGBN2: string }>(
      dbConfig,
      `SELECT K02JPMGBCD, K02PUMGBN2 FROM TBK02 WITH (NOLOCK)
       WHERE K02PUMGBN1 = @pumgbn1 AND CONVERT(varchar, K02JPMGBCD) <> @itemCd`,
      { pumgbn1, itemCd }
    )
    if (dupes.length > 0) {
      warning = `동일 품번 제품 존재: ${dupes.map(d => `${d.K02JPMGBCD}(${d.K02PUMGBN2})`).join(', ')}`
    }
  }

  await executeDynamic(
    dbConfig,
    `UPDATE TBK02 SET
       K02PUMGBN1 = @K02PUMGBN1, K02PUMGBN2 = @K02PUMGBN2,
       K02PUMGBN3 = @K02PUMGBN3, K02PUMGBN4 = @K02PUMGBN4, K02PUMGBN5 = @K02PUMGBN5,
       K02PUMGBN6 = @K02PUMGBN6, K02PUMGBN7 = @K02PUMGBN7,
       K02PUMGBN8 = @K02PUMGBN8, K02PUMGBN9 = @K02PUMGBN9,
       K02SUBULUT = @K02SUBULUT,
       K02JPMWGT3 = CASE WHEN @K02JPMWGT3 = '' THEN NULL ELSE CONVERT(decimal(18,4), @K02JPMWGT3) END,
       K02PACKAGE = CASE WHEN @K02PACKAGE = '' THEN NULL ELSE CONVERT(int, @K02PACKAGE) END,
       K02PALLET = CASE WHEN @K02PALLET = '' THEN NULL ELSE CONVERT(int, @K02PALLET) END,
       K02CLASSCD = @K02CLASSCD, K02CLASSCD2 = @K02CLASSCD2,
       K02CLASSCD3 = @K02CLASSCD3, K02CLASSCD4 = @K02CLASSCD4,
       K02GUBUN01 = @K02GUBUN01, K02GUBUN02 = @K02GUBUN02, K02GUBUN03 = @K02GUBUN03,
       K02EXPIR_YN = @K02EXPIR_YN,
       K02EXPIRDT = CASE WHEN @K02EXPIRDT = '' THEN NULL ELSE CONVERT(int, @K02EXPIRDT) END,
       K02EXPIRVLD = CASE WHEN @K02EXPIRVLD = '' THEN NULL ELSE CONVERT(int, @K02EXPIRVLD) END,
       K02PACKAGECD = @K02PACKAGECD, K02DXDSTSYN = @K02DXDSTSYN, K02USEFLAG = @K02USEFLAG,
       K02IPGPRC1 = CASE WHEN @K02IPGPRC1 = '' THEN NULL ELSE CONVERT(decimal(18,2), @K02IPGPRC1) END,
       K02PANPRC1 = CASE WHEN @K02PANPRC1 = '' THEN NULL ELSE CONVERT(decimal(18,2), @K02PANPRC1) END,
       K02IPGPRC2 = CASE WHEN @K02IPGPRC2 = '' THEN NULL ELSE CONVERT(decimal(18,2), @K02IPGPRC2) END,
       K02PANPRC2 = CASE WHEN @K02PANPRC2 = '' THEN NULL ELSE CONVERT(decimal(18,2), @K02PANPRC2) END,
       K02SAFESK1 = CASE WHEN @K02SAFESK1 = '' THEN NULL ELSE CONVERT(decimal(18,2), @K02SAFESK1) END,
       K02BALJUX1 = CASE WHEN @K02BALJUX1 = '' THEN NULL ELSE CONVERT(decimal(18,2), @K02BALJUX1) END,
       K02OVERSK1 = CASE WHEN @K02OVERSK1 = '' THEN NULL ELSE CONVERT(decimal(18,2), @K02OVERSK1) END,
       K02SITE = @K02SITE, K02LOCATION = @K02LOCATION, K02CUSGBCD = @K02CUSGBCD,
       K02DLVRYDATE = CASE WHEN @K02DLVRYDATE = '' THEN NULL ELSE CONVERT(int, @K02DLVRYDATE) END,
       K02LOTCODE = @K02LOTCODE, K02VATGBNM = @K02VATGBNM,
       K02LOCKCD = @K02LOCKCD, K02LOCK_REMARK = @K02LOCK_REMARK,
       K02INS_YN = @K02INS_YN, K02INS_YN2 = @K02INS_YN2,
       K02OWNERCD = @K02OWNERCD, K02ITEMDEPT = @K02ITEMDEPT,
       K02ETCCODE1 = @K02ETCCODE1, K02ETCCODE2 = @K02ETCCODE2, K02ETCCODE3 = @K02ETCCODE3,
       K02ETCCODE4 = @K02ETCCODE4, K02ETCCODE5 = @K02ETCCODE5,
       K02BIGOXX1 = @K02BIGOXX1, K02BIGOXX2 = @K02BIGOXX2, K02BIGOXX3 = @K02BIGOXX3,
       K02BIGOXX4 = @K02BIGOXX4, K02BIGOXX5 = @K02BIGOXX5,
       K02RELEASE_DATE = CASE WHEN @K02RELEASE_DATE = '' THEN NULL ELSE @K02RELEASE_DATE END,
       K02UPDDATE = GETDATE(), K02UPDUSER = @userId
     WHERE K02JPMGBCD = @itemCd`,
    { itemCd, userId, ...buildParams(data) }
  )

  return { warning }
}

export async function deleteItem(
  dbConfig: DbConfig,
  itemCd: string
): Promise<void> {
  // 바코드 테이블 먼저 삭제 후 본 테이블 삭제
  await executeDynamic(
    dbConfig,
    `DELETE FROM TBK02_BARCODE WHERE K02JPMGBCD = @itemCd`,
    { itemCd }
  )
  await executeDynamic(
    dbConfig,
    `DELETE FROM TBK02 WHERE K02JPMGBCD = @itemCd`,
    { itemCd }
  )
}

const FIELD_KEYS = [
  'K02PUMGBN1', 'K02PUMGBN2', 'K02PUMGBN3', 'K02PUMGBN4', 'K02PUMGBN5',
  'K02PUMGBN6', 'K02PUMGBN7', 'K02PUMGBN8', 'K02PUMGBN9',
  'K02SUBULUT', 'K02JPMWGT3', 'K02PACKAGE', 'K02PALLET',
  'K02CLASSCD', 'K02CLASSCD2', 'K02CLASSCD3', 'K02CLASSCD4',
  'K02GUBUN01', 'K02GUBUN02', 'K02GUBUN03',
  'K02EXPIR_YN', 'K02EXPIRDT', 'K02EXPIRVLD',
  'K02PACKAGECD', 'K02DXDSTSYN', 'K02USEFLAG',
  'K02IPGPRC1', 'K02PANPRC1', 'K02IPGPRC2', 'K02PANPRC2',
  'K02SAFESK1', 'K02BALJUX1', 'K02OVERSK1',
  'K02SITE', 'K02LOCATION', 'K02CUSGBCD', 'K02DLVRYDATE',
  'K02LOTCODE', 'K02VATGBNM', 'K02LOCKCD', 'K02LOCK_REMARK',
  'K02INS_YN', 'K02INS_YN2', 'K02OWNERCD', 'K02ITEMDEPT',
  'K02ETCCODE1', 'K02ETCCODE2', 'K02ETCCODE3', 'K02ETCCODE4', 'K02ETCCODE5',
  'K02BIGOXX1', 'K02BIGOXX2', 'K02BIGOXX3', 'K02BIGOXX4', 'K02BIGOXX5',
  'K02RELEASE_DATE',
]

function buildParams(data: Record<string, unknown>): Record<string, string> {
  const params: Record<string, string> = {}
  for (const key of FIELD_KEYS) {
    params[key] = String(data[key] ?? '')
  }
  return params
}
