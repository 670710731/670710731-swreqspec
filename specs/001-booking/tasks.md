# Tasks: จองคิวตรวจสุขภาพ (Booking)

- Feature: จองคิวตรวจสุขภาพ
- Spec ID: SPEC-BKG-001
- อ้างอิง: [plan.md](plan.md)
- วันที่: 2569-09-23

มีทั้งหมด 20 tasks แบ่งตามลำดับข้อมูล, API, หน้าจอ และการเชื่อมต่อจริง โดยมี 6 tasks ที่ต้องรอคำตอบ `Q-02` เรื่องรูปแบบและวิธีออกหมายเลขคิว

## รายการงาน

### T-01 สร้างฐานข้อมูลและ migration
- รองรับ: CON-TECH-01, DOM-PDPA-01, IF-HIS-01
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-06 และ T-10
- ไฟล์ที่แตะ: `backend/app/config.py`, `backend/app/db/session.py`, `backend/app/db/models.py`, `backend/app/db/migrations/001_init.py`, `backend/tests/conftest.py`
- ต้องทำหลัง: ไม่มี
- เสร็จเมื่อ: migration สร้างตาราง `slots`, `bookings` และ `audit_logs` ได้ และตาราง `bookings` ไม่มี `national_id`
- สถานะ: เสร็จ รอทีมตรวจ

### T-02 สร้างบริการค้นหาช่วงเวลาว่าง
- รองรับ: FR-BKG-01, FR-BKG-06, ASM-01, ASM-02
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-14 และ T-03
- ไฟล์ที่แตะ: `backend/app/slots/service.py`, `backend/app/slots/router.py`, `backend/tests/test_slots.py`
- ต้องทำหลัง: T-01
- เสร็จเมื่อ: `GET /slots` คืนช่วงเวลาภายใน 30 วันพร้อม `remaining` และคำนวณใหม่เมื่อส่ง `package_code` ต่างกัน
- สถานะ: พร้อมทำ

### T-03 ทดสอบประสิทธิภาพการค้นหาช่วงเวลา
- รองรับ: NFR-PERF-01, FR-BKG-01
- ตรวจด้วย: AC-BKG-05
- ไฟล์ที่แตะ: `backend/tests/test_AC_BKG_05.py`
- ต้องทำหลัง: T-02
- เสร็จเมื่อ: การทดสอบผู้ใช้พร้อมกัน 200 คนรายงานค่า p95 ของ `GET /slots` ไม่เกิน 2 วินาทีในสภาพแวดล้อมทดสอบ
- สถานะ: พร้อมทำ

### T-04 ตรวจผลการยืนยันตัวตนก่อนเข้าถึง API
- รองรับ: IF-IDP-01
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ API ทุกตัว
- ไฟล์ที่แตะ: `backend/app/auth/idp.py`, `backend/app/main.py`, `backend/tests/test_idp.py`
- ต้องทำหลัง: T-01
- เสร็จเมื่อ: endpoint ที่เข้าถึงข้อมูลผู้รับบริการปฏิเสธคำขอที่ไม่มีผลยืนยันตัวตนจาก IDP
- สถานะ: พร้อมทำ

### T-05 สร้างการค้นหา HN จาก HIS
- รองรับ: IF-HIS-01
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-06 และ T-18
- ไฟล์ที่แตะ: `backend/app/his/client.py`, `backend/app/booking/router.py`, `backend/tests/test_his_lookup.py`
- ต้องทำหลัง: T-04
- เสร็จเมื่อ: `GET /patients/lookup` ส่งเลขบัตรไปยัง HIS แล้วคืน `hn` และไม่บันทึกเลขบัตรลงฐานข้อมูล
- สถานะ: พร้อมทำ

### T-06 บันทึกการจองและตัดที่นั่งแบบ atomic
- รองรับ: FR-BKG-04, CON-TECH-01, ASM-01
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-12
- ไฟล์ที่แตะ: `backend/app/booking/service.py`, `backend/app/booking/router.py`, `backend/tests/test_booking_create.py`
- ต้องทำหลัง: T-01, T-04
- เสร็จเมื่อ: การยืนยันการจองบันทึก booking และลด `remaining` ในการดำเนินการเดียวโดยไม่ทำให้เกิดการจองซ้อน
- สถานะ: พร้อมทำ

### T-07 ป้องกันการจองซ้ำในวันเดียวกัน
- รองรับ: FR-BKG-02, ASM-04
- ตรวจด้วย: AC-BKG-02
- ไฟล์ที่แตะ: `backend/app/booking/service.py`, `backend/tests/test_AC_BKG_02.py`
- ต้องทำหลัง: T-06
- เสร็จเมื่อ: ผู้รับบริการที่มีคิวเดิมที่ยังไม่ได้ใช้ได้รับการปฏิเสธพร้อมหมายเลขคิวเดิม
- สถานะ: พร้อมทำ

### T-08 เสนอช่วงเวลาใกล้เคียงเมื่อเต็ม
- รองรับ: FR-BKG-03, ASM-06, ASM-07
- ตรวจด้วย: AC-BKG-03
- ไฟล์ที่แตะ: `backend/app/slots/service.py`, `backend/app/booking/service.py`, `backend/app/booking/router.py`, `backend/tests/test_AC_BKG_03.py`
- ต้องทำหลัง: T-02, T-06
- เสร็จเมื่อ: เมื่อช่วงเวลาถูกจองเต็ม API ตอบ `409` พร้อมช่วงที่ว่างจริงไม่เกิน 3 รายการ โดยค้นหาวันเดียวกันก่อนและไม่สร้าง booking ใหม่
- สถานะ: พร้อมทำ

### T-09 วางงานแจ้งเตือนและส่งซ้ำแบบ asynchronous
- รองรับ: FR-BKG-05, IF-NOT-01, NFR-REL-02, ASM-03
- ตรวจด้วย: AC-BKG-04
- ไฟล์ที่แตะ: `backend/app/notify/queue.py`, `backend/app/booking/service.py`, `backend/tests/test_AC_BKG_04.py`
- ต้องทำหลัง: T-06
- เสร็จเมื่อ: เมื่อระบบแจ้งเตือนไม่ตอบสนอง booking ยังถูกบันทึก และมีงานส่งซ้ำที่กำหนดรอบแรกภายใน 5 นาที
- สถานะ: พร้อมทำ

### T-10 บันทึก audit log ทุกการเข้าถึงข้อมูลการจอง
- รองรับ: DOM-PDPA-01
- ตรวจด้วย: AC-BKG-06
- ไฟล์ที่แตะ: `backend/app/audit/middleware.py`, `backend/app/main.py`, `backend/tests/test_AC_BKG_06.py`
- ต้องทำหลัง: T-01, T-04
- เสร็จเมื่อ: การเปิดดูข้อมูลการจองสร้าง audit log ที่มี `actor_id`, `accessed_at` และ `hn`
- สถานะ: พร้อมทำ

### T-11 กำหนดการออกหมายเลขคิว
- รองรับ: FR-BKG-04, ASM-05
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-12 และ T-16
- ไฟล์ที่แตะ: `backend/app/booking/service.py`, `backend/app/db/models.py`, `backend/tests/test_queue_number.py`
- ต้องทำหลัง: T-06
- เสร็จเมื่อ: ระบบออกและเก็บหมายเลขคิวตามรูปแบบและวิธีนับที่ทีมกำหนดใน `Q-02`
- สถานะ: รอ Q-02

### T-12 ตรวจการจองสำเร็จและจำนวนที่นั่งคงเหลือ
- รองรับ: FR-BKG-04
- ตรวจด้วย: AC-BKG-01
- ไฟล์ที่แตะ: `backend/tests/test_AC_BKG_01.py`
- ต้องทำหลัง: T-06, T-11
- เสร็จเมื่อ: การจองช่วง 09.00 น. ที่เหลือ 1 ที่บันทึกสำเร็จ ได้หมายเลขคิว และ `remaining` เป็น 0
- สถานะ: รอ Q-02

### T-13 เปิดใช้ TLS สำหรับข้อมูลการจอง
- รองรับ: NFR-SEC-01
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานด้านความปลอดภัยของ API
- ไฟล์ที่แตะ: `backend/app/config.py`, `backend/app/main.py`, `backend/tests/test_tls_config.py`
- ต้องทำหลัง: T-04
- เสร็จเมื่อ: การตั้งค่าและการทดสอบ API ยืนยันว่าการรับส่งข้อมูลการจองกำหนด TLS 1.2 ขึ้นไป
- สถานะ: พร้อมทำ

### T-14 สร้างหน้าจอเลือกแพ็กเกจและช่วงเวลา
- รองรับ: FR-BKG-01, FR-BKG-06, ASM-01, ASM-02
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-15
- ไฟล์ที่แตะ: `frontend/src/pages/SlotPicker.jsx`, `frontend/src/App.jsx`, `frontend/src/api/client.js`, `frontend/src/__tests__/SlotPicker.test.jsx`
- ต้องทำหลัง: ไม่มี
- เสร็จเมื่อ: หน้าจอแสดงช่วงเวลาจำลองและจำนวนที่นั่งคงเหลือภายใน 30 วัน และโหลดข้อมูลใหม่เมื่อเปลี่ยนแพ็กเกจ
- สถานะ: พร้อมทำ

### T-15 สร้างหน้าจอแจ้งช่วงเวลาเต็มและตัวเลือกใกล้เคียง
- รองรับ: FR-BKG-03, ASM-06, ASM-07
- ตรวจด้วย: AC-BKG-03
- ไฟล์ที่แตะ: `frontend/src/pages/ConfirmBooking.jsx`, `frontend/src/__tests__/AC-BKG-03.test.jsx`
- ต้องทำหลัง: T-14
- เสร็จเมื่อ: เมื่อ API จำลองตอบ `409` หน้าจอแสดงข้อความ "ช่วงเวลาเต็ม" และตัวเลือกที่ว่างไม่เกิน 3 รายการ
- สถานะ: พร้อมทำ

