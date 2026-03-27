import { queryDynamic, executeDynamic, executeSPDynamic } from '../db-dynamic'
import { verifyPassword } from '../password'
import type { UserRecord } from '../definitions'

interface DbConfig {
  server: string
  database: string
  user: string
  password: string
  port?: number
}

interface AuthResult {
  success: boolean
  message?: string
  user?: UserRecord
  dbConfig?: DbConfig
  boardDbConfig?: DbConfig
}

const API_URL = 'https://wms3.liveworx.co.kr/dbinfo/getDbinfoList'

/**
 * "server = host,port; uid = user; pwd = pass; database = dbname" 형식 파싱
 */
function parseConnectionString(connStr: string): DbConfig {
  const parts: Record<string, string> = {}
  for (const segment of connStr.split(';')) {
    const [key, ...rest] = segment.split('=')
    if (key && rest.length > 0) {
      parts[key.trim().toLowerCase()] = rest.join('=').trim()
    }
  }

  const serverPart = parts['server'] || ''
  const [server, portStr] = serverPart.includes(',')
    ? [serverPart.split(',')[0].trim(), serverPart.split(',')[1].trim()]
    : [serverPart, '1433']

  return {
    server,
    port: parseInt(portStr) || 1433,
    database: parts['database'] || '',
    user: parts['uid'] || '',
    password: parts['pwd'] || '',
  }
}

async function callExternalApi(
  custCd: string,
  userId: string,
  password: string
): Promise<{ code: number; data?: Record<string, unknown>; message: string }> {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      cust_cd: custCd,
      user_id: userId,
      user_pwd: password,
    }),
  })

  const text = await res.text()
  console.log('[callExternalApi] status:', res.status)

  if (!res.ok || !text) {
    return { code: 9999, message: 'API 서버 응답 오류' }
  }

  const json = JSON.parse(text)
  const item = Array.isArray(json.data) ? json.data[0] : json.data
  return {
    code: json.code || 9999,
    message: json.message || '',
    data: item,
  }
}

