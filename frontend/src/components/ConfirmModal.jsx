// 📄 frontend/src/components/ConfirmModal.jsx
import React from 'react';
import ReactDOM from 'react-dom';

export default function ConfirmModal({ open, type, name, onConfirm, onCancel }) {
  if (!open) return null;

  return ReactDOM.createPortal(
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
      <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '10px', width: '400px', textAlign: 'center', transform: 'scale(1)', transition: 'transform 0.3s ease' }}>
        <h3 style={{ fontSize: '18px', marginBottom: '20px' }}>
          {type === 'delete' ? `คุณต้องการลบ "${name}" ใช่หรือไม่?` : `คุณต้องการเพิ่ม "${name}" ใช่หรือไม่?`}
        </h3>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
          <button onClick={onCancel} style={{ backgroundColor: '#9ca3af', color: 'white', padding: '10px 15px', borderRadius: '5px' }}>ยกเลิก</button>
          <button onClick={onConfirm} style={{ backgroundColor: type === 'delete' ? '#ef4444' : '#22c55e', color: 'white', padding: '10px 15px', borderRadius: '5px' }}>ยืนยัน</button>
        </div>
      </div>
    </div>,
    document.body
  );
}