### T-16 สร้างหน้าจอแสดงผลการจองและหมายเลขคิว
- รองรับ: FR-BKG-04, FR-BKG-05
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-18
- ไฟล์ที่แตะ: `frontend/src/pages/BookingResult.jsx`, `frontend/src/App.jsx`, `frontend/src/__tests__/BookingResult.test.jsx`
- ต้องทำหลัง: T-11
- เสร็จเมื่อ: หน้าจอแสดงหมายเลขคิวจากผลการจอง รวมถึงกรณีส่งข้อความยืนยันไม่สำเร็จ
- สถานะ: รอ Q-02

### T-17 ทดสอบการแสดงผลกรณีส่งข้อความไม่สำเร็จ
- รองรับ: FR-BKG-05, NFR-REL-02
- ตรวจด้วย: AC-BKG-04
- ไฟล์ที่แตะ: `frontend/src/__tests__/AC-BKG-04.test.jsx`
- ต้องทำหลัง: T-16
- เสร็จเมื่อ: การทดสอบหน้าจอผ่านเมื่อ API จำลองแจ้งว่าส่งข้อความไม่สำเร็จ แต่หน้าจอยังแสดงหมายเลขคิว
- สถานะ: รอ Q-02

### T-18 เชื่อมหน้าจอกับ API จริง
- รองรับ: FR-BKG-01, FR-BKG-03, FR-BKG-04, FR-BKG-05, IF-IDP-01
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานรวมระบบของ T-14 ถึง T-16 และ API ที่เกี่ยวข้อง
- ไฟล์ที่แตะ: `frontend/src/api/client.js`, `frontend/src/App.jsx`, `frontend/src/pages/SlotPicker.jsx`, `frontend/src/pages/ConfirmBooking.jsx`, `frontend/src/pages/BookingResult.jsx`
- ต้องทำหลัง: T-02, T-05, T-07, T-08, T-09, T-11, T-14, T-15, T-16
- เสร็จเมื่อ: หน้าจอเรียก endpoint จริงผ่าน `/api` และทำ flow เลือกเวลา ยืนยัน และแสดงหมายเลขคิวได้
- สถานะ: รอ Q-02

### T-19 ทดสอบการใช้งานสำหรับผู้ใช้ใหม่
- รองรับ: NFR-USE-01, ASM-05
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นการทดสอบคุณภาพการใช้งาน
- ไฟล์ที่แตะ: `frontend/src/__tests__/usability-booking.test.jsx`, `docs/srs/README.md`
- ต้องทำหลัง: T-18
- เสร็จเมื่อ: ผู้ใช้ใหม่ 10 คนถูกทดสอบและอย่างน้อย 8 คนจองสำเร็จภายใน 3 นาทีโดยไม่ขอความช่วยเหลือ
- สถานะ: พร้อมทำ

### T-20 ตรวจ flow การจองรวมตาม Acceptance Criteria
- รองรับ: FR-BKG-02, FR-BKG-03, FR-BKG-04, FR-BKG-05, DOM-PDPA-01, NFR-REL-02
- ตรวจด้วย: AC-BKG-01, AC-BKG-02, AC-BKG-03, AC-BKG-04, AC-BKG-06
- ไฟล์ที่แตะ: `backend/tests/test_booking_acceptance.py`, `frontend/src/__tests__/booking-acceptance.test.jsx`
- ต้องทำหลัง: T-07, T-08, T-09, T-10, T-12, T-15, T-17, T-18
- เสร็จเมื่อ: ชุดทดสอบรวมของ acceptance criteria ที่ระบุผ่านครบโดยไม่มี booking ซ้อนและมี audit log ครบ
- สถานะ: รอ Q-02

## ตารางตรวจความครบ

### Acceptance Criteria

| AC ID | task ที่ตรวจ AC นี้ |
|---|---|
| AC-BKG-01 | T-12 |
| AC-BKG-02 | T-07 |
| AC-BKG-03 | T-08, T-15 |
| AC-BKG-04 | T-09, T-17 |
| AC-BKG-05 | T-03 |
| AC-BKG-06 | T-10 |

### Constraints

| Constraint ID | task ที่ทำให้เป็นจริง |
|---|---|
| CON-TECH-01 | T-01, T-06 |
| DOM-PDPA-01 | T-01, T-10, T-20 |
| IF-IDP-01 | T-04, T-18 |
| IF-HIS-01 | T-01, T-05 |
| IF-NOT-01 | T-09 |

## สิ่งที่ยังไม่ทำ

- Q-02 หมายเลขคิวรีเซ็ตรายวัน หรือนับต่อเนื่อง และมีรูปแบบอย่างไร -> ถามเจ้าหน้าที่เวชระเบียน
  - tasks ที่รอคำตอบ: T-11, T-12, T-16, T-17, T-18, T-20
- ส่วนที่เกี่ยวข้องกับวิธีออกเลขคิวและการแสดงเลขคิวจะยังไม่สร้างจนกว่าจะได้คำตอบ
