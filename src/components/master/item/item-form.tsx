'use client'

import { useState, useEffect, useActionState } from 'react'
import { saveItem } from '@/app/actions/item'
import type { ItemDetail } from '@/lib/services/item-service'

interface Props {
  item: ItemDetail | null
  mode: 'view' | 'edit' | 'new'
  onSaved: (itemCd: string) => void
}

type Tab = 'basic' | 'price' | 'extra'

const emptyItem: ItemDetail = {
  K02JPMGBCD: '', K02PUMGBN1: '', K02PUMGBN2: '', K02PUMGBN3: '',
  K02PUMGBN4: '', K02PUMGBN5: '',
  K02PUMGBN6: '', K02PUMGBN7: '', K02PUMGBN8: '', K02PUMGBN9: '',
  K02SUBULUT: '', K02JPMWGT3: '', K02PACKAGE: '', K02PALLET: '',
  K02CLASSCD: '', K02CLASSCD2: '', K02CLASSCD3: '', K02CLASSCD4: '',
  K02GUBUN01: '', K02GUBUN02: '', K02GUBUN03: '',
  K02EXPIR_YN: 'N', K02EXPIRDT: '', K02EXPIRVLD: '',
  K02PACKAGECD: 'N', K02DXDSTSYN: 'N', K02USEFLAG: 'Y',
  K02IPGPRC1: '', K02PANPRC1: '', K02IPGPRC2: '', K02PANPRC2: '',
  K02SAFESK1: '', K02BALJUX1: '', K02OVERSK1: '',
  K02SITE: '', K02LOCATION: '', K02CUSGBCD: '', K02DLVRYDATE: '',
  K02LOTCODE: 'N', K02VATGBNM: '',
  K02LOCKCD: 'N', K02LOCK_REMARK: '',
  K02INS_YN: 'N', K02INS_YN2: 'N',
  K02OWNERCD: '', K02ITEMDEPT: '',
  K02ETCCODE1: '', K02ETCCODE2: '', K02ETCCODE3: '', K02ETCCODE4: '', K02ETCCODE5: '',
  K02BIGOXX1: '', K02BIGOXX2: '', K02BIGOXX3: '', K02BIGOXX4: '', K02BIGOXX5: '',
  K02RELEASE_DATE: '',
}

