'use client'

import { useState, useEffect, useActionState } from 'react'
import { saveCustomer } from '@/app/actions/customer'
import type { CustomerDetail } from '@/lib/services/customer-service'

interface Props {
  customer: CustomerDetail | null
  mode: 'view' | 'edit' | 'new'
  onSaved: (custCd: string) => void
}

type Tab = 'basic' | 'business' | 'extra'

const emptyCustomer: CustomerDetail = {
  K01CUSGBCD: '', K01SANGHOX: '', K01SANGHO2: '', K01SANGHOE: '',
  K01SAUJANO: '', K01GUBUN01: 'T', K01GUBUN03: '', K01DLTCODE: 'N',
  K01BOSS001: '', K01UPTEXXX: '', K01JONGMOK: '', K01ADDRES1: '',
  K01ADDRES2: '', K01POST001: '', K01TELX001: '', K01FAXXNOX: '',
  K01BOSS002: '', K01BOSS002_CEL: '', K01HOMEPG1: '', K01EMAIL01: '',
  K01EMAIL02: '', K01GUBUN04: '', K01GUBUN05: '', K01GUBUN06: '',
  K01JIOGXXX: '', K01PUMKCD: '', K01OPENDAY: '', K01TRATDAY: '',
  K01GULJECD: '', K01GULJEDY: '', K01KINDBAD: 'COM', K01BANKCD: '',
  K01BANKACC: '', K01BANKHLD: '', K01VATMAN1: '', K01VATTEL1: '',
  K01VATSMS1: '', K01MANCD01: '', K01MANNM01: '', K01MANCD02: '',
  K01MANNM02: '', K01SHIPINFO: '', K01DELVTYPE: '', K01SHIP_ADDRES1: '',
  K01SHIP_ADDRES2: '', K01SHIP_POST001: '', K01SHIP_BOSS001: '',
  K01SHIP_BOSS001_CEL: '', K01DELVMON: '', K01DELVTUE: '', K01DELVWED: '',
  K01DELVTHU: '', K01DELVFRI: '', K01DELVSAT: '', K01DELVSUN: '',
  K01OWNERCD: '', K01OPTCHAR01: '', K01OPTCHAR02: '', K01OPTCHAR03: '',
  K01ETCCODE1: '', K01ETCCODE2: '', K01ETCCODE3: '', K01ETCCODE4: '',
  K01ETCCODE5: '', K01COMMISSION_RATE: '', K01REMARKS: '', K01BIGO101: '',
}

export default function CustomerForm({ customer, mode, onSaved }: Props) {
  const [tab, setTab] = useState<Tab>('basic')
  const [form, setForm] = useState<CustomerDetail>(customer || emptyCustomer)
  const [state, formAction, isPending] = useActionState(saveCustomer, undefined)

  useEffect(() => {
    setForm(customer || emptyCustomer)
    setTab('basic')
  }, [customer, mode])

  useEffect(() => {
    if (state?.success && state.custCd) {
      onSaved(state.custCd)
    }
  }, [state, onSaved])

  const set = (field: keyof CustomerDetail, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const isNew = mode === 'new'
  const tabClass = (t: Tab) =>
    `px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
      tab === t
        ? 'border-teal-600 text-teal-600 dark:border-teal-400 dark:text-teal-400'
        : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
    }`

  return (
    <div className="flex h-full flex-col">
      {/* Tabs */}
      <div className="flex border-b border-[var(--border)]">
        <button type="button" className={tabClass('basic')} onClick={() => setTab('basic')}>기본정보</button>
        <button type="button" className={tabClass('business')} onClick={() => setTab('business')}>사업정보</button>
        <button type="button" className={tabClass('extra')} onClick={() => setTab('extra')}>추가정보</button>
      </div>

      {/* Messages */}
      {state?.error && (
        <div className="mx-4 mt-3 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600 dark:bg-rose-900/20 dark:text-rose-400">
          {state.error}
        </div>
      )}
      {state?.warning && (
        <div className="mx-4 mt-3 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
          {state.warning}
        </div>
      )}

      {/* Form */}
      <form id="customer-form" action={formAction} className="flex-1 overflow-y-auto p-4">
        <input type="hidden" name="_mode" value={isNew ? 'new' : 'edit'} />
        <input type="hidden" name="K01CUSGBCD" value={form.K01CUSGBCD} />

        <div className={tab === 'basic' ? '' : 'hidden'}><BasicTab form={form} set={set} isNew={isNew} /></div>
        <div className={tab === 'business' ? '' : 'hidden'}><BusinessTab form={form} set={set} /></div>
        <div className={tab === 'extra' ? '' : 'hidden'}><ExtraTab form={form} set={set} /></div>
      </form>
    </div>
  )
}

const labelClass = 'block text-xs font-medium text-[var(--text-secondary)] mb-1'
const inputClass = 'w-full h-8 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 text-sm text-[var(--text-primary)]'
const readonlyClass = 'w-full h-8 rounded-lg border border-[var(--border)] bg-[var(--surface-hover)] px-2.5 text-sm text-[var(--text-secondary)]'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      {children}
    </div>
  )
}

