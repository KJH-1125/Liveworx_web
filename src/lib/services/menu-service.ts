import { queryDynamic } from '@/lib/db-dynamic'

export interface MenuItem {
  id: string
  label: string
  icon: string
  href?: string
  children?: MenuItem[]
}

interface MenuRow {
  MENUID: number
  MENUNAME: string
  PARMENUID: number
  SORT: number
  PROGRAMID: string
  MENUTYPE: string // 'M' = folder, 'P' = program
  NAMESPACE: string | null
  FILEID: string | null
}

interface DbConfig {
  server: string
  database: string
  user: string
  password: string
  port?: number
}

function buildMenuTree(rows: MenuRow[], parentId: number): MenuItem[] {
  return rows
    .filter((r) => r.PARMENUID === parentId)
    .map((row) => {
      if (row.MENUTYPE === 'M') {
        const children = buildMenuTree(rows, row.MENUID)
        return {
          id: String(row.MENUID),
          label: row.MENUNAME,
          icon: 'folder',
          ...(children.length > 0 ? { children } : {}),
        }
      }
      return {
        id: String(row.MENUID),
        label: row.MENUNAME,
        icon: row.PROGRAMID ? 'file' : 'file',
        href: row.PROGRAMID
          ? `/program/${row.PROGRAMID.toLowerCase()}`
          : undefined,
      }
    })
}

export async function getMenuItemsFromDB(
  dbConfig: DbConfig,
  userId: string
): Promise<MenuItem[]> {
  try {
    const rows = await queryDynamic<MenuRow>(
      dbConfig,
      `SELECT DISTINCT MENU.MENUID, MENU.MENUNAME, MENU.PARMENUID, MENU.SORT,
              MENU.PROGRAMID, MENU.MENUTYPE, PROGRAM.NAMESPACE, PROGRAM.FILEID
       FROM T_SYS_MAMNU MENU
       LEFT OUTER JOIN T_SYS_MAPGM PROGRAM
             ON MENU.PROGRAMID = PROGRAM.PROGRAMID AND PROGRAM.WORKERID = 'SYSTEM'
       WHERE MENU.WORKERID = @userId
         AND MENU.USEFLAG = 'Y'
       ORDER BY MENU.PARMENUID, MENU.SORT`,
      { userId }
    )

    if (rows.length === 0) {
      return getMenuItems()
    }

    return buildMenuTree(rows, 0)
  } catch (error) {
    console.error('Failed to load menu from DB, using fallback:', error)
    return getMenuItems()
  }
}

export function getMenuItems(): MenuItem[] {
  return [
    {
      id: 'orders',
      label: '주문관리',
      icon: 'clipboard',
      children: [
        { id: 'order-register', label: '주문등록', icon: 'clipboard', href: '/orders/register' },
        { id: 'order-search', label: '주문조회', icon: 'clipboard', href: '/orders/search' },
        { id: 'order-status', label: '주문현황', icon: 'clipboard', href: '/orders/status' },
      ],
    },
    {
      id: 'inventory',
      label: '재고관리',
      icon: 'archive',
      children: [
        { id: 'inv-status', label: '재고현황', icon: 'archive', href: '/inventory/status' },
        { id: 'inv-io', label: '입출고관리', icon: 'archive', href: '/inventory/io' },
        { id: 'inv-adjust', label: '재고조정', icon: 'archive', href: '/inventory/adjust' },
      ],
    },
    {
      id: 'production',
      label: '생산관리',
      icon: 'cog',
      children: [
        { id: 'prod-order', label: '작업지시', icon: 'cog', href: '/production/order' },
        { id: 'prod-result', label: '생산실적', icon: 'cog', href: '/production/result' },
        { id: 'prod-status', label: '생산현황', icon: 'cog', href: '/production/status' },
      ],
    },
    {
      id: 'shipping',
      label: '출하관리',
      icon: 'truck',
      children: [
        { id: 'ship-register', label: '출하등록', icon: 'truck', href: '/shipping/register' },
        { id: 'ship-status', label: '출하현황', icon: 'truck', href: '/shipping/status' },
      ],
    },
    {
      id: 'master',
      label: '기준정보',
      icon: 'database',
      children: [
        { id: 'master-customer', label: '거래처등록', icon: 'database', href: '/master/customer' },
        { id: 'master-item', label: '제품등록', icon: 'database', href: '/master/item' },
      ],
    },
    {
      id: 'system',
      label: '시스템관리',
      icon: 'settings',
      children: [
        { id: 'sys-user', label: '사용자관리', icon: 'settings', href: '/system/users' },
        { id: 'sys-auth', label: '권한관리', icon: 'settings', href: '/system/auth' },
        { id: 'sys-code', label: '코드관리', icon: 'settings', href: '/system/codes' },
      ],
    },
  ]
}
