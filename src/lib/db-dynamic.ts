import sql from 'mssql'

export async function connectDynamic(config: {
  server: string
  database: string
  user: string
  password: string
  port?: number
}): Promise<sql.ConnectionPool> {
  const pool = new sql.ConnectionPool({
    server: config.server,
    database: config.database,
    user: config.user,
    password: config.password,
    port: config.port || 1433,
    options: {
      encrypt: false,
      trustServerCertificate: true,
    },
    pool: {
      max: 5,
      min: 0,
      idleTimeoutMillis: 30000,
    },
  })
  await pool.connect()
  return pool
}

export async function queryDynamic<T>(
  config: {
    server: string
    database: string
    user: string
    password: string
    port?: number
  },
  queryString: string,
  params?: Record<string, unknown>
): Promise<T[]> {
  const pool = await connectDynamic(config)
  try {
    const request = pool.request()
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        request.input(key, value)
      }
    }
    const result = await request.query(queryString)
    return result.recordset as T[]
  } finally {
    await pool.close()
  }
}

export async function executeDynamic(
  config: {
    server: string
    database: string
    user: string
    password: string
    port?: number
  },
  queryString: string,
  params?: Record<string, unknown>
): Promise<number> {
  const pool = await connectDynamic(config)
  try {
    const request = pool.request()
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        request.input(key, value)
      }
    }
    const result = await request.query(queryString)
    return result.rowsAffected[0]
  } finally {
    await pool.close()
  }
}

export async function executeSPDynamic<T>(
  config: {
    server: string
    database: string
    user: string
    password: string
    port?: number
  },
  spName: string,
  params?: Record<string, unknown>
): Promise<{ recordset: T[]; returnValue: number }> {
  const pool = await connectDynamic(config)
  try {
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
  } finally {
    await pool.close()
  }
}