function BasicTab({ form, set, isNew }: { form: CustomerDetail; set: (f: keyof CustomerDetail, v: string) => void; isNew: boolean }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <Field label="거래처코드">
        <input
          value={isNew ? '(자동채번)' : form.K01CUSGBCD}
          readOnly
          className={readonlyClass}
        />
      </Field>
      <Field label="상호 *">
        <input
          name="K01SANGHOX"
          value={form.K01SANGHOX}
          onChange={e => set('K01SANGHOX', e.target.value)}
          required
          className={inputClass}
        />
      </Field>
      <Field label="상호(약칭)">
        <input name="K01SANGHO2" value={form.K01SANGHO2} onChange={e => set('K01SANGHO2', e.target.value)} className={inputClass} />
      </Field>
      <Field label="상호(영문)">
        <input name="K01SANGHOE" value={form.K01SANGHOE} onChange={e => set('K01SANGHOE', e.target.value)} className={inputClass} />
      </Field>
      <Field label="사업자번호">
        <input name="K01SAUJANO" value={form.K01SAUJANO} onChange={e => set('K01SAUJANO', e.target.value)} placeholder="000-00-00000" className={inputClass} />
      </Field>
      <Field label="매입매출구분">
        <div className="flex h-8 items-center gap-4">
          {([['P', '매입'], ['S', '매출'], ['T', '매입매출']] as const).map(([val, label]) => (
            <label key={val} className="flex items-center gap-1 text-sm text-[var(--text-secondary)]">
              <input type="radio" name="K01GUBUN01" value={val} checked={form.K01GUBUN01 === val} onChange={() => set('K01GUBUN01', val)} className="accent-teal-600" />
              {label}
            </label>
          ))}
        </div>
      </Field>
      <Field label="거래처구분">
        <input name="K01GUBUN03" value={form.K01GUBUN03} onChange={e => set('K01GUBUN03', e.target.value)} className={inputClass} />
      </Field>
      <Field label="사용여부">
        <div className="flex h-8 items-center gap-4">
          {([['N', '사용'], ['Y', '삭제']] as const).map(([val, label]) => (
            <label key={val} className="flex items-center gap-1 text-sm text-[var(--text-secondary)]">
              <input type="radio" name="K01DLTCODE" value={val} checked={form.K01DLTCODE === val} onChange={() => set('K01DLTCODE', val)} className="accent-teal-600" />
              {label}
            </label>
          ))}
        </div>
      </Field>
      <Field label="대표자">
        <input name="K01BOSS001" value={form.K01BOSS001} onChange={e => set('K01BOSS001', e.target.value)} className={inputClass} />
      </Field>
      <Field label="업태">
        <input name="K01UPTEXXX" value={form.K01UPTEXXX} onChange={e => set('K01UPTEXXX', e.target.value)} className={inputClass} />
      </Field>
      <Field label="종목">
        <input name="K01JONGMOK" value={form.K01JONGMOK} onChange={e => set('K01JONGMOK', e.target.value)} className={inputClass} />
      </Field>
      <Field label="우편번호">
        <input name="K01POST001" value={form.K01POST001} onChange={e => set('K01POST001', e.target.value)} className={inputClass} />
      </Field>
      <div className="sm:col-span-2">
        <Field label="주소">
          <input name="K01ADDRES1" value={form.K01ADDRES1} onChange={e => set('K01ADDRES1', e.target.value)} className={inputClass} />
        </Field>
      </div>
      <div className="sm:col-span-2">
        <Field label="상세주소">
          <input name="K01ADDRES2" value={form.K01ADDRES2} onChange={e => set('K01ADDRES2', e.target.value)} className={inputClass} />
        </Field>
      </div>
      <Field label="전화번호">
        <input name="K01TELX001" value={form.K01TELX001} onChange={e => set('K01TELX001', e.target.value)} className={inputClass} />
      </Field>
      <Field label="팩스번호">
        <input name="K01FAXXNOX" value={form.K01FAXXNOX} onChange={e => set('K01FAXXNOX', e.target.value)} className={inputClass} />
      </Field>
      <Field label="업체담당자">
        <input name="K01BOSS002" value={form.K01BOSS002} onChange={e => set('K01BOSS002', e.target.value)} className={inputClass} />
      </Field>
      <Field label="담당자연락처">
        <input name="K01BOSS002_CEL" value={form.K01BOSS002_CEL} onChange={e => set('K01BOSS002_CEL', e.target.value)} className={inputClass} />
      </Field>
      <Field label="홈페이지">
        <input name="K01HOMEPG1" value={form.K01HOMEPG1} onChange={e => set('K01HOMEPG1', e.target.value)} className={inputClass} />
      </Field>
      <Field label="계산서 E-mail">
        <input name="K01EMAIL01" value={form.K01EMAIL01} onChange={e => set('K01EMAIL01', e.target.value)} type="email" className={inputClass} />
      </Field>
      <Field label="대표 E-mail">
        <input name="K01EMAIL02" value={form.K01EMAIL02} onChange={e => set('K01EMAIL02', e.target.value)} type="email" className={inputClass} />
      </Field>
    </div>
  )
}

