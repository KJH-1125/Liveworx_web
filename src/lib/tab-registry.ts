import { lazy } from 'react'

export const tabRegistry: Record<string, { component: React.LazyExoticComponent<React.ComponentType>; label: string }> = {
  '/dashboard':       { component: lazy(() => import('@/components/dashboard/dashboard-page')), label: '대시보드' },
  '/master/customer': { component: lazy(() => import('@/components/master/customer/customer-page')), label: '거래처등록' },
  '/master/item':     { component: lazy(() => import('@/components/master/item/item-page')), label: '제품등록' },
  '/system/qna':      { component: lazy(() => import('@/components/qna/qna-page')), label: '온라인문의' },
}

// DB 메뉴의 /program/xxx 경로를 실제 경로로 변환
const programAliases: Record<string, string> = {
  '/program/pack_bas_cumst': '/master/customer',
  '/program/pack_bas_itmmst': '/master/item',
  '/program/pack_bas_qna_board': '/system/qna',
}

export function resolveTabPath(path: string): string {
  return programAliases[path.toLowerCase()] ?? path
}
