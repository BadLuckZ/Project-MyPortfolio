# ADR-001: ใส่ profile ทั้งหมดใน system prompt (ไม่ใช้ RAG)

- Status: Accepted
- Date: 2026-11-21

## Context

- ข้อมูล profile ใน profile.md มีขนาด 8251 tokens (วัดด้วย tokenizer o200k_base ของ OpenAI)

## Decision

ส่ง `profile.md` ทั้งไฟล์ไปใน system prompt ทุก request โดยแยกจากข้อความ
ของผู้ใช้ เพื่อให้ model แยกได้ว่าอะไรคือข้อมูลที่เชื่อถือได้ และอะไรคือ
input จากผู้ใช้

## Alternatives

- RAG + vector DB: ไม่เลือก เพราะข้อมูลน้อยเกินกว่าจะคุ้มกับ infra ที่เพิ่ม และถ้า retrieval ดึงข้อมูลมาไม่ครบ model อาจเดาส่วนที่ขาดเอง
- ใส่ profile ไว้ใน user message: ไม่เลือก เพราะข้อมูลจริงจะปนกับข้อความที่ผู้ใช้พิมพ์ ทำให้ prompt injection ทำได้ง่ายขึ้น

## Consequences

- ทุก request ใช้ token ประมาณ 8k เป็นอย่างน้อย ซึ่งกินโควต้าของ free tier
- ถ้าข้อมูลโตขึ้นมาก ก็อาจจะต้องแก้ไข ADR นี้