function BusinessTab({ form, set }: { form: CustomerDetail; set: (f: keyof CustomerDetail, v: string) => void }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <Field label="대분류">
        <input name="K01GUBUN04" value={form.K01GUBUN04} onChange={e => set('K01GUBUN04', e.target.value)} className={inputClass} />
      </Field>
      <Field label="중분류">
        <input name="K01GUBUN05" value={form.K01GUBUN05} onChange={e => set('K01GUBUN05', e.target.value)} className={inputClass} />
      </Field>
      <Field label="소분류">
        <input name="K01GUBUN06" value={form.K01GUBUN06} onChange={e => set('K01GUBUN06', e.target.value)} className={inputClass} />
      </Field>
      <Field label="지역">
        <input name="K01JIOGXXX" value={form.K01JIOGXXX} onChange={e => set('K01JIOGXXX', e.target.value)} className={inputClass} />
      </Field>
      <Field label="업종">
        <input name="K01PUMKCD" value={form.K01PUMKCD} onChange={e => set('K01PUMKCD', e.target.value)} className={inputClass} />
      </Field>
      <Field label="개업일">
        <input name="K01OPENDAY" type="date" value={form.K01OPENDAY} onChange={e => set('K01OPENDAY', e.target.value)} className={inputClass} />
      </Field>
      <Field label="거래시작일">
        <input name="K01TRATDAY" type="date" value={form.K01TRATDAY} onChange={e => set('K01TRATDAY', e.target.value)} className={inputClass} />
      </Field>
      <Field label="결제조건">
        <input name="K01GULJECD" value={form.K01GULJECD} onChange={e => set('K01GULJECD', e.target.value)} className={inputClass} />
      </Field>
      <Field label="결제일자 (1~31)">
        <input name="K01GULJEDY" type="number" min={1} max={31} value={form.K01GULJEDY} onChange={e => set('K01GULJEDY', e.target.value)} className={inputClass} />
      </Field>
      <Field label="불량구분">
        <div className="flex h-8 items-center gap-4">
          {([['COM', '정상'], ['BAD', '불량']] as const).map(([val, label]) => (
            <label key={val} className="flex items-center gap-1 text-sm text-[var(--text-secondary)]">
              <input type="radio" name="K01KINDBAD" value={val} checked={form.K01KINDBAD === val} onChange={() => set('K01KINDBAD', val)} className="accent-teal-600" />
              {label}
            </label>
          ))}
        </div>
      </Field>
      <Field label="은행">
        <input name="K01BANKCD" value={form.K01BANKCD} onChange={e => set('K01BANKCD', e.target.value)} className={inputClass} />
      </Field>
      <Field label="계좌번호">
        <input name="K01BANKACC" value={form.K01BANKACC} onChange={e => set('K01BANKACC', e.target.value)} className={inputClass} />
      </Field>
      <Field label="예금주명">
        <input name="K01BANKHLD" value={form.K01BANKHLD} onChange={e => set('K01BANKHLD', e.target.value)} className={inputClass} />
      </Field>
      <Field label="계산서 담당자">
        <input name="K01VATMAN1" value={form.K01VATMAN1} onChange={e => set('K01VATMAN1', e.target.value)} className={inputClass} />
      </Field>
      <Field label="계산서 연락처">
        <input name="K01VATTEL1" value={form.K01VATTEL1} onChange={e => set('K01VATTEL1', e.target.value)} className={inputClass} />
      </Field>
      <Field label="SMS 수신여부">
        <div className="flex h-8 items-center">
          <label className="flex items-center gap-1 text-sm text-[var(--text-secondary)]">
            <input
              type="checkbox"
              name="K01VATSMS1"
              checked={form.K01VATSMS1 === 'Y'}
              onChange={e => set('K01VATSMS1', e.target.checked ? 'Y' : 'N')}
              className="accent-teal-600"
            />
            수신
          </label>
        </div>
      </Field>
      <Field label="영업담당자코드">
        <input name="K01MANCD01" value={form.K01MANCD01} onChange={e => set('K01MANCD01', e.target.value)} className={inputClass} />
      </Field>
      <Field label="영업담당자명">
        <input name="K01MANNM01" value={form.K01MANNM01} onChange={e => set('K01MANNM01', e.target.value)} className={inputClass} />
      </Field>
      <Field label="영업담당자코드2">
        <input name="K01MANCD02" value={form.K01MANCD02} onChange={e => set('K01MANCD02', e.target.value)} className={inputClass} />
      </Field>
      <Field label="영업담당자명2">
        <input name="K01MANNM02" value={form.K01MANNM02} onChange={e => set('K01MANNM02', e.target.value)} className={inputClass} />
      </Field>
    </div>
  )
}

