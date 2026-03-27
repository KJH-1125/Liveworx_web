import LoginForm from './login-form'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen bg-[var(--background)]">
      {/* 좌측: 브랜드 비주얼 영역 */}
      <div className="relative hidden w-1/2 overflow-hidden bg-slate-900 lg:flex lg:flex-col lg:justify-between">
        {/* 기하학 패턴 배경 */}
        <div className="absolute inset-0 opacity-10">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#2dd4bf" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        {/* 그라데이션 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900/95 to-teal-900/40" />

        {/* 콘텐츠 */}
        <div className="relative z-10 flex flex-1 flex-col justify-center px-12 xl:px-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500/20 backdrop-blur-sm">
              <svg className="h-7 w-7 text-teal-400" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 2L3 7v6l7 5 7-5V7l-7-5zM10 4.5L14.5 7.5v5L10 15.5 5.5 12.5v-5L10 4.5z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">LiveWorx</h1>
          </div>
          <p className="text-xl font-semibold text-slate-200 mb-3">
            Smart Manufacturing Platform
          </p>
          <p className="text-sm leading-relaxed text-slate-400 max-w-md">
            통합 생산관리 시스템으로 제조 현장의 효율을 극대화하세요.
            주문, 생산, 재고, 출하까지 원스톱 관리가 가능합니다.
          </p>

          {/* 특징 리스트 */}
          <div className="mt-10 space-y-4">
            {[
              ['실시간 생산 모니터링', '현장 데이터를 실시간으로 수집하고 분석합니다'],
              ['통합 재고 관리', '원자재부터 완제품까지 전 공정 재고를 추적합니다'],
              ['데이터 기반 의사결정', '생산 데이터 분석으로 최적의 의사결정을 지원합니다'],
            ].map(([title, desc]) => (
              <div key={title} className="flex items-start gap-3">
                <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-400" />
                <div>
                  <p className="text-sm font-medium text-slate-200">{title}</p>
                  <p className="text-xs text-slate-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 하단 */}
        <div className="relative z-10 px-12 py-6 xl:px-16">
          <p className="text-xs text-slate-600">&copy; 2026 LiveWorx. All rights reserved.</p>
        </div>
      </div>

      {/* 우측: 로그인 폼 */}
      <div className="flex flex-1 items-center justify-center px-6">
        <div className="w-full max-w-sm">
          {/* 모바일 로고 */}
          <div className="mb-8 text-center lg:hidden">
            <div className="inline-flex items-center gap-2.5 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600/10">
                <svg className="h-5.5 w-5.5 text-teal-600 dark:text-teal-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 2L3 7v6l7 5 7-5V7l-7-5zM10 4.5L14.5 7.5v5L10 15.5 5.5 12.5v-5L10 4.5z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">
                LiveWorx
              </h1>
            </div>
            <p className="text-sm text-[var(--text-secondary)]">
              ERP/MES 시스템에 로그인하세요
            </p>
          </div>

          {/* 데스크탑 제목 */}
          <div className="mb-8 hidden lg:block">
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">로그인</h2>
            <p className="mt-1.5 text-sm text-[var(--text-secondary)]">
              시스템에 접속하려면 로그인하세요
            </p>
          </div>

          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-md)]">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  )
}
