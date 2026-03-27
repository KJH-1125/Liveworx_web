import sql from 'mssql'

const config: sql.config = {
  server: process.env.DB_SERVER || 'localhost',
  database: process.env.DB_NAME || '',
  user: process.env.DB_USER || '',
  password: process.env.DB_PASSWORD || '',
  port: Number(process.env.DB_PORT) || 1433,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
}

let pool: sql.ConnectionPool | null = null

export async function getPool(): Promise<sql.ConnectionPool> {
  if (!pool) {
    pool = await sql.connect(config)
  }
  return pool
}

/**
 * SELECT 쿼리 실행 - recordset 반환
 */
export async function query<T = sql.IRecordSet<unknown>>(
  queryString: string,
  params?: Record<string, unknown>
): Promise<T[]> {
  const pool = await getPool()
  const request = pool.request()

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      request.input(key, value)
    }
  }

  const result = await request.query(queryString)
  return result.recordset as T[]
}

/**
 * INSERT/UPDATE/DELETE 쿼리 실행 - rowsAffected 반환
 */
export async function execute(
  queryString: string,
  params?: Record<string, unknown>
): Promise<number> {
  const pool = await getPool()
  const request = pool.request()

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      request.input(key, value)
    }
  }

  const result = await request.query(queryString)
  return result.rowsAffected[0]
}

/**
 * 저장 프로시저 실행
 */
export async function executeSP<T = sql.IRecordSet<unknown>>(
  spName: string,
  params?: Record<string, unknown>
): Promise<{ recordset: T[]; returnValue: number }> {
  const pool = await getPool()
  const request = pool.request()

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      request.input(key, value)
    }
  }

  const result = await request.execute(spName)
  return {
    recordset: result.recordset as T[],
    returnValue: result.returnValue,
  }
}