function ExtraTab({ form, set }: { form: CustomerDetail; set: (f: keyof CustomerDetail, v: string) => void }) {
  const days: [keyof CustomerDetail, string][] = [
    ['K01DELVMON', '월'], ['K01DELVTUE', '화'], ['K01DELVWED', '수'],
    ['K01DELVTHU', '목'], ['K01DELVFRI', '금'], ['K01DELVSAT', '토'], ['K01DELVSUN', '일'],
  ]

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <Field label="배송정보">
        <input name="K01SHIPINFO" value={form.K01SHIPINFO} onChange={e => set('K01SHIPINFO', e.target.value)} className={inputClass} />
      </Field>
      <Field label="납품방법">
        <input name="K01DELVTYPE" value={form.K01DELVTYPE} onChange={e => set('K01DELVTYPE', e.target.value)} className={inputClass} />
      </Field>
      <div className="sm:col-span-2">
        <Field label="배송지 주소">
          <input name="K01SHIP_ADDRES1" value={form.K01SHIP_ADDRES1} onChange={e => set('K01SHIP_ADDRES1', e.target.value)} className={inputClass} />
        </Field>
      </div>
      <div className="sm:col-span-2">
        <Field label="배송지 상세주소">
          <input name="K01SHIP_ADDRES2" value={form.K01SHIP_ADDRES2} onChange={e => set('K01SHIP_ADDRES2', e.target.value)} className={inputClass} />
        </Field>
      </div>
      <Field label="배송지 우편번호">
        <input name="K01SHIP_POST001" value={form.K01SHIP_POST001} onChange={e => set('K01SHIP_POST001', e.target.value)} className={inputClass} />
      </Field>
      <Field label="배송지 업체담당자">
        <input name="K01SHIP_BOSS001" value={form.K01SHIP_BOSS001} onChange={e => set('K01SHIP_BOSS001', e.target.value)} className={inputClass} />
      </Field>
      <Field label="배송지 담당자연락처">
        <input name="K01SHIP_BOSS001_CEL" value={form.K01SHIP_BOSS001_CEL} onChange={e => set('K01SHIP_BOSS001_CEL', e.target.value)} className={inputClass} />
      </Field>
      <div className="sm:col-span-2">
        <Field label="배송요일">
          <div className="flex h-8 flex-wrap items-center gap-3">
            {days.map(([field, label]) => (
              <label key={field} className="flex items-center gap-1 text-sm text-[var(--text-secondary)]">
                <input
                  type="checkbox"
                  name={field}
                  checked={form[field] === 'Y'}
                  onChange={e => set(field, e.target.checked ? 'Y' : 'N')}
                  className="accent-teal-600"
                />
                {label}
              </label>
            ))}
          </div>
        </Field>
      </div>
      <Field label="화주코드">
        <input name="K01OWNERCD" value={form.K01OWNERCD} onChange={e => set('K01OWNERCD', e.target.value)} className={inputClass} />
      </Field>
      <Field label="옵션1">
        <input name="K01OPTCHAR01" value={form.K01OPTCHAR01} onChange={e => set('K01OPTCHAR01', e.target.value)} className={inputClass} />
      </Field>
      <Field label="옵션2">
        <input name="K01OPTCHAR02" value={form.K01OPTCHAR02} onChange={e => set('K01OPTCHAR02', e.target.value)} className={inputClass} />
      </Field>
      <Field label="옵션3">
        <input name="K01OPTCHAR03" value={form.K01OPTCHAR03} onChange={e => set('K01OPTCHAR03', e.target.value)} className={inputClass} />
      </Field>
      <Field label="참고코드1">
        <input name="K01ETCCODE1" value={form.K01ETCCODE1} onChange={e => set('K01ETCCODE1', e.target.value)} className={inputClass} />
      </Field>
      <Field label="참고코드2">
        <input name="K01ETCCODE2" value={form.K01ETCCODE2} onChange={e => set('K01ETCCODE2', e.target.value)} className={inputClass} />
      </Field>
      <Field label="참고코드3">
        <input name="K01ETCCODE3" value={form.K01ETCCODE3} onChange={e => set('K01ETCCODE3', e.target.value)} className={inputClass} />
      </Field>
      <Field label="참고코드4">
        <input name="K01ETCCODE4" value={form.K01ETCCODE4} onChange={e => set('K01ETCCODE4', e.target.value)} className={inputClass} />
      </Field>
      <Field label="참고코드5">
        <input name="K01ETCCODE5" value={form.K01ETCCODE5} onChange={e => set('K01ETCCODE5', e.target.value)} className={inputClass} />
      </Field>
      <Field label="수수료율">
        <input name="K01COMMISSION_RATE" type="number" step="0.01" value={form.K01COMMISSION_RATE} onChange={e => set('K01COMMISSION_RATE', e.target.value)} className={inputClass} />
      </Field>
      <Field label="내부비고1">
        <input name="K01BIGO101" value={form.K01BIGO101} onChange={e => set('K01BIGO101', e.target.value)} className={inputClass} />
      </Field>
      <div className="sm:col-span-2">
        <Field label="메모">
          <textarea
            name="K01REMARKS"
            value={form.K01REMARKS}
            onChange={e => set('K01REMARKS', e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1.5 text-sm text-[var(--text-primary)]"
          />
        </Field>
      </div>
    </div>
  )
}
