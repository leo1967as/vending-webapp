// 📄 backend/routes/products.js
import express from 'express';
import db from '../db.js';

const router = express.Router();

// โหลดรายการสินค้า
router.get('/', async (req, res) => {
  await db.read();
  res.json(db.data.products || []);
});

export default router;
