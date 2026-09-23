import SlotPicker from './pages/SlotPicker.jsx'

// รองรับ FR-BKG-01 และ FR-BKG-06 ด้วยหน้าจอเลือกแพ็กเกจและช่วงเวลา
export default function App({ api, packages = [] }) {
  return (
    <main className="mx-auto min-h-screen max-w-3xl bg-slate-50 px-6 py-10">
      <h1 className="text-2xl font-bold text-teal-800">ระบบจองคิวตรวจสุขภาพ</h1>
      <div className="mt-8">
        <SlotPicker api={api} packages={packages} />
      </div>
    </main>
  )
}
