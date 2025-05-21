// 📄 frontend/src/components/ProductRow.jsx
import React from 'react';

export default function ProductRow({
  product,
  editing,
  editData,
  onEdit,
  onChange,
  onSave,
  onCancel,
  onReset,
  onDelete,
  loading
}) {
  const isEditing = editing === product.id;

  return (
    <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
      <td style={{ padding: '10px' }}>
        {isEditing ? (
          <input value={editData.name} onChange={e => onChange({ ...editData, name: e.target.value })} />
        ) : product.name}
      </td>
      <td style={{ textAlign: 'center' }}>
        {isEditing ? (
          <input type="number" value={editData.price} onChange={e => onChange({ ...editData, price: Number(e.target.value) })} />
        ) : product.price}
      </td>
      <td style={{ textAlign: 'center' }}>
        {isEditing ? (
          <input type="number" value={editData.gpio_pin} onChange={e => onChange({ ...editData, gpio_pin: Number(e.target.value) })}
          disabled />
        ) : product.gpio_pin}
      </td>
      <td style={{ textAlign: 'center' }}>
        {isEditing ? (
          <input value={editData.image} onChange={e => onChange({ ...editData, image: e.target.value })} />
        ) : (
          <img src={product.image} alt="img" width={40} />
        )}
      </td>
      <td style={{ textAlign: 'center' }}>{product.quantity}</td>
      <td style={{ textAlign: 'center' }}>
        {isEditing ? (
          <>
            <button onClick={() => onSave(product.id)} disabled={loading} style={{ backgroundColor: '#16a34a', color: 'white', marginRight: '5px', padding: '5px' }}>💾 บันทึก</button>
            <button onClick={onCancel} style={{ backgroundColor: '#9ca3af', color: 'white', padding: '5px' }}>❌ ยกเลิก</button>
          </>
        ) : (
          <>
            <button onClick={() => onEdit(product)} style={{ backgroundColor: '#3b82f6', color: 'white', marginRight: '5px', padding: '5px' }}>✏️ แก้ไข</button>
            <button onClick={() => onReset(product.id)} disabled={loading} style={{ backgroundColor: '#f97316', color: 'white', marginRight: '5px', padding: '5px' }}>♻️ เติมสินค้า</button>
            <button onClick={() => onDelete(product)} disabled={loading} style={{ backgroundColor: '#ef4444', color: 'white', padding: '5px' }}>🗑️ ลบ</button>
          </>
        )}
      </td>
    </tr>
  );
}
