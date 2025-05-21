import express from 'express';
import cors from 'cors';
import db from './db.js';
import motorMappingRoutes from './routes/motorMapping.js';

const app = express();
const PORT = 3000;

// ตั้งค่า CORS ให้ครอบคลุม
app.use(cors({
  origin: 'http://localhost:5173', // เปลี่ยนเป็น origin ของ frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

app.use(express.json());
app.use('/api/motor-mapping', motorMappingRoutes);

async function main() {
  await db.read();
  db.data ||= { products: [] };
  await db.write();

  // 📦 เอาท์ไลน์ API ใหม่
  // ========================

  // 1. ดึงข้อมูลสินค้าทั้งหมด
  app.get('/api/products', async (req, res) => {
    await db.read();
    res.json(db.data.products);
  });

  // 2. เพิ่มสินค้าใหม่
  app.post('/api/products', async (req, res) => {
    try {
      await db.read();
      const { name, price, image } = req.body;

      // Validate ข้อมูล
      if (!name || !price) {
        return res.status(400).json({ 
          success: false, 
          message: 'กรุณากรอกชื่อสินค้าและราคา' 
        });
      }

      // สร้าง ID ใหม่
      const newId = db.data.products.length 
        ? Math.max(...db.data.products.map(p => p.id)) + 1 
        : 1;

      // สร้างสินค้าใหม่
      const newProduct = {
        id: newId,
        name,
        price: Number(price),
        gpio_pin: 0, // ค่าเริ่มต้น
        image: image || '',
        quantity: 15
      };

      db.data.products.push(newProduct);
      await db.write();

      res.status(201).json({
        success: true,
        message: `✅ เพิ่มสินค้า ${name} สำเร็จ`,
        product: newProduct
      });

    } catch (error) {
      console.error('Error adding product:', error);
      res.status(500).json({
        success: false,
        message: 'เกิดข้อผิดพลาดในการเพิ่มสินค้า'
      });
    }
  });

  // 3. แก้ไขสินค้า
// เพิ่ม endpoint การแก้ไขสินค้าแบบใหม่
app.put('/api/products/:id', async (req, res) => {
  try {
    await db.read();
    const productId = parseInt(req.params.id);
    const product = db.data.products.find(p => p.id === productId);

    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'ไม่พบสินค้า' 
      });
    }

    const { name, price, image } = req.body;
    
    // อัพเดทข้อมูล
    if (name) product.name = name;
    if (price) product.price = Number(price);
    if (image) product.image = image;

    await db.write();

    res.json({
      success: true,
      message: `📝 แก้ไข ${product.name} สำเร็จ`,
      product
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการอัพเดทสินค้า'
    });
  }
});

  // 4. ลบสินค้า
  app.delete('/api/products/:id', async (req, res) => {
    try {
      await db.read();
      const productId = parseInt(req.params.id);
      const index = db.data.products.findIndex(p => p.id === productId);

      if (index === -1) {
        return res.status(404).json({ 
          success: false, 
          message: 'ไม่พบสินค้า' 
        });
      }

      const deletedProduct = db.data.products.splice(index, 1)[0];
      await db.write();

      res.json({
        success: true,
        message: `🗑️ ลบสินค้า ${deletedProduct.name} เรียบร้อย`,
        productId
      });

    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({
        success: false,
        message: 'เกิดข้อผิดพลาดในการลบสินค้า'
      });
    }
  });

  // 🎰 ฟังก์ชันการทำงานของเครื่อง
  // =============================
  app.post('/api/dispense/:id', async (req, res) => {
    await db.read();
    const product = db.data.products.find(p => p.id === parseInt(req.params.id));
    
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'ไม่พบสินค้า' 
      });
    }
    
    if (product.quantity <= 0) {
      return res.json({ 
        success: false, 
        message: `${product.name} ของหมด` 
      });
    }

    product.quantity--;
    await db.write();
    
    res.json({ 
      success: true, 
      message: `✅ จ่าย ${product.name} เรียบร้อย`, 
      gpio: product.gpio_pin 
    });
  });

  app.post('/api/reset/:id', async (req, res) => {
    await db.read();
    const product = db.data.products.find(p => p.id === parseInt(req.params.id));
    
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'ไม่พบสินค้า' 
      });
    }

    product.quantity = 15;
    await db.write();
    
    res.json({ 
      success: true, 
      message: `รีเซ็ต ${product.name} เรียบร้อย` 
    });
  });

  // ก่อนแก้ไข: ไม่มี endpoints สำหรับจัดการการแมป
// หลังแก้ไข: เพิ่ม endpoints ทั้งหมด

// 2.1 ดึงข้อมูลการแมปทั้งหมด
app.get('/api/motor-mappings', async (req, res) => {
  try {
    await db.read();
    res.json(db.data.motorMappings || {});
  } catch (error) {
    res.status(500).json({ error: 'Failed to load motor mappings' });
  }
});

// 2.2 อัพเดทการแมปทีละ GPIO
app.put('/api/motor-mappings/:motorId', async (req, res) => {
  try {
    await db.read();
    const { motorId } = req.params;
    const { productId } = req.body;

    db.data.motorMappings = db.data.motorMappings || {};
    db.data.motorMappings[motorId] = productId || null;

    await db.write();
    res.json({ 
      success: true, 
      updatedMappings: db.data.motorMappings 
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update mapping' });
  }
});

// 2.3 อัพเดทการแมปรวมหลาย GPIO
app.put('/api/motor-mappings/bulk', async (req, res) => {
  try {
    await db.read();
    const { motorIds, productId } = req.body;

    db.data.motorMappings = db.data.motorMappings || {};
    motorIds.forEach(id => {
      db.data.motorMappings[id] = productId || null;
    });

    await db.write();
    res.json({ 
      success: true, 
      updatedMappings: db.data.motorMappings 
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to bulk update' });
  }
});

// 2.4 บันทึกการแมปทั้งหมด
app.post('/api/motor-mappings', async (req, res) => {
  try {
    await db.read();
    db.data.motorMappings = req.body;
    await db.write();
    res.json({ 
      success: true, 
      mappings: db.data.motorMappings 
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save all mappings' });
  }
});
  // เริ่มต้นเซิร์ฟเวอร์
  app.listen(PORT, () => {
    console.log(`✅ Backend API Running at http://localhost:${PORT}`);
  });
}

main();