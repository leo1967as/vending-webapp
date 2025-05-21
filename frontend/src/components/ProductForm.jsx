// 📄 frontend/src/components/ProductForm.jsx
import React, { useState } from 'react';
import ReactDOM from 'react-dom';

export default function ProductForm({ open, onClose, newProduct, setNewProduct, onAdd }) {
  if (!open) return null;

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Styles
  const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  };

  const modalContentStyle = {
    backgroundColor: 'white',
    padding: '28px 32px',
    borderRadius: '12px',
    width: '480px',
    maxWidth: '90vw',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
  };

  const headerStyle = {
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '24px',
    color: '#1F2937',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  };

  const formGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
    marginBottom: '24px',
  };

  const fieldWrapperStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  };

  const labelStyle = {
    fontWeight: '500',
    fontSize: '14px',
    color: '#4B5563',
  };

  const inputStyle = {
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #E5E7EB',
    fontSize: '14px',
    width: '100%',
    backgroundColor: '#F9FAFB',
    transition: 'all 0.2s ease',
  };

  const errorMessageStyle = {
    color: '#EF4444',
    fontSize: '12px',
    marginTop: '4px',
  };

  const inputErrorStyle = {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  };

  const buttonGroupStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '8px',
  };

  const buttonBaseStyle = {
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!newProduct.name?.trim()) {
      newErrors.name = 'กรุณากรอกชื่อสินค้า';
    }
    
    if (!newProduct.price || isNaN(newProduct.price) || Number(newProduct.price) <= 0) {
      newErrors.price = 'กรุณากรอกราคาที่ถูกต้อง (มากกว่า 0 บาท)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onAdd();
      setNewProduct({ name: '', price: '', image: '' });
      setErrors({});
    } catch (error) {
      console.error('Error:', error);
      setErrors({
        form: error.message || 'เกิดข้อผิดพลาดในการเพิ่มสินค้า'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({
      ...prev,
      [name]: name === 'price' ? value.replace(/[^0-9.]/g, '') : value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleInputFocus = (e) => {
    e.target.style.borderColor = '#3B82F6';
    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
  };

  const handleInputBlur = (e) => {
    e.target.style.borderColor = '#E5E7EB';
    e.target.style.boxShadow = 'none';
  };

  return ReactDOM.createPortal(
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <h2 style={headerStyle}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1F2937" strokeWidth="2">
            <path d="M12 4V20M4 12H20" strokeLinecap="round"/>
          </svg>
          เพิ่มสินค้าใหม่
        </h2>

        {errors.form && (
          <div style={{
            backgroundColor: '#FEE2E2',
            color: '#B91C1C',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '16px',
          }}>
            {errors.form}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={formGroupStyle}>
            <div style={fieldWrapperStyle}>
              <label style={labelStyle}>ชื่อสินค้า</label>
              <input
                name="name"
                style={{
                  ...inputStyle,
                  ...(errors.name && inputErrorStyle)
                }}
                placeholder="เช่น Coca-Cola, Snickers"
                value={newProduct.name}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              />
              {errors.name && <span style={errorMessageStyle}>{errors.name}</span>}
            </div>

            <div style={fieldWrapperStyle}>
              <label style={labelStyle}>ราคา (บาท)</label>
              <input
                name="price"
                style={{
                  ...inputStyle,
                  ...(errors.price && inputErrorStyle)
                }}
                placeholder="เช่น 20.00"
                type="number"
                min="0.01"
                step="0.01"
                value={newProduct.price}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              />
              {errors.price && <span style={errorMessageStyle}>{errors.price}</span>}
            </div>

            <div style={fieldWrapperStyle}>
              <label style={labelStyle}>
                ลิงก์รูปภาพ
                <span style={{ fontSize: '12px', color: '#6B7280', marginLeft: '8px' }}>
                  (ไม่จำเป็น)
                </span>
              </label>
              <input
                name="image"
                style={inputStyle}
                placeholder="เช่น https://example.com/product.jpg"
                value={newProduct.image}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              />
            </div>
          </div>

          <div style={buttonGroupStyle}>
            <button 
              type="button"
              onClick={onClose} 
              style={{
                ...buttonBaseStyle,
                backgroundColor: '#F3F4F6',
                color: '#4B5563',
              }}
              disabled={isSubmitting}
            >
              ยกเลิก
            </button>
            <button 
              type="submit"
              style={{
                ...buttonBaseStyle,
                backgroundColor: '#10B981',
                color: 'white',
                opacity: isSubmitting ? 0.7 : 1,
                cursor: isSubmitting ? 'not-allowed' : 'pointer'
              }}
              disabled={isSubmitting}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 13L9 17L19 7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {isSubmitting ? 'กำลังเพิ่ม...' : 'เพิ่มสินค้า'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}