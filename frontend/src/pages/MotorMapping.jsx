// 📄 frontend/src/pages/MotorMapping.jsx
import React, { useEffect, useState } from 'react';

const API_URL = 'http://localhost:3000/api';

export default function MotorMapping() {
  const [products, setProducts] = useState([]);
  const [mappings, setMappings] = useState({});
  const [pairMode, setPairMode] = useState(false);
  const [currentPair, setCurrentPair] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState(null);

  const motorList = Array.from({ length: 60 }, (_, i) => i + 10); // GPIO 10-69

  // 🔄 ดึงข้อมูล
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [productsRes, mappingsRes] = await Promise.all([
        fetch(`${API_URL}/products`),
        fetch(`${API_URL}/motor-mappings`)
      ]);
      
      if (!productsRes.ok) throw new Error('โหลดสินค้าล้มเหลว: ' + productsRes.status);
      if (!mappingsRes.ok) throw new Error('โหลดการแมปล้มเหลว: ' + mappingsRes.status);

      const [productsData, mappingsData] = await Promise.all([
        productsRes.json(),
        mappingsRes.json()
      ]);
      
      setProducts(productsData);
      setMappings(mappingsData);
    } catch (error) {
      console.error('Error:', error);
      setSaveStatus({ 
        type: 'error', 
        message: error.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูล',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🎛️ โหมดจับคู่
  const togglePairMode = () => {
    if (pairMode && currentPair.length > 0) {
      const confirm = window.confirm('ต้องการบันทึกการเปลี่ยนแปลงก่อนปิดโหมดหรือไม่?');
      if (confirm) handleSaveAll();
    }
    setPairMode(!pairMode);
    setCurrentPair([]);
  };

  // 🖱️ เลือก GPIO
  const toggleMotorSelection = (motorId) => {
    if (!pairMode || mappings[motorId]) return;
    
    setCurrentPair(prev => 
      prev.includes(motorId) 
        ? prev.filter(id => id !== motorId) 
        : [...prev, motorId]
    );
  };

  // 📌 แมปเดี่ยว
  const handleSingleMapping = async (motorId, productId) => {
    try {
      const isUnmapping = productId === '';
      if (isUnmapping && !window.confirm(`ยกเลิกการแมป GPIO ${motorId} ใช่หรือไม่?`)) return;

      const res = await fetch(`${API_URL}/motor-mappings/${motorId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: productId || null })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'เกิดข้อผิดพลาด');

      setMappings(prev => ({ ...prev, [motorId]: productId || undefined }));
    } catch (error) {
      console.error('Error:', error);
      setSaveStatus({ type: 'error', message: error.message });
    }
  };

  // 🎯 แมปรวม
  const handlePairComplete = async (productId) => {
    if (!productId || currentPair.length === 0) return;

    try {
      setIsLoading(true);
      const res = await fetch(`${API_URL}/motor-mappings/bulk`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          motorIds: currentPair,
          productId: productId || null
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'เกิดข้อผิดพลาด');

      setMappings(prev => ({
        ...prev,
        ...currentPair.reduce((acc, id) => ({ ...acc, [id]: productId }), {})
      }));
      
      setSaveStatus({ 
        type: 'success', 
        message: `แมป GPIO ${currentPair.join(', ')} สำเร็จ`
      });
    } catch (error) {
      console.error('Error:', error);
      setSaveStatus({ type: 'error', message: error.message });
    } finally {
      setIsLoading(false);
      setCurrentPair([]);
      setPairMode(false);
    }
  };

  // 💾 บันทึกทั้งหมด
  const handleSaveAll = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${API_URL}/motor-mappings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mappings)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'เกิดข้อผิดพลาด');

      setSaveStatus({ 
        type: 'success', 
        message: 'บันทึกการตั้งค่าทั้งหมดเรียบร้อย'
      });
    } catch (error) {
      console.error('Error:', error);
      setSaveStatus({ type: 'error', message: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  // 🎨 สไตล์
  const styles = {
    container: { padding: '30px', maxWidth: '1000px', margin: '0 auto' },
    header: { 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      marginBottom: '20px' 
    },
    pairModeBanner: {
      backgroundColor: '#e0f2fe',
      padding: '12px',
      borderRadius: '8px',
      marginBottom: '20px',
    },
    motorGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
      gap: '12px'
    },
    motorCard: (isPaired, isMapped) => ({
      border: `2px solid ${isPaired ? '#3b82f6' : isMapped ? '#10b981' : '#e5e7eb'}`,
      borderRadius: '8px',
      padding: '12px',
      background: isPaired ? '#eff6ff' : isMapped ? '#ecfdf5' : '#f9fafb',
      cursor: pairMode && !isMapped ? 'pointer' : 'default',
      transition: 'all 0.2s',
      opacity: isMapped && !isPaired && pairMode ? 0.6 : 1,
      ':hover': pairMode && !isMapped ? { 
        transform: 'translateY(-2px)', 
        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)' 
      } : {}
    }),
    statusMessage: (type) => ({
      backgroundColor: type === 'success' ? '#dcfce7' : '#fee2e2',
      color: type === 'success' ? '#166534' : '#991b1b',
      padding: '12px',
      borderRadius: '8px',
      marginBottom: '20px',
      border: `1px solid ${type === 'success' ? '#bbf7d0' : '#fecaca'}`
    })
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>🔧 การแมป GPIO กับสินค้า</h1>
        <div>
          <button 
            onClick={togglePairMode}
            style={{ 
              backgroundColor: pairMode ? '#ef4444' : '#3b82f6',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              marginRight: '10px',
              cursor: 'pointer'
            }}
          >
            {pairMode ? 'ยกเลิกโหมดจับคู่' : 'โหมดจับคู่หลาย GPIO'}
          </button>
          <button 
            onClick={handleSaveAll} 
            disabled={isLoading}
            style={{ 
              backgroundColor: isLoading ? '#9ca3af' : '#10b981', 
              color: 'white', 
              padding: '8px 16px', 
              borderRadius: '6px', 
              border: 'none',
              fontWeight: 'bold',
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
          >
            {isLoading ? 'กำลังบันทึก...' : '💾 บันทึกการแมป'}
          </button>
        </div>
      </div>

      {/* Status Message */}
      {saveStatus && (
        <div style={styles.statusMessage(saveStatus.type)}>
          {saveStatus.message}
          <button 
            onClick={() => setSaveStatus(null)}
            style={{
              float: 'right',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'inherit'
            }}
          >
            ×
          </button>
        </div>
      )}

      {/* Pair Mode Section */}
      {pairMode && (
        <div style={styles.pairModeBanner}>
          <p style={{ margin: '0 0 8px 0', fontWeight: '500' }}>
            <strong>โหมดจับคู่หลาย GPIO:</strong> กดเลือก GPIO ที่ต้องการจับคู่ (สามารถเลือกหลายตัวได้)
          </p>
          {currentPair.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div>
                <strong>GPIO ที่เลือก:</strong> {currentPair.map(id => `GPIO ${id}`).join(', ')}
              </div>
              <select
                onChange={(e) => handlePairComplete(Number(e.target.value))}
                style={{ 
                  padding: '8px', 
                  borderRadius: '4px', 
                  border: '1px solid #93c5fd',
                  minWidth: '200px'
                }}
              >
                <option value="">-- เลือกสินค้าที่ต้องการจับคู่ --</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {/* Motor Grid */}
      <div style={styles.motorGrid}>
        {motorList.map(motorId => {
          const isPaired = currentPair.includes(motorId);
          const isMapped = mappings[motorId] !== undefined;
          const product = products.find(p => p.id === mappings[motorId]);

          return (
            <div 
              key={motorId} 
              style={styles.motorCard(isPaired, isMapped)}
              onClick={() => toggleMotorSelection(motorId)}
            >
              <div style={{ 
                fontWeight: 'bold',
                color: isPaired ? '#1d4ed8' : isMapped ? '#047857' : '#4b5563'
              }}>
                GPIO {motorId}
              </div>
              
              {!pairMode ? (
                <select
                  value={mappings[motorId] || ''}
                  onChange={(e) => handleSingleMapping(motorId, Number(e.target.value))}
                  style={{ 
                    marginTop: '10px', 
                    width: '100%',
                    padding: '6px 8px',
                    borderRadius: '4px',
                    border: '1px solid #d1d5db',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  <option value=''>-- เลือกสินค้า --</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              ) : (
                isMapped && (
                  <div style={{
                    marginTop: '10px',
                    padding: '6px',
                    backgroundColor: '#dcfce7',
                    borderRadius: '4px',
                    fontSize: '12px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {product?.name || 'Unknown'}
                  </div>
                )
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}