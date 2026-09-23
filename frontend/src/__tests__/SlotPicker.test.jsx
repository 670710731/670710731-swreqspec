import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import SlotPicker from '../pages/SlotPicker.jsx'

const packages = [
  { code: 'basic', label: 'แพ็กเกจพื้นฐาน' },
  { code: 'premium', label: 'แพ็กเกจพรีเมียม' },
]

function dateAfter(days) {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date.toISOString().slice(0, 10)
}

const slotsByPackage = {
  basic: [
    { id: 1, slot_date: dateAfter(9), start_time: '09:00:00', remaining: 2 },
  ],
  premium: [
    { id: 2, slot_date: dateAfter(10), start_time: '13:30:00', remaining: 1 },
  ],
}

function createMockApi() {
  return {
    getSlots: vi.fn(({ packageCode }) => Promise.resolve(slotsByPackage[packageCode])),
  }
}

test('แสดงช่วงเวลาที่ว่างและจำนวนที่นั่งภายใน 30 วัน', async () => {
  const mockApi = createMockApi()
  render(<SlotPicker api={mockApi} packages={packages} />)

  expect(await screen.findByText('09:00 น.')).toBeTruthy()
  expect(screen.getByText('เหลือ 2 ที่นั่ง')).toBeTruthy()
  expect(mockApi.getSlots).toHaveBeenCalledWith(
    expect.objectContaining({ packageCode: 'basic' }),
  )
})

test('โหลดช่วงเวลาใหม่เมื่อเปลี่ยนแพ็กเกจ', async () => {
  const mockApi = createMockApi()
  render(<SlotPicker api={mockApi} packages={packages} />)

  await screen.findByText('09:00 น.')
  fireEvent.change(screen.getByLabelText('แพ็กเกจตรวจสุขภาพ'), {
    target: { value: 'premium' },
  })

  await waitFor(() => expect(screen.getByText('13:30 น.')).toBeTruthy())
  expect(screen.getByText('เหลือ 1 ที่นั่ง')).toBeTruthy()
  expect(mockApi.getSlots).toHaveBeenLastCalledWith(
    expect.objectContaining({ packageCode: 'premium' }),
  )
})