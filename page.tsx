'use client'

import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'

type Variant = 'A'|'B'

const profileSrc = '/profile-image.png'
const mainSrc = '/main-image.png'

const REASONS = [
  'Too expensive',
  'Not using it enough',
  'Found an alternative',
  'Temporary pause',
  'Other'
]

const formatCents = (cents: number) => `$${(cents/100).toFixed(0)}`

export default function CancelPage() {
  const [step, setStep] = useState<1|2|3|4>(1)
  const [userId] = useState<string>('550e8400-e29b-41d4-a716-446655440001') // demo user id from seed
  const [variant, setVariant] = useState<Variant>('A')
  const [monthlyCents, setMonthlyCents] = useState<number>(2500)
  const [reason, setReason] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [csrf, setCsrf] = useState<string>('')

  useEffect(() => {
    // read csrf cookie if present
    const m = document.cookie.match(/(?:^|;)\\s*csrf_token=([^;]+)/)
    if (m) setCsrf(decodeURIComponent(m[1]))
    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function init() {
    setLoading(true)
    try {
      const res = await fetch('/api/cancel/init', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-csrf': csrf },
        body: JSON.stringify({ user_id: userId })
      })
      if (!res.ok) {
        const text = await res.text().catch(()=> 'error')
        throw new Error(text)
      }
      const data = await res.json()
      setVariant(data.variant)
      setMonthlyCents(data.monthly_price)
      setStep(1)
    } catch (e) {
      console.error(e)
      // graceful fallback to UI with seeded data
      setVariant('A')
      setMonthlyCents(2500)
      setStep(1)
    } finally { setLoading(false) }
  }

  const discounted = useMemo(() => {
    if (variant === 'B') {
      if (monthlyCents === 2500) return 1500
      if (monthlyCents === 2900) return 1900
    }
    return monthlyCents
  }, [variant, monthlyCents])

  async function submitReason() {
    setLoading(true)
    try {
      const res = await fetch('/api/cancel/reason', {
        method: 'POST',
        headers: {'content-type':'application/json','x-csrf': csrf},
        body: JSON.stringify({ user_id: userId, reason })
      })
      if (!res.ok) throw new Error(await res.text())
      setStep(3)
    } catch (e:any) {
      alert(e.message || 'Unable to save reason')
    } finally { setLoading(false) }
  }

  async function acceptDownsell() {
    setLoading(true)
    try {
      const res = await fetch('/api/cancel/accept', {
        method: 'POST',
        headers: {'content-type':'application/json','x-csrf': csrf},
        body: JSON.stringify({ user_id: userId })
      })
      if (!res.ok) throw new Error(await res.text())
      setStep(4)
    } catch (e:any) {
      alert(e.message || 'Unable to accept offer')
    } finally { setLoading(false) }
  }

  async function confirmCancel() {
    setLoading(true)
    try {
      const res = await fetch('/api/cancel/confirm', {
        method: 'POST',
        headers: {'content-type':'application/json','x-csrf': csrf},
        body: JSON.stringify({ user_id: userId })
      })
      if (!res.ok) throw new Error(await res.text())
      setStep(4)
    } catch (e:any) {
      alert(e.message || 'Unable to cancel')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-ui-100 antialiased">
      <div className="max-w-card-md mx-auto">
        <div className="px-[20px] pt-[20px] flex items-center gap-[12px]">
          <Image src={profileSrc} alt="profile" width={40} height={40} className="rounded-full ring-1 ring-black/8" />
          <div>
            <p className="text-[13px] leading-[18px] text-ui-500">Signed in as</p>
            <p className="text-[15px] leading-[22px] font-medium">user1@example.com</p>
          </div>
        </div>

        <div className="m-[20px] rounded-[16px] bg-white shadow-card overflow-hidden">
          <div className="relative h-[200px] md:h-[240px] w-full bg-gradient-to-br from-brand-50 to-brand-200">
            <Image src={mainSrc} alt="hero" fill className="object-cover object-center" />
          </div>

          <div className="p-[24px]">
            {/* Step 1: Plan */}
            {step === 1 && (
              <div className="space-y-[20px]">
                <h1 className="text-[24px] leading-[32px] font-semibold">Manage your plan</h1>
                <div className="flex items-center justify-between rounded-[12px] border border-ui-300 p-[16px]">
                  <div>
                    <p className="text-[13px] leading-[18px] text-ui-500">Current plan</p>
                    <p className="text-[16px] leading-[24px] font-medium">{formatCents(monthlyCents)}/month</p>
                  </div>
                  <button onClick={() => setStep(2)} className="rounded-[8px] bg-ui-900 px-[16px] py-[10px] text-white text-[14px] leading-[20px]">Cancel plan</button>
                </div>
              </div>
            )}

            {/* Step 2: Reason */}
            {step === 2 && (
              <div className="space-y-[20px]">
                <h2 className="text-[20px] leading-[28px] font-semibold">Why are you cancelling?</h2>
                <ul className="grid gap-[12px]">
                  {REASONS.map((r) => (
                    <li key={r}>
                      <label className={`flex items-center gap-[12px] rounded-[12px] border p-[12px] hover:bg-ui-100 ${reason === r ? 'ring-2 ring-brand-200' : ''}`}>
                        <input type="radio" name="reason" value={r} checked={reason===r} onChange={()=> setReason(r)} className="h-[16px] w-[16px]" />
                        <span className="text-[15px] leading-[22px]">{r}</span>
                      </label>
                    </li>
                  ))}
                </ul>

                <div className="flex items-center justify-between gap-[12px]">
                  <button className="px-[16px] py-[10px] rounded-[8px] border text-[14px] leading-[20px]" onClick={() => setStep(1)}>Back</button>
                  <button disabled={!reason || loading} onClick={submitReason} className="rounded-[8px] bg-ui-900 px-[16px] py-[10px] text-white text-[14px] leading-[20px] disabled:opacity-60">Continue</button>
                </div>
              </div>
            )}

            {/* Step 3: Downsell */}
            {step === 3 && (
              <div className="space-y-[16px]">
                <h2 className="text-[20px] leading-[28px] font-semibold">Before you go</h2>
                <div className="rounded-[12px] border p-[16px]">
                  <p className="text-[13px] leading-[18px] text-ui-500">Special offer</p>
                  <div className="mt-[8px] flex items-baseline gap-[12px]">
                    {variant === 'B' ? (
                      <>
                        <p className="text-[28px] leading-[36px] font-semibold">{formatCents(discounted)}/mo</p>
                        <p className="text-[15px] leading-[22px] line-through text-ui-300">{formatCents(monthlyCents)}</p>
                      </>
                    ) : (
                      <p className="text-[28px] leading-[36px] font-semibold">{formatCents(monthlyCents)}/mo</p>
                    )}
                  </div>
                  <p className="mt-[12px] text-[13px] leading-[18px] text-ui-500">
                    {variant === 'B' ? 'Keep your membership today for a limited offer.' : 'Are you sure you want to cancel your membership?'}
                  </p>

                  <div className="mt-[16px] flex flex-col gap-[12px] md:flex-row md:items-center">
                    {variant === 'B' ? (
                      <button onClick={acceptDownsell} disabled={loading} className="rounded-[8px] bg-success px-[16px] py-[10px] text-white text-[14px] leading-[20px]">Stay for {formatCents(discounted)}/mo</button>
                    ) : null}
                    <button onClick={confirmCancel} disabled={loading} className="rounded-[8px] border px-[16px] py-[10px] text-[14px] leading-[20px]">{variant === 'B' ? 'No thanks, cancel anyway' : 'Confirm cancellation'}</button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Done */}
            {step === 4 && (
              <div className="space-y-[12px] text-center py-[40px]">
                <h3 className="text-[20px] leading-[28px] font-semibold">All set</h3>
                <p className="text-[15px] leading-[22px] text-ui-500">
                  {variant === 'B' ? 'Your choice has been saved.' : 'Your subscription has been cancelled.'}
                </p>
                <a href="/" className="inline-block mt-[8px] rounded-[8px] bg-ui-900 px-[16px] py-[10px] text-white text-[14px] leading-[20px]">Return home</a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
