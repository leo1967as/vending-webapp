// 📄 backend/routes/motorMapping.js
import express from 'express';
import db from '../db.js';

const router = express.Router();

// 🔹 GET: ดึง mapping ทั้งหมด
router.get('/', async (req, res) => {
  await db.read();
  res.json(db.data.mappings || {});
});

// 🔸 PUT: อัปเดต mapping สำหรับ GPIO เดียว
router.put('/:gpio', async (req, res) => {
  const gpio = req.params.gpio;
  const { productId } = req.body;

  await db.read();
  db.data.mappings ||= {};
  db.data.mappings[gpio] = productId;
  await db.write();

  res.json({ success: true, gpio, productId });
});

// 🔸 PUT: อัปเดต mapping แบบหลาย GPIO พร้อมกัน
router.put('/bulk', async (req, res) => {
  const { motorIds, productId } = req.body;

  if (!Array.isArray(motorIds)) {
    return res.status(400).json({ success: false, message: 'motorIds ต้องเป็น array' });
  }

  await db.read();
  db.data.mappings ||= {};

  motorIds.forEach(gpio => {
    db.data.mappings[gpio] = productId;
  });

  await db.write();
  res.json(db.data.mappings);
});

// 🔹 POST: เขียน mappings ทั้งหมดใหม่ (เช่น จากปุ่ม "บันทึกทั้งหมด")
router.post('/', async (req, res) => {
  const newMappings = req.body;
  await db.read();
  db.data.mappings = newMappings;
  await db.write();

  res.json({ success: true, message: 'บันทึกการแมปทั้งหมดแล้ว' });
});

export default router;
