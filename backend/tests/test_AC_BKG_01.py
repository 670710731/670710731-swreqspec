# test ของ T-03: จองคิวสำเร็จ
# AC-BKG-01 (FR-BKG-04)
from tests.conftest import AUTH


def test_AC_BKG_01(client, make_slot):
    """AC-BKG-01: ยืนยันตัวตนแล้ว และช่วง 09.00 น. มีที่นั่งว่าง จองแล้วต้องสำเร็จ"""
    slot = make_slot(start="09:00", remaining=1)

    res = client.post("/bookings", json={"slot_id": slot.id}, headers=AUTH)

    assert res.status_code == 201


def test_TC_BKG_01_1_success_booking(client, make_slot, db):
    # Given ยืนยันตัวตนแล้ว และช่วง 09.00 น. มีที่นั่งว่าง 1 ที่
    slot = make_slot(start="09:00", remaining=1)

    # When ยืนยันการจอง
    res = client.post("/bookings", json={"slot_id": slot.id}, headers=AUTH)

    # Then บันทึกสำเร็จ
    assert res.status_code == 201
    assert res.json()["booking_id"] is not None
    # Then คืนหมายเลขคิว (รอ Q-02)
    # ยังไม่ตรวจหมายเลขคิวเพราะรอ Q-02
    # Then ที่นั่งว่างของช่วงนั้นเป็น 0
    db.refresh(slot)
    assert slot.remaining == 0


def test_TC_BKG_01_2_boundary_one_to_zero(client, make_slot, db):
    # Given ยืนยันตัวตนแล้ว และช่วง 09.00 น. มีที่นั่งว่าง 1 ที่พอดี
    slot = make_slot(start="09:00", remaining=1)
    assert slot.remaining == 1

    # When ยืนยันการจอง
    res = client.post("/bookings", json={"slot_id": slot.id}, headers=AUTH)

    # Then บันทึกสำเร็จ
    assert res.status_code == 201
    assert res.json()["booking_id"] is not None
    # Then คืนหมายเลขคิว (รอ Q-02)
    # ยังไม่ตรวจหมายเลขคิวเพราะรอ Q-02
    # Then ที่นั่งว่างของช่วงนั้นเปลี่ยนจาก 1 เป็น 0
    db.refresh(slot)
    assert slot.remaining == 0
