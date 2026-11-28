# ADR-002: Assistant ตอบคำถามอย่างเดียว ไม่มี tools และ MCP

- Status: Accepted
- Date: 2026-11-21

## Context

- Assistant นี้ ผมตั้งใจว่าให้มีหน้าที่ในการตอบคำถามของ User อิงตาม profile.md ไม่ได้ต้องการให้ทำเรื่องอื่นๆ ในตอนนี้
- User สามารถทำ Prompt Injection ใส่ Assistant ได้
- ถ้า Assistant มี tools ให้ใช้ ก็อาจจะเกิดเหตุการณ์ที่ User หลอก Assistant สำเร็จแล้วสั่งให้ Assistannt เรียก tools เหล่านั้น และเกิด action จริงได้ แต่ถ้าไม่มี tools ผลที่แย่ที่สุดคือแค่ Assistant ให้ข้อมูลผิดเท่านั้น ไม่มีอะไรเสียหายตามมา

## Decision

ไม่มี tool calling, function calling และ MCP Worker ทำแค่การส่งแค่ข้อความเข้าไป แล้วรับข้อความกลับมาจาก Assistant เท่านั้น

## Alternatives

- Tool อย่าง "ส่งข้อความหาธนกร" หรือ "นัดสัมภาษณ์": ไม่เลือก เพราะถูกใช้ส่ง spam ได้ และต้องมีระบบยืนยันตัวตนเพิ่ม ซึ่งเกิน scope
- MCP server ให้ model ดึงข้อมูล project เอง: ไม่จำเป็น เพราะ ADR-001 ใส่ข้อมูลทั้งหมดใน prompt อยู่แล้ว

## Consequences

- ถ้า prompt injection สำเร็จ ผลที่แย่ที่สุดคือ Assistant ให้ข้อมูลผิด หรือให้ system prompt ไป ซึ่งไม่มีข้อมูลลับอยู่ข้างใน
- คำตอบของ AI อาจถูกหลอกให้มีโค้ด HTML หรือ JavaScript อยู่ข้างใน widget จึงต้องแสดงคำตอบเป็นข้อความธรรมดา textContent ห้ามใช้ innerHTML เพื่อกัน XSS