export async function authenticateUser(
  custCd: string,
  userId: string,
  password: string,
  clientIp?: string
): Promise<AuthResult> {
  try {
  // 1. 외부 API 호출 → 인증 + DB 접속정보 반환
  const api = await callExternalApi(custCd, userId, password)
  if (api.code !== 200 || !api.data) {
    return { success: false, message: api.message || '인증에 실패했습니다.' }
  }

  const apiData = api.data

  // MAINID DB (str) — c10_user, c00_login, c01_history
  const mainIdStr = String(apiData.str || '')
  if (!mainIdStr) {
    return { success: false, message: 'MAINID DB 접속 정보가 없습니다.' }
  }
  const mainIdDb = parseConnectionString(mainIdStr)

  // Board DB (str2) — 게시판DB
  const boardDbStr = String(apiData.str2 || '')
  const boardDbConfig = boardDbStr ? parseConnectionString(boardDbStr) : undefined

  // API에서 받은 테넌트 접속 인증정보 (db_ip, db_uid, db_pwd)
  const apiDbIp = String(apiData.db_ip || '')
  const apiDbUid = String(apiData.db_uid || '')
  const apiDbPwd = String(apiData.db_pwd || '')
  const [tenantServer, tenantPortStr] = apiDbIp.includes(',')
    ? [apiDbIp.split(',')[0], apiDbIp.split(',')[1]]
    : [apiDbIp, '1433']

  console.log('[authenticateUser] MAINID DB:', mainIdDb.server, mainIdDb.database)

  // 2. c10_user 조회 (MAINID DB) — user_pwd, status_gb, user_ip, user_db
  const c10Users = await queryDynamic<{
    user_id: string; user_pwd: string; status_gb: string;
    user_ip: string; user_db: string
  }>(
    mainIdDb,
    `SELECT user_id, user_pwd, user_ip, user_db, status_gb
     FROM c10_user
     WHERE user_id = @userId AND cust_cd = @custCd`,
    { userId, custCd }
  )

  if (c10Users.length === 0) {
    return { success: false, message: 'CD, ID, PASSWORD 를 확인해 주세요.' }
  }

  const c10 = c10Users[0]
  if (c10.status_gb === '0') {
    return { success: false, message: '중지된 사용자입니다.' }
  }
  if (c10.status_gb === '9') {
    return { success: false, message: '삭제된 사용자입니다.' }
  }

  // 3. 테넌트 DB 연결 — db_ip + db_uid + db_pwd + c10_user.user_db
  const dbConfig: DbConfig = {
    server: tenantServer,
    port: parseInt(tenantPortStr) || 1433,
    database: c10.user_db,
    user: apiDbUid,
    password: apiDbPwd,
  }

  console.log('[authenticateUser] 테넌트 DB:', dbConfig.server, dbConfig.database)

  // 4. T_SYS_USER 조인 조회 (테넌트 DB)
  const users = await queryDynamic<{
    PASSWORD: string; GRPID: string; K01CUSGBCD: string; K01SANGHOX: string;
    PlantCode: string; WorkerName: string; ownercd: string; Lang: string; KONSANGHOX: string
  }>(
    dbConfig,
    `SELECT
       PWD AS PASSWORD
     , 'SYSTEM' AS GRPID
     , K01CUSGBCD
     , K01SANGHOX
     , PlantCode
     , WorkerName
     , ownercd
     , Lang
     , KONSANGHOX
    FROM T_SYS_USER A
       LEFT OUTER JOIN T_SYS_USER_INFO ON WorkerID = user_id
       LEFT OUTER JOIN TBK01 ON K01CUSGBCD = CUST_CD
       LEFT OUTER JOIN TB_OWN ON ownercd = KONCUSGBCD
    WHERE WORKERID = @userId`,
    { userId }
  )

  if (users.length === 0) {
    return { success: false, message: 'MEMBER ID를 확인하세요.' }
  }

  const tenantUser = users[0]

  // 5. 암호화 방식 확인 + 비밀번호 검증
  const encSettings = await queryDynamic<{ CODE_ID: string }>(
    dbConfig,
    `SELECT TOP 1 SubCode AS CODE_ID FROM T_STD_CDMST WHERE ClassCode = 'ENCRYTION'`
  )
  const encryptionType = encSettings.length > 0 ? encSettings[0].CODE_ID : ''

  if (!verifyPassword(password, tenantUser.PASSWORD, encryptionType)) {
    return { success: false, message: '사용자 아이디나, 패스워드가 틀립니다.' }
  }

  // UserRecord 조립
  const user: UserRecord = {
    USER_ID: userId,
    USER_NM: tenantUser.WorkerName || userId,
    USER_PWD: tenantUser.PASSWORD,
    STATUS_GB: c10.status_gb,
    CUST_CD: tenantUser.K01CUSGBCD || '',
    CUST_NM: tenantUser.K01SANGHOX || '',
    PLANT_CD: tenantUser.PlantCode || '',
    OWNER_CD: tenantUser.ownercd || '',
    OWNER_NM: tenantUser.KONSANGHOX || '',
  }

  // 6. 로그인 로깅 (MAINID DB — c00_login, c01_history)
  try {
    const ip = clientIp || '0.0.0.0'

    await executeDynamic(
      mainIdDb,
      `DELETE FROM c00_login WHERE cust_cd = @custCd AND user_id = @userId`,
      { custCd, userId }
    )

    await executeDynamic(
      mainIdDb,
      `INSERT INTO c00_login (cust_cd, user_id, login_info1, login_info2, systime)
       VALUES (@custCd, @userId, @ip, '', GETDATE())`,
      { custCd, userId, ip }
    )

    await executeDynamic(
      mainIdDb,
      `INSERT INTO c01_history (cust_cd, user_id, action_falg, login_ip, login_mac, force_flag, systime)
       VALUES (@custCd, @userId, 'IN', @ip, '', 'N', GETDATE())`,
      { custCd, userId, ip }
    )
  } catch (err) {
    console.log('[authenticateUser] 로그인 로깅 실패:', (err as Error).message)
  }

  // SP 실행 (테넌트 DB)
  try {
    const ip = clientIp || '0.0.0.0'
    await executeSPDynamic(dbConfig, 'SP_SYS_ACCES_I1', {
      MAKEDATE: new Date(),
      MAKER: userId,
      IPADDRESS: ip,
    })
  } catch { /* SP가 없을 수 있음 */ }

  try {
    const ip = clientIp || '0.0.0.0'
    await executeSPDynamic(dbConfig, 'SP_SYS_WRKLOG_I1', {
      PROGRAMID: 'MAIN',
      WORKERID: userId,
      WORKTYPE: 'LOGIN',
      IP: ip,
      COMNAME: 'WEB',
    })
  } catch { /* SP가 없을 수 있음 */ }

  return { success: true, user, dbConfig, boardDbConfig }
  } catch (err) {
    console.error('[authenticateUser] 예외:', err)
    return { success: false, message: `서버 오류: ${(err as Error).message}` }
  }
}

export async function logLogout(
  dbConfig: DbConfig,
  userId: string,
  custCd: string,
  clientIp?: string
): Promise<void> {
  try {
    const ip = clientIp || '0.0.0.0'

    // SP_SYS_WRKLOG_I1 (테넌트 DB)
    try {
      await executeSPDynamic(dbConfig, 'SP_SYS_WRKLOG_I1', {
        PROGRAMID: 'MAIN',
        WORKERID: userId,
        WORKTYPE: 'LOGOUT',
        IP: ip,
        COMNAME: 'WEB',
      })
    } catch { /* SP가 없을 수 있음 */ }
  } catch {
    // 로그아웃 로깅 실패는 무시
  }
}
