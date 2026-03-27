export interface SessionPayload {
  userId: string
  userName: string
  custCd: string
  custNm: string
  plantCd: string
  ownerCd: string
  ownerNm: string
  langCd: string
  dbServer: string
  dbPort: number
  dbName: string
  dbUser: string
  dbPassword: string
  boardDbServer: string
  boardDbPort: number
  boardDbName: string
  boardDbUser: string
  boardDbPassword: string
  expiresAt: string
}

export interface LoginFormState {
  errors?: {
    custCd?: string[]
    userId?: string[]
    password?: string[]
  }
  message?: string
}

export interface UserRecord {
  USER_ID: string
  USER_NM: string
  USER_PWD: string
  CUST_CD: string
  CUST_NM: string
  PLANT_CD: string
  OWNER_CD: string
  OWNER_NM: string
  STATUS_GB: string
}
