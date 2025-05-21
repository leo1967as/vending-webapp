// 📄 frontend/src/pages/AdminPanel.jsx

import { useEffect, useState } from 'react';
import ConfirmModal from '../components/ConfirmModal';
import ProductRow from '../components/ProductRow';
import ProductForm from '../components/ProductForm';
import ProductTable from '../components/ProductTable';

const API_URL = 'http://localhost:3000/api';

export default function AdminPanel() {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [editData, setEditData] = useState({});
  const [newProduct, setNewProduct] = useState({ name: '', price: 0, image: '' });
  const [modal, setModal] = useState({ type: '', product: null });
const [showFormModal, setShowFormModal] = useState(false);

const fetchProducts = async () => {
  try {
    const res = await fetch(`${API_URL}/products`);
    if (!res.ok) throw new Error('Failed to fetch products');
    const data = await res.json();
    setProducts(data);
  } catch (err) {
    setMessage('❌ โหลดสินค้าล้มเหลว: ' + err.message);
  }
};

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleReset = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/reset/${id}`, { method: 'POST' });
      const data = await res.json();
      setMessage(data.message);
      await fetchProducts();
    } catch (err) {
      setMessage('❌ รีเซ็ตไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditing(product.id);
    setEditData({
      name: product.name,
      price: product.price,
      gpio_pin: product.gpio_pin,
      image: product.image
    });
  };

// 📄 frontend/src/pages/AdminPanel.jsx
const handleSave = async (id) => {
  setLoading(true);
  try {
    const res = await fetch(`${API_URL}/products/${id}`, { // Remove duplicate /api
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editData)
    });

    const data = await res.json();
    
    if (!res.ok) throw new Error(data.message || 'เกิดข้อผิดพลาด');

    setMessage('✅ แก้ไขสินค้าเรียบร้อยแล้ว');
    setEditing(null);
    await fetchProducts();
  } catch (err) {
    setMessage('❌ แก้ไขไม่สำเร็จ: ' + err.message);
  } finally {
    setLoading(false);
  }
};

const confirmDelete = async () => {
  const { product } = modal;
  if (!product) return;
  
  setLoading(true);
  try {
  const res = await fetch(`${API_URL}/products/${product.id}`, { // Remove duplicate /api
    method: 'DELETE',
    });

    const data = await res.json();
    
    if (!res.ok) throw new Error(data.message || 'เกิดข้อผิดพลาด');

    setMessage('🗑️ ลบสินค้าเรียบร้อยแล้ว');
    await fetchProducts();
  } catch (err) {
    setMessage('❌ ลบสินค้าไม่สำเร็จ: ' + err.message);
  } finally {
    setModal({ type: '', product: null });
    setLoading(false);
  }
};

const confirmAdd = async () => {
  setLoading(true);
  try {
    const res = await fetch(`${API_URL}/api/products`, { // เปลี่ยน endpoint
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct)
    });

    const data = await res.json();
    
    if (!res.ok) throw new Error(data.message || 'เกิดข้อผิดพลาด');

    setMessage('✅ เพิ่มสินค้าเรียบร้อยแล้ว');
    setNewProduct({ name: '', price: 0, image: '' });
    await fetchProducts();
  } catch (err) {
    setMessage('❌ เพิ่มสินค้าไม่สำเร็จ: ' + err.message);
  } finally {
    setModal({ type: '', product: null });
    setLoading(false);
  }
};

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ fontSize: '28px', color: '#1f2937', marginBottom: '20px' }}>🛠️ แผงควบคุม Admin</h1>
<button
  onClick={() => setShowFormModal(true)}
  style={{ backgroundColor: '#2563eb', color: 'white', padding: '10px 16px', borderRadius: '8px', fontWeight: 'bold', marginBottom: '20px' }}
>
  ➕ เพิ่มสินค้าใหม่
</button>

<ProductForm
  open={showFormModal}
  onClose={() => setShowFormModal(false)}
  newProduct={newProduct}
  setNewProduct={setNewProduct}
  onAdd={async () => {
    try {
      const res = await fetch(`${API_URL}/products`, { // เปลี่ยน endpoint เป็น /products
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newProduct.name,
          price: Number(newProduct.price),
          image: newProduct.image || null // ส่ง null ถ้าไม่มีรูป
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'เกิดข้อผิดพลาดในการเพิ่มสินค้า');
      }

      const data = await res.json();
      setShowFormModal(false);
      await fetchProducts();
      return data;
    } catch (error) {
      throw error;
    }
  }}
/>


<ProductTable
  products={products}
  editing={editing}
  editData={editData}
  onEdit={handleEdit}
  onChange={setEditData}
  onSave={handleSave}
  onCancel={() => setEditing(null)}
  onReset={handleReset}
  onDelete={(p) => setModal({ type: 'delete', product: p })}
  loading={loading}
/>

      <ConfirmModal
  open={modal.type !== ''}
  type={modal.type}
  name={modal.type === 'delete' ? modal.product?.name : newProduct.name}
  onConfirm={modal.type === 'delete' ? confirmDelete : confirmAdd}
  onCancel={() => setModal({ type: '', product: null })}
/>

    </div>
  );
}