export default function ItemForm({ item, mode, onSaved }: Props) {
  const [tab, setTab] = useState<Tab>('basic')
  const [form, setForm] = useState<ItemDetail>(item || emptyItem)
  const [state, formAction, isPending] = useActionState(saveItem, undefined)

  useEffect(() => {
    setForm(item || emptyItem)
    setTab('basic')
  }, [item, mode])

  useEffect(() => {
    if (state?.success && state.itemCd) {
      onSaved(state.itemCd)
    }
  }, [state, onSaved])

  const set = (field: keyof ItemDetail, value: string) => {
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
        <button type="button" className={tabClass('price')} onClick={() => setTab('price')}>단가/재고</button>
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
      <form id="item-form" action={formAction} className="flex-1 overflow-y-auto p-4">
        <input type="hidden" name="_mode" value={isNew ? 'new' : 'edit'} />
        <input type="hidden" name="K02JPMGBCD" value={form.K02JPMGBCD} />

        <div className={tab === 'basic' ? '' : 'hidden'}><BasicTab form={form} set={set} isNew={isNew} /></div>
        <div className={tab === 'price' ? '' : 'hidden'}><PriceTab form={form} set={set} /></div>
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

function YNRadio({ name, value, onChange }: { name: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex h-8 items-center gap-4">
      {([['Y', '예'], ['N', '아니오']] as const).map(([val, label]) => (
        <label key={val} className="flex items-center gap-1 text-sm text-[var(--text-secondary)]">
          <input type="radio" name={name} value={val} checked={value === val} onChange={() => onChange(val)} className="accent-teal-600" />
          {label}
        </label>
      ))}
    </div>
  )
}

function BasicTab({ form, set, isNew }: { form: ItemDetail; set: (f: keyof ItemDetail, v: string) => void; isNew: boolean }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <Field label="제품코드">
        <input
          value={isNew ? '(자동채번)' : form.K02JPMGBCD}
          readOnly
          className={readonlyClass}
        />
      </Field>
      <Field label="품번">
        <input name="K02PUMGBN1" value={form.K02PUMGBN1} onChange={e => set('K02PUMGBN1', e.target.value)} className={inputClass} />
      </Field>
      <Field label="품명 *">
        <input name="K02PUMGBN2" value={form.K02PUMGBN2} onChange={e => set('K02PUMGBN2', e.target.value)} required className={inputClass} />
      </Field>
      <Field label="규격">
        <input name="K02PUMGBN3" value={form.K02PUMGBN3} onChange={e => set('K02PUMGBN3', e.target.value)} className={inputClass} />
      </Field>
      <Field label="재질">
        <input name="K02PUMGBN4" value={form.K02PUMGBN4} onChange={e => set('K02PUMGBN4', e.target.value)} className={inputClass} />
      </Field>
      <Field label="색상">
        <input name="K02PUMGBN5" value={form.K02PUMGBN5} onChange={e => set('K02PUMGBN5', e.target.value)} className={inputClass} />
      </Field>
      <Field label="제품정보6">
        <input name="K02PUMGBN6" value={form.K02PUMGBN6} onChange={e => set('K02PUMGBN6', e.target.value)} className={inputClass} />
      </Field>
      <Field label="제품정보7">
        <input name="K02PUMGBN7" value={form.K02PUMGBN7} onChange={e => set('K02PUMGBN7', e.target.value)} className={inputClass} />
      </Field>
      <Field label="제품정보8">
        <input name="K02PUMGBN8" value={form.K02PUMGBN8} onChange={e => set('K02PUMGBN8', e.target.value)} className={inputClass} />
      </Field>
      <Field label="제품정보9">
        <input name="K02PUMGBN9" value={form.K02PUMGBN9} onChange={e => set('K02PUMGBN9', e.target.value)} className={inputClass} />
      </Field>
      <Field label="수불단위 *">
        <input name="K02SUBULUT" value={form.K02SUBULUT} onChange={e => set('K02SUBULUT', e.target.value)} required className={inputClass} />
      </Field>
      <Field label="단중 (kg/pcs)">
        <input name="K02JPMWGT3" type="number" step="0.0001" value={form.K02JPMWGT3} onChange={e => set('K02JPMWGT3', e.target.value)} className={inputClass} />
      </Field>
      <Field label="박스수량">
        <input name="K02PACKAGE" type="number" value={form.K02PACKAGE} onChange={e => set('K02PACKAGE', e.target.value)} className={inputClass} />
      </Field>
      <Field label="팔레트수량">
        <input name="K02PALLET" type="number" value={form.K02PALLET} onChange={e => set('K02PALLET', e.target.value)} className={inputClass} />
      </Field>
      <Field label="구분코드1">
        <input name="K02CLASSCD" value={form.K02CLASSCD} onChange={e => set('K02CLASSCD', e.target.value)} className={inputClass} />
      </Field>
      <Field label="구분코드2">
        <input name="K02CLASSCD2" value={form.K02CLASSCD2} onChange={e => set('K02CLASSCD2', e.target.value)} className={inputClass} />
      </Field>
      <Field label="구분코드3">
        <input name="K02CLASSCD3" value={form.K02CLASSCD3} onChange={e => set('K02CLASSCD3', e.target.value)} className={inputClass} />
      </Field>
      <Field label="구분코드4">
        <input name="K02CLASSCD4" value={form.K02CLASSCD4} onChange={e => set('K02CLASSCD4', e.target.value)} className={inputClass} />
      </Field>
      <Field label="대분류">
        <input name="K02GUBUN01" value={form.K02GUBUN01} onChange={e => set('K02GUBUN01', e.target.value)} className={inputClass} />
      </Field>
      <Field label="중분류">
        <input name="K02GUBUN02" value={form.K02GUBUN02} onChange={e => set('K02GUBUN02', e.target.value)} className={inputClass} />
      </Field>
      <Field label="소분류">
        <input name="K02GUBUN03" value={form.K02GUBUN03} onChange={e => set('K02GUBUN03', e.target.value)} className={inputClass} />
      </Field>
      <Field label="유통기한여부">
        <YNRadio name="K02EXPIR_YN" value={form.K02EXPIR_YN} onChange={v => set('K02EXPIR_YN', v)} />
      </Field>
      <Field label="유통기한일수">
        <input name="K02EXPIRDT" type="number" value={form.K02EXPIRDT} onChange={e => set('K02EXPIRDT', e.target.value)} className={inputClass} />
      </Field>
      <Field label="유통기한검수일수">
        <input name="K02EXPIRVLD" type="number" value={form.K02EXPIRVLD} onChange={e => set('K02EXPIRVLD', e.target.value)} className={inputClass} />
      </Field>
      <Field label="세트품여부">
        <YNRadio name="K02PACKAGECD" value={form.K02PACKAGECD} onChange={v => set('K02PACKAGECD', v)} />
      </Field>
      <Field label="단종여부">
        <YNRadio name="K02DXDSTSYN" value={form.K02DXDSTSYN} onChange={v => set('K02DXDSTSYN', v)} />
      </Field>
      <Field label="사용여부">
        <YNRadio name="K02USEFLAG" value={form.K02USEFLAG} onChange={v => set('K02USEFLAG', v)} />
      </Field>
    </div>
  )
}

function PriceTab({ form, set }: { form: ItemDetail; set: (f: keyof ItemDetail, v: string) => void }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <Field label="입고단가">
        <input name="K02IPGPRC1" type="number" step="0.01" value={form.K02IPGPRC1} onChange={e => set('K02IPGPRC1', e.target.value)} className={inputClass} />
      </Field>
      <Field label="판매단가">
        <input name="K02PANPRC1" type="number" step="0.01" value={form.K02PANPRC1} onChange={e => set('K02PANPRC1', e.target.value)} className={inputClass} />
      </Field>
      <Field label="입고단가2">
        <input name="K02IPGPRC2" type="number" step="0.01" value={form.K02IPGPRC2} onChange={e => set('K02IPGPRC2', e.target.value)} className={inputClass} />
      </Field>
      <Field label="판매단가2">
        <input name="K02PANPRC2" type="number" step="0.01" value={form.K02PANPRC2} onChange={e => set('K02PANPRC2', e.target.value)} className={inputClass} />
      </Field>
      <Field label="적정재고">
        <input name="K02SAFESK1" type="number" step="0.01" value={form.K02SAFESK1} onChange={e => set('K02SAFESK1', e.target.value)} className={inputClass} />
      </Field>
      <Field label="발주수량">
        <input name="K02BALJUX1" type="number" step="0.01" value={form.K02BALJUX1} onChange={e => set('K02BALJUX1', e.target.value)} className={inputClass} />
      </Field>
      <Field label="과재고수량">
        <input name="K02OVERSK1" type="number" step="0.01" value={form.K02OVERSK1} onChange={e => set('K02OVERSK1', e.target.value)} className={inputClass} />
      </Field>
      <Field label="입고창고코드">
        <input name="K02SITE" value={form.K02SITE} onChange={e => set('K02SITE', e.target.value)} className={inputClass} />
      </Field>
      <Field label="입고위치코드">
        <input name="K02LOCATION" value={form.K02LOCATION} onChange={e => set('K02LOCATION', e.target.value)} className={inputClass} />
      </Field>
      <Field label="매입처코드">
        <input name="K02CUSGBCD" value={form.K02CUSGBCD} onChange={e => set('K02CUSGBCD', e.target.value)} className={inputClass} />
      </Field>
      <Field label="납기소요일">
        <input name="K02DLVRYDATE" type="number" value={form.K02DLVRYDATE} onChange={e => set('K02DLVRYDATE', e.target.value)} className={inputClass} />
      </Field>
    </div>
  )
}

