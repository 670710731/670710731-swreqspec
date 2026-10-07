# RTM: จองคิวตรวจสุขภาพ (Booking)
อ้างอิง: spec.md SPEC-BKG-001 Draft v2 | tasks.md | test-cases.md
สร้างด้วย /verify เมื่อ 2569-10-07 08.39 | test: 6 ผ่าน 0 ไม่ผ่าน (backend), 1 ผ่าน 1 todo (frontend)

## 1. ตามรอยไปข้างหน้า (requirement ไป โค้ด ไป test)
| ID | AC | task | โค้ด (ไฟล์: ฟังก์ชัน) | test (ผล) | สถานะ |
|---|---|---|---|---|---|
| FR-BKG-01 | AC-BKG-05 | T-02 เสร็จ, T-10 พร้อมทำ | `backend/app/slots/service.py:list_available_slots`, `backend/app/slots/router.py:get_slots` | `test_AC_BKG_05` (ผ่าน) แต่ค้นได้ 14 วันและยังไม่มีหน้าจอ | ช่องโหว่ |
| FR-BKG-02 | AC-BKG-02 | T-04 พร้อมทำ | ยังไม่มีโค้ดกันจองซ้ำ | ไม่มี | ยังไม่ถึง |
| FR-BKG-03 | AC-BKG-03 | T-05, T-11, T-12 พร้อมทำ | ยังไม่มีโค้ดเสนอช่วงใกล้เคียง | ไม่มี | ยังไม่ถึง |
| FR-BKG-04 | AC-BKG-01 | T-03 เสร็จ, T-06 รอ Q-02 | `backend/app/booking/service.py:create_booking`, `backend/app/booking/router.py:create_booking` | `test_AC_BKG_01`, `test_TC_BKG_01_1_success_booking`, `test_TC_BKG_01_2_boundary_one_to_zero` (ผ่าน); การแสดงผลเป็น todo | ช่องโหว่ |
| FR-BKG-05 | AC-BKG-04 | T-07 พร้อมทำ | ไม่มีโค้ดคิวแจ้งเตือน/ส่งซ้ำ | ไม่มี | ยังไม่ถึง |
| FR-BKG-06 | ไม่มี AC | T-02 เสร็จ, T-10 พร้อมทำ | `backend/app/slots/service.py:list_available_slots` กรอง `package_code`; ยังไม่มีหน้าจอ | ไม่มี test เปลี่ยนแพ็กเกจ | ช่องโหว่ |
| NFR-PERF-01 | AC-BKG-05 | T-02 เสร็จ | `backend/app/slots/router.py:get_slots` | `test_AC_BKG_05` (ผ่าน) แต่เรียกแบบวนซ้ำ ไม่ใช่ผู้ใช้พร้อมกัน 200 คน | ช่องโหว่ |
| NFR-SEC-01 | ไม่มี AC | ไม่มี task ที่เสร็จ | ไม่พบการบังคับ TLS 1.2+ ในโค้ดหรือการตั้งค่า | ไม่มี | ช่องโหว่ |
| NFR-REL-02 | AC-BKG-04 | T-07 พร้อมทำ | ไม่มีโค้ดส่งซ้ำ | ไม่มี | ยังไม่ถึง |
| NFR-USE-01 | ไม่มี AC | ไม่มี task ที่เสร็จ | ไม่มี flow หน้าจอสำหรับทดสอบผู้ใช้ใหม่ | ไม่มี | ยังไม่ถึง |
| CON-TECH-01 | ไม่มี AC ตรง ๆ | T-01 เสร็จ | `backend/app/config.py:DATABASE_URL`, `backend/app/db/session.py:engine` ใช้ SQLite เป็นค่าเริ่มต้น | `test_T01_tables_created` (ผ่านบน SQLite) | ช่องโหว่ |
| DOM-PDPA-01 | AC-BKG-06 | T-01 เสร็จ, T-08 พร้อมทำ | มี model `AuditLog` แต่ไม่มี middleware บันทึกการเข้าถึง | ไม่มี | ยังไม่ถึง |
| IF-IDP-01 | AC-BKG-01 | T-03 เสร็จ | `backend/app/auth/idp.py:get_verified_hn` และ dependency ใน `create_booking` | ไม่มี test กรณีไม่ยืนยันตัวตน | ช่องโหว่ |
| IF-HIS-01 | ไม่มี AC ตรง ๆ | T-01 เสร็จ, T-09 พร้อมทำ | มีเพียง `hn` ใน `Booking`; ไม่มี `/patients/lookup` และรับ/เขียน `national_id` ใน `BookingRequest`/log | `test_T01_no_national_id` (ผ่าน) แต่ไม่ตรวจการส่งต่อ HIS | ช่องโหว่ |
| IF-NOT-01 | AC-BKG-04 | T-07 พร้อมทำ | ไม่มีโค้ดคิวแจ้งเตือนแบบ asynchronous | ไม่มี | ยังไม่ถึง |
| AC-BKG-01 | AC-BKG-01 | T-03 เสร็จ, T-06 รอ Q-02 | API บันทึกและตัดที่นั่ง; ยังไม่มี `BookingResult` | backend 3 tests (ผ่าน); frontend `test_TC_BKG_01_3_show_queue_number` (todo) | รอ Q-02 |
| AC-BKG-02 | AC-BKG-02 | T-04 พร้อมทำ | ไม่มี | ไม่มี | ยังไม่ถึง |
| AC-BKG-03 | AC-BKG-03 | T-05, T-11, T-12 พร้อมทำ | ไม่มี | ไม่มี | ยังไม่ถึง |
| AC-BKG-04 | AC-BKG-04 | T-07 พร้อมทำ | ไม่มี | ไม่มี | ยังไม่ถึง |
| AC-BKG-05 | AC-BKG-05 | T-02 เสร็จ | `GET /slots` | `test_AC_BKG_05` (ผ่าน แต่ test ไม่จำลอง concurrency) | ช่องโหว่ |
| AC-BKG-06 | AC-BKG-06 | T-08 พร้อมทำ | ไม่มี middleware audit | ไม่มี | ยังไม่ถึง |

