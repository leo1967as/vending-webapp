import { useState, useEffect } from 'react';

const API_URL = "http://localhost:3000/api";

export default function useVendingMachine() {
  const [products, setProducts] = useState([]);
  const [insertedMoney, setInsertedMoney] = useState(0);
  const [change, setChange] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [message, setMessage] = useState('กรุณาเลือกสินค้าและใส่เงิน');
  const [loading, setLoading] = useState(false);

  // 🔄 โหลดสินค้าเมื่อเปิดแอป
  useEffect(() => {
    fetch(`${API_URL}/products`)
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => {
        console.error('โหลดสินค้าไม่สำเร็จ', err);
        setMessage('❌ โหลดสินค้าล้มเหลว กรุณารีเฟรช');
      });
  }, []);

  // ... (ที่เหลือเหมือนเดิม)

  const insertCoin = (amount) => {
    setInsertedMoney(insertedMoney + amount);
    setMessage(`ใส่เงิน ${amount} บาท รวมเป็น ${insertedMoney + amount} บาท`);
  };

  const selectProduct = (product) => {
    setSelectedProduct(product);
    setMessage(`คุณเลือก ${product.name} ราคา ${product.price} บาท`);
  };

  const dispenseProduct = async (productId) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/dispense/${productId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'dispense' })
      });
      if (!response.ok) throw new Error('การจ่ายสินค้าล้มเหลว');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการจ่ายสินค้า:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

const purchaseProduct = async () => {
  if (!selectedProduct) {
    setMessage('กรุณาเลือกสินค้าก่อน');
    return;
  }

  if (selectedProduct.quantity <= 0) {
    setMessage('ขออภัย สินค้าหมด');
    return;
  }

  if (insertedMoney < selectedProduct.price) {
    setMessage(`เงินไม่พอ กรุณาใส่เงินเพิ่มอีก ${selectedProduct.price - insertedMoney} บาท`);
    return;
  }

  setMessage(`📦 กำลังจ่าย ${selectedProduct.name}...`);
  setLoading(true);

  try {
    // 🟢 เรียก API เพื่อจ่ายสินค้า (ฝั่ง backend จะจัดการ quantity ให้เอง)
    const response = await fetch(`${API_URL}/dispense/${selectedProduct.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'dispense' })
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'การจ่ายสินค้าล้มเหลว');
    }

    // 🕐 รอ 1.5 วิ (เหมือนเครื่องจ่ายจริง)
    await new Promise(resolve => setTimeout(resolve, 1500));

    // 🔁 โหลดสินค้าใหม่ทั้งหมดจาก API
    const refreshed = await fetch(`${API_URL}/products`).then(res => res.json());
    setProducts(refreshed);

    // 💰 อัปเดตเงินทอน + สถานะ
    setChange(insertedMoney - selectedProduct.price);
    setMessage(`✅ จ่าย ${selectedProduct.name} สำเร็จ เงินทอน ${insertedMoney - selectedProduct.price} บาท`);
    setInsertedMoney(0);
    setSelectedProduct(null);
  } catch (error) {
    setMessage(`❌ เกิดข้อผิดพลาดในการจ่ายสินค้า: ${error.message}`);
  } finally {
    setLoading(false);
  }
};

  const getChange = () => {
    setMessage(`คุณได้รับเงินทอน ${change} บาท`);
    setChange(0);
  };

  return {
    products, insertedMoney, change, selectedProduct, loading, message,
    insertCoin, selectProduct, purchaseProduct, getChange
  };
}
