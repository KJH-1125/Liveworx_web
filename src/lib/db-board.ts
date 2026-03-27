import { queryDynamic, executeDynamic } from './db-dynamic'

export interface BoardDbConfig {
  server: string
  database: string
  user: string
  password: string
  port?: number
}

export async function queryBoard<T>(
  config: BoardDbConfig,
  queryString: string,
  params?: Record<string, unknown>
): Promise<T[]> {
  return queryDynamic<T>(config, queryString, params)
}

export async function executeBoard(
  config: BoardDbConfig,
  queryString: string,
  params?: Record<string, unknown>
): Promise<number> {
  return executeDynamic(config, queryString, params)
}