## 2. ตามรอยย้อนกลับ (โค้ด ไป requirement)
| โค้ด (ไฟล์: ฟังก์ชัน หรือ endpoint) | อ้าง ID | ตรงกับข้อความใน spec ไหม | หมายเหตุ |
|---|---|---|---|
| `backend/app/slots/router.py:get_slots` (`GET /slots`) | FR-BKG-01, FR-BKG-06 | บางส่วน | คืนช่วงที่ยังว่างและกรองแพ็กเกจ แต่ช่วงเวลา 14 วันไม่ตรง 30 วัน และยังไม่มีหน้าจอ |
| `backend/app/booking/router.py:create_booking` (`POST /bookings`) | FR-BKG-04, IF-IDP-01 | บางส่วน | ตรวจ token และเรียกบันทึกการจอง แต่ยังไม่มี notification และการแสดงผลหน้าจอ |
| `backend/app/booking/service.py:create_booking` | FR-BKG-04 | ไม่ตรงทั้งหมด | ออก `A001` ทั้งที่ Q-02 ยังไม่ตอบ และตรวจเต็มด้วย `remaining < 0` ทำให้ค่า 0 ยังถูกจองต่อได้ |
| `backend/app/booking/service.py:next_queue_no` | FR-BKG-04 | ไม่ตรง | ใช้รูปแบบ `A001` และรีเซ็ตรายวันจากตัวอย่างใน Q-02 ก่อนมีคำตอบ |
| `backend/app/auth/idp.py:get_verified_hn` | IF-IDP-01 | บางส่วน | เป็น mock token prefix ไม่ใช่การตรวจผลจากระบบยืนยันตัวตนจริง และไม่มี test รองรับกรณีปฏิเสธ |
| `backend/app/config.py:DATABASE_URL` | CON-TECH-01 | ไม่ตรงค่าเริ่มต้น | ค่าเริ่มต้นเป็น SQLite ไม่ใช่ PostgreSQL ตาม constraint |
| `backend/app/db/models.py:BookingRequest`/`Booking` model fields | IF-HIS-01 | ไม่ตรงทั้งหมด | `Booking` ไม่มี national_id ถูกต้อง แต่ request รับและ logger เขียน national_id ทั้งที่ไม่จำเป็นต้องเก็บ/บันทึก |
| `backend/app/db/models.py:AuditLog` | DOM-PDPA-01 | ยังไม่ครบ | มี schema แต่ไม่มีการสร้าง audit log ทุกครั้งที่เข้าถึงข้อมูล |
| `frontend/src/api/client.js:api` | FR-BKG-01, FR-BKG-03, FR-BKG-04 | ยังไม่ครบ | มี client บาง endpoint แต่ไม่มีหน้าจอที่ใช้จริงและไม่มี auth header |
| `frontend/src/App.jsx:App` | Goal, FR-BKG-01 ถึง FR-BKG-05 | ไม่ตรง | แสดงเพียงหน้าโครง ไม่มี flow จองคิว |

## 3. ข้อค้นพบ
ชนิด: AC ไม่มี test / test อ่อน / โค้ดไม่มี FR / FR ไม่มี AC / เดา Q-xx / ละเมิด Constraint / ตัวเลขไม่ตรง spec / อ้าง ID ผิดเรื่อง
ทีมตัดสิน: แก้โค้ด / แก้ spec / เพิ่ม Q-xx / ไม่ใช่ปัญหา (พร้อมเหตุผล 1 บรรทัด)

| F-ID | ชนิด | อยู่ที่ | ขัดกับ | รายละเอียด | ทีมตัดสิน |
|---|---|---|---|---|---|
| F-01 | ตัวเลขไม่ตรง spec | `backend/app/slots/service.py:DAYS_AHEAD` | FR-BKG-01 | กำหนด 14 วัน แต่ spec กำหนดภายใน 30 วัน | |
| F-02 | เดา Q-xx | `backend/app/booking/service.py:next_queue_no` | Q-02, FR-BKG-04 | ใช้รูปแบบ `A001` และรีเซ็ตรายวันจากตัวอย่างในคำถาม ทั้งที่ Q-02 ยังไม่มีคำตอบ | |
| F-03 | โค้ดไม่มี FR | `backend/app/booking/service.py:create_booking` | FR-BKG-04 | ตรวจช่วงเต็มด้วย `remaining < 0` ทำให้ช่วงที่เหลือ 0 ที่ยังถูกจองได้ | |
| F-04 | ละเมิด Constraint | `backend/app/config.py:DATABASE_URL` | CON-TECH-01 | ค่าเริ่มต้นเป็น SQLite แม้ constraint บังคับ PostgreSQL | |
| F-05 | ละเมิด Constraint | `backend/app/booking/router.py:BookingRequest`, `create_booking` | IF-HIS-01 | รับและเขียน `national_id` ลง log ทั้งที่ข้อมูลนี้ต้องส่งต่อ HIS และไม่ควรถูกเก็บ/บันทึกในระบบจอง | |
| F-06 | โค้ดไม่มี FR | `backend/app/booking/router.py:cancel_booking` | Out of scope UC-02 | เพิ่ม endpoint ยกเลิกคิว ทั้งที่การยกเลิกอยู่ใน Out of scope | แก้โค้ดแล้ว |
| F-07 | test อ่อน | `backend/tests/test_AC_BKG_05.py:test_AC_BKG_05` | NFR-PERF-01 | วนเรียก 200 ครั้งแบบ sequential ไม่ได้วัด p95 ภายใต้ผู้ใช้พร้อมกัน 200 คน | |
| F-08 | AC ไม่มี test | `frontend/src/__tests__/AC-BKG-01.test.jsx` | AC-BKG-01 | มีเพียง `test.todo`; ยังไม่มี test ที่ assert การแสดงหมายเลขคิว และยังไม่มี `BookingResult` | |
| F-09 | FR ไม่มี AC | spec.md / tasks.md | FR-BKG-06 | FR-BKG-06 ไม่มี AC และไม่มี test ที่ตรวจการเปลี่ยนแพ็กเกจ | |
| F-10 | โค้ดไม่มี FR | `backend/app/booking/router.py` และ `backend/app/notify/` | FR-BKG-05, IF-NOT-01, NFR-REL-02 | ไม่มีการวางคิวแจ้งเตือนหรือส่งซ้ำภายใน 5 นาที | |
| F-11 | โค้ดไม่มี FR | `backend/app/audit/` | DOM-PDPA-01 | ไม่มี audit middleware และไม่มี test AC-BKG-06 | |
| F-12 | ละเมิด Constraint | `backend/app/auth/idp.py:get_verified_hn` | IF-IDP-01 | ใช้ token mock แบบ prefix เป็นกลไกยืนยันตัวตนจริงไม่ได้ และไม่มี test ปฏิเสธผู้ไม่ยืนยัน | |

## 4. แก้แล้ว
| F-ID | แก้อย่างไร | รู้ได้อย่างไร |
|---|---|---|
| F-06 | ลบ `DELETE /bookings/{booking_id}` และ `service.cancel_booking` ออกจากระบบ | ค้นไม่พบ endpoint หรือฟังก์ชันยกเลิกในโค้ดหลังแก้ไข |