function ExtraTab({ form, set }: { form: ItemDetail; set: (f: keyof ItemDetail, v: string) => void }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <Field label="LOT관리여부">
        <YNRadio name="K02LOTCODE" value={form.K02LOTCODE} onChange={v => set('K02LOTCODE', v)} />
      </Field>
      <Field label="부가세구분코드">
        <input name="K02VATGBNM" value={form.K02VATGBNM} onChange={e => set('K02VATGBNM', e.target.value)} className={inputClass} />
      </Field>
      <Field label="LOCK여부">
        <YNRadio name="K02LOCKCD" value={form.K02LOCKCD} onChange={v => set('K02LOCKCD', v)} />
      </Field>
      <div className="sm:col-span-2">
        <Field label="LOCK사유">
          <input name="K02LOCK_REMARK" value={form.K02LOCK_REMARK} onChange={e => set('K02LOCK_REMARK', e.target.value)} className={inputClass} />
        </Field>
      </div>
      <Field label="검사여부">
        <YNRadio name="K02INS_YN" value={form.K02INS_YN} onChange={v => set('K02INS_YN', v)} />
      </Field>
      <Field label="검사여부2">
        <YNRadio name="K02INS_YN2" value={form.K02INS_YN2} onChange={v => set('K02INS_YN2', v)} />
      </Field>
      <Field label="화주코드">
        <input name="K02OWNERCD" value={form.K02OWNERCD} onChange={e => set('K02OWNERCD', e.target.value)} className={inputClass} />
      </Field>
      <Field label="담당부서코드">
        <input name="K02ITEMDEPT" value={form.K02ITEMDEPT} onChange={e => set('K02ITEMDEPT', e.target.value)} className={inputClass} />
      </Field>
      <Field label="참고코드1">
        <input name="K02ETCCODE1" value={form.K02ETCCODE1} onChange={e => set('K02ETCCODE1', e.target.value)} className={inputClass} />
      </Field>
      <Field label="참고코드2">
        <input name="K02ETCCODE2" value={form.K02ETCCODE2} onChange={e => set('K02ETCCODE2', e.target.value)} className={inputClass} />
      </Field>
      <Field label="참고코드3">
        <input name="K02ETCCODE3" value={form.K02ETCCODE3} onChange={e => set('K02ETCCODE3', e.target.value)} className={inputClass} />
      </Field>
      <Field label="참고코드4">
        <input name="K02ETCCODE4" value={form.K02ETCCODE4} onChange={e => set('K02ETCCODE4', e.target.value)} className={inputClass} />
      </Field>
      <Field label="참고코드5">
        <input name="K02ETCCODE5" value={form.K02ETCCODE5} onChange={e => set('K02ETCCODE5', e.target.value)} className={inputClass} />
      </Field>
      <Field label="비고1">
        <input name="K02BIGOXX1" value={form.K02BIGOXX1} onChange={e => set('K02BIGOXX1', e.target.value)} className={inputClass} />
      </Field>
      <Field label="비고2">
        <input name="K02BIGOXX2" value={form.K02BIGOXX2} onChange={e => set('K02BIGOXX2', e.target.value)} className={inputClass} />
      </Field>
      <Field label="비고3">
        <input name="K02BIGOXX3" value={form.K02BIGOXX3} onChange={e => set('K02BIGOXX3', e.target.value)} className={inputClass} />
      </Field>
      <Field label="비고4">
        <input name="K02BIGOXX4" value={form.K02BIGOXX4} onChange={e => set('K02BIGOXX4', e.target.value)} className={inputClass} />
      </Field>
      <Field label="비고5">
        <input name="K02BIGOXX5" value={form.K02BIGOXX5} onChange={e => set('K02BIGOXX5', e.target.value)} className={inputClass} />
      </Field>
      <Field label="출시일자">
        <input name="K02RELEASE_DATE" type="date" value={form.K02RELEASE_DATE} onChange={e => set('K02RELEASE_DATE', e.target.value)} className={inputClass} />
      </Field>
    </div>
  )
}
