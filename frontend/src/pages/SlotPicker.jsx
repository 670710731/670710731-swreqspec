import { useEffect, useState } from 'react'

import { api as defaultApi } from '../api/client.js'

function todayAsDateString() {
  return new Date().toISOString().slice(0, 10)
}

function isWithinBookingWindow(slotDate, dateFrom) {
  const start = new Date(`${dateFrom}T00:00:00Z`)
  const end = new Date(start)
  end.setUTCDate(end.getUTCDate() + 29)
  const date = new Date(`${slotDate}T00:00:00Z`)
  return date >= start && date <= end
}

function formatSlotTime(startTime) {
  return String(startTime).slice(0, 5)
}

// รองรับ FR-BKG-01 และ FR-BKG-06 โดยโหลดช่วงเวลาตามแพ็กเกจที่เลือก
export default function SlotPicker({ api = defaultApi, packages = [] }) {
  const [packageCode, setPackageCode] = useState(packages[0]?.code ?? '')
  const [slots, setSlots] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const dateFrom = todayAsDateString()

  useEffect(() => {
    let active = true

    if (!packageCode) {
      setSlots([])
      return () => {
        active = false
      }
    }

    setLoading(true)
    setError('')
    api
      .getSlots({ dateFrom, packageCode })
      .then((response) => {
        if (!active) return
        const receivedSlots = Array.isArray(response) ? response : response.slots ?? []
        setSlots(receivedSlots.filter((slot) => isWithinBookingWindow(slot.slot_date, dateFrom)))
      })
      .catch(() => {
        if (active) setError('ไม่สามารถโหลดช่วงเวลาที่ว่างได้')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [api, dateFrom, packageCode])

  return (
    <section aria-labelledby="slot-picker-title" className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">Booking</p>
        <h2 id="slot-picker-title" className="mt-1 text-3xl font-bold text-slate-900">
          เลือกแพ็กเกจและช่วงเวลา
        </h2>
        <p className="mt-2 text-slate-600">ช่วงเวลาที่แสดงอยู่ภายใน 30 วันข้างหน้า</p>
      </div>

      <label className="block text-sm font-semibold text-slate-800" htmlFor="package-code">
        แพ็กเกจตรวจสุขภาพ
        <select
          id="package-code"
          value={packageCode}
          onChange={(event) => setPackageCode(event.target.value)}
          className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-base font-normal text-slate-900 shadow-sm focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-200"
          disabled={packages.length === 0}
        >
          <option value="" disabled>
            เลือกแพ็กเกจ
          </option>
          {packages.map((item) => (
            <option key={item.code} value={item.code}>
              {item.label}
            </option>
          ))}
        </select>
      </label>

      <div aria-live="polite" className="min-h-8">
        {loading && <p className="text-slate-600">กำลังโหลดช่วงเวลาที่ว่าง...</p>}
        {error && <p className="text-red-700">{error}</p>}
      </div>

      {!loading && !error && packageCode && slots.length === 0 && (
        <p className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-slate-600">
          ยังไม่มีช่วงเวลาที่ว่าง
        </p>
      )}

      {slots.length > 0 && (
        <ul className="grid gap-3 sm:grid-cols-2" aria-label="ช่วงเวลาที่ว่าง">
          {slots.map((slot) => (
            <li key={slot.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <p className="font-semibold text-slate-900">{slot.slot_date}</p>
              <p className="mt-1 text-lg text-teal-800">{formatSlotTime(slot.start_time)} น.</p>
              <p className="mt-2 text-sm text-slate-600">เหลือ {slot.remaining} ที่นั่ง</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
