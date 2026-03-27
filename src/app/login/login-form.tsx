'use client'

import { useActionState } from 'react'
import { login } from '@/app/actions/auth'

export default function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined)

  return (
    <form action={action} className="space-y-5">
      {state?.message && (
        <div className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700 dark:bg-rose-900/20 dark:text-rose-400">
          {state.message}
        </div>
      )}

      <div>
        <label
          htmlFor="custCd"
          className="block text-sm font-medium text-[var(--text-primary)] mb-1.5"
        >
          거래처코드
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <svg className="h-4 w-4 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 0h.008v.008h-.008V7.5Z" />
            </svg>
          </div>
          <input
            id="custCd"
            name="custCd"
            type="text"
            required
            autoComplete="organization"
            className="block w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] py-2.5 pl-10 pr-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] shadow-sm"
          />
        </div>
        {state?.errors?.custCd && (
          <p className="mt-1 text-xs text-rose-600">{state.errors.custCd[0]}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="userId"
          className="block text-sm font-medium text-[var(--text-primary)] mb-1.5"
        >
          사용자 ID
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <svg className="h-4 w-4 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
          </div>
          <input
            id="userId"
            name="userId"
            type="text"
            required
            autoComplete="username"
            className="block w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] py-2.5 pl-10 pr-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] shadow-sm"
          />
        </div>
        {state?.errors?.userId && (
          <p className="mt-1 text-xs text-rose-600">{state.errors.userId[0]}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-[var(--text-primary)] mb-1.5"
        >
          비밀번호
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <svg className="h-4 w-4 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="block w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] py-2.5 pl-10 pr-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] shadow-sm"
          />
        </div>
        {state?.errors?.password && (
          <p className="mt-1 text-xs text-rose-600">{state.errors.password[0]}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-teal-600 dark:hover:bg-teal-500 dark:focus:ring-offset-slate-900"
      >
        {pending ? '로그인 중...' : '로그인'}
      </button>
    </form>
  )
}
