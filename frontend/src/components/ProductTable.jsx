// 📄 frontend/src/components/ProductTable.jsx
import React from 'react';
import ProductRow from './ProductRow';

export default function ProductTable({
  products,
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
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ backgroundColor: '#e5e7eb' }}>
          <th style={{ padding: '10px' }}>ชื่อสินค้า</th>
          <th>ราคา</th>
          <th>GPIO</th>
          <th>รูปภาพ</th>
          <th>จำนวน</th>
          <th>จัดการ</th>
        </tr>
      </thead>
      <tbody>
        {products.map(product => (
          <ProductRow
            key={product.id}
            product={product}
            editing={editing}
            editData={editData}
            onEdit={onEdit}
            onChange={onChange}
            onSave={onSave}
            onCancel={onCancel}
            onReset={onReset}
            onDelete={onDelete}
            loading={loading}
          />
        ))}
      </tbody>
    </table>
  );
}
