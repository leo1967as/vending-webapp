import { useState } from 'react';

// กำหนด API URL สำหรับเชื่อมต่อกับ GPIO
const API_URL = "http://localhost:3000/api";

export default function VendingMachine() {
  // รายการสินค้าในตู้ Vending Machine
  const [products, setProducts] = useState([
    { id: 1, name: 'น้ำอัดลม', price: 20, image: '/api/placeholder/150/150', quantity: 10, gpio_pin: 17 },
    { id: 2, name: 'ช็อคโกแลต', price: 15, image: '/api/placeholder/150/150', quantity: 8, gpio_pin: 18 },
    { id: 3, name: 'ขนมกรุบกรอบ', price: 25, image: '/api/placeholder/150/150', quantity: 5, gpio_pin: 22 },
    { id: 4, name: 'แซนวิช', price: 35, image: '/api/placeholder/150/150', quantity: 4, gpio_pin: 23 },
    { id: 5, name: 'น้ำแร่', price: 15, image: '/api/placeholder/150/150', quantity: 12, gpio_pin: 24 },
    { id: 6, name: 'ลูกอม', price: 10, image: '/api/placeholder/150/150', quantity: 15, gpio_pin: 25 },
    { id: 7, name: 'กาแฟกระป๋อง', price: 30, image: '/api/placeholder/150/150', quantity: 7, gpio_pin: 27 },
    { id: 8, name: 'ไอศกรีม', price: 40, image: '/api/placeholder/150/150', quantity: 3, gpio_pin: 4 },
  ]);
  
  // เงินที่ผู้ใช้ใส่เข้ามา
  const [insertedMoney, setInsertedMoney] = useState(0);
  
  // เงินทอน
  const [change, setChange] = useState(0);
  
  // สินค้าที่เลือก
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // ข้อความแจ้งเตือน
  const [message, setMessage] = useState('กรุณาเลือกสินค้าและใส่เงิน');
  
  // สถานะการทำงาน
  const [loading, setLoading] = useState(false);
  
  // เพิ่มเงินที่ใส่เข้ามา
  const insertCoin = (amount) => {
    setInsertedMoney(insertedMoney + amount);
    setMessage(`ใส่เงิน ${amount} บาท รวมเป็น ${insertedMoney + amount} บาท`);
  };
  
  // เลือกสินค้า
  const selectProduct = (product) => {
    setSelectedProduct(product);
    setMessage(`คุณเลือก ${product.name} ราคา ${product.price} บาท`);
  };
  
  // สั่งจ่ายสินค้าผ่าน GPIO API
  const dispenseProduct = async (productId) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/dispense/${productId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action: 'dispense' })
      });
      
      if (!response.ok) {
        throw new Error('การจ่ายสินค้าล้มเหลว');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการจ่ายสินค้า:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  // ซื้อสินค้า
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
    
    // เริ่มกระบวนการจ่ายสินค้า
    setMessage(`📦 กำลังจ่าย ${selectedProduct.name}...`);
    
    try {
      // จำลองการเรียกใช้ API (ในสภาพแวดล้อมจริงให้ปลดคอมเมนต์โค้ดด้านล่าง)
      // await dispenseProduct(selectedProduct.id);
      
      // จำลองการรอ API ทำงาน
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      setLoading(false);
      
      // อัปเดตจำนวนสินค้า
      const updatedProducts = products.map(p => 
        p.id === selectedProduct.id ? {...p, quantity: p.quantity - 1} : p
      );
      
      setProducts(updatedProducts);
      setChange(insertedMoney - selectedProduct.price);
      setMessage(`✅ จ่าย ${selectedProduct.name} สำเร็จ เงินทอน ${insertedMoney - selectedProduct.price} บาท`);
      setInsertedMoney(0);
      setSelectedProduct(null);
    } catch (error) {
      setMessage(`❌ เกิดข้อผิดพลาดในการจ่ายสินค้า: ${error.message}`);
    }
  };
  
  // รับเงินทอน
  const getChange = () => {
    setMessage(`คุณได้รับเงินทอน ${change} บาท`);
    setChange(0);
  };

  // สร้าง style แบบ inline
  const styles = {
    container: {
      fontFamily: 'Arial, sans-serif',
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#f0f0f0',
      borderRadius: '10px',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)'
    },
    header: {
      textAlign: 'center',
      fontSize: '28px',
      fontWeight: 'bold',
      color: '#2563eb',
      marginBottom: '20px'
    },
    messageBox: {
      padding: '15px',
      borderRadius: '8px',
      textAlign: 'center',
      marginBottom: '20px',
      backgroundColor: message.includes('❌') ? '#fee2e2' : 
                       message.includes('✅') ? '#dcfce7' : 
                       message.includes('📦') ? '#fef3c7' : '#dbeafe',
      color: '#333'
    },
    mainContent: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: '20px'
    },
    productsGrid: {
      flex: '3',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
      gap: '15px'
    },
    productCard: (isSelected, isEmpty) => ({
      backgroundColor: 'white',
      padding: '15px',
      borderRadius: '8px',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
      cursor: isEmpty ? 'not-allowed' : 'pointer',
      border: isSelected ? '3px solid #3b82f6' : '1px solid #e5e7eb',
      opacity: isEmpty ? 0.5 : 1,
      transition: 'transform 0.2s, box-shadow 0.2s',
      display: 'flex',
      flexDirection: 'column'
    }),
    productImage: {
      width: '100%',
      height: '120px',
      objectFit: 'contain',
      marginBottom: '10px'
    },
    productName: {
      fontWeight: 'bold',
      fontSize: '18px',
      margin: '5px 0'
    },
    productPrice: {
      color: '#16a34a',
      fontWeight: 'bold',
      fontSize: '16px'
    },
    productQuantity: {
      color: '#6b7280',
      fontSize: '14px',
      margin: '5px 0'
    },
    progressBar: {
      backgroundColor: '#e5e7eb',
      height: '8px',
      borderRadius: '4px',
      overflow: 'hidden',
      margin: '5px 0'
    },
    progressFill: (percentage) => ({
      backgroundColor: '#22c55e',
      height: '100%',
      width: `${percentage}%`,
      borderRadius: '4px'
    }),
    controlPanel: {
      flex: '1',
      backgroundColor: '#e5e7eb',
      padding: '15px',
      borderRadius: '8px',
      minWidth: '300px'
    },
    sectionTitle: {
      fontSize: '20px',
      fontWeight: 'bold',
      marginBottom: '10px'
    },
    coinButtons: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '10px',
      marginBottom: '20px'
    },
    coinButton: {
      backgroundColor: '#eab308',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      padding: '8px 12px',
      fontWeight: 'bold',
      cursor: 'pointer'
    },
    moneyDisplay: {
      backgroundColor: 'black',
      color: '#22c55e',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '24px',
      fontFamily: 'monospace',
      marginBottom: '15px',
      textAlign: 'center'
    },
    selectedInfo: {
      backgroundColor: '#dbeafe',
      padding: '10px',
      borderRadius: '5px',
      marginBottom: '15px'
    },
    purchaseButton: {
      backgroundColor: '#22c55e',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      padding: '12px',
      fontWeight: 'bold',
      width: '100%',
      fontSize: '16px',
      cursor: loading ? 'not-allowed' : 'pointer',
      opacity: loading ? 0.7 : 1
    },
    changeInfo: {
      marginTop: '15px',
      textAlign: 'center'
    },
    changeButton: {
      backgroundColor: '#3b82f6',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      padding: '10px',
      fontWeight: 'bold',
      width: '100%',
      cursor: 'pointer'
    },
    apiStatus: {
      marginTop: '20px',
      padding: '10px',
      backgroundColor: '#d1d5db',
      borderRadius: '5px',
      fontSize: '12px',
      color: '#4b5563'
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>ตู้ Vending Machine</h1>
      
      <div style={styles.messageBox}>
        <p style={{ fontSize: '18px', fontWeight: '500' }}>{message}</p>
      </div>
      
      <div style={styles.mainContent}>
        <div style={styles.productsGrid}>
          {products.map((product) => (
            <div 
              key={product.id} 
              style={styles.productCard(selectedProduct?.id === product.id, product.quantity <= 0)}
              onClick={() => product.quantity > 0 && !loading && selectProduct(product)}
            >
              <img 
                src={product.image} 
                alt={product.name} 
                style={styles.productImage}
              />
              <h3 style={styles.productName}>{product.name}</h3>
              <p style={styles.productPrice}>{product.price} บาท</p>
              <p style={styles.productQuantity}>เหลือ: {product.quantity} ชิ้น</p>
              <div style={styles.progressBar}>
                <div style={styles.progressFill((product.quantity / 15) * 100)}></div>
              </div>
              <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '5px' }}>GPIO Pin: {product.gpio_pin}</p>
            </div>
          ))}
        </div>
        
        <div style={styles.controlPanel}>
          <div style={{ marginBottom: '20px' }}>
            <h2 style={styles.sectionTitle}>ใส่เงิน</h2>
            <div style={styles.coinButtons}>
              {[1, 5, 10, 20, 50, 100].map((value) => (
                <button
                  key={value}
                  style={styles.coinButton}
                  onClick={() => !loading && insertCoin(value)}
                  disabled={loading}
                >
                  {value} บาท
                </button>
              ))}
            </div>
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <h2 style={styles.sectionTitle}>ยอดเงิน</h2>
            <div style={styles.moneyDisplay}>
              {insertedMoney} บาท
            </div>
            {selectedProduct && (
              <div style={styles.selectedInfo}>
                <p>สินค้าที่เลือก: {selectedProduct.name}</p>
                <p>ราคา: {selectedProduct.price} บาท</p>
                <p style={{ fontSize: '12px', color: '#6b7280' }}>GPIO Pin: {selectedProduct.gpio_pin}</p>
              </div>
            )}
          </div>
          
          <button
            style={styles.purchaseButton}
            onClick={purchaseProduct}
            disabled={loading}
          >
            {loading ? 'กำลังทำงาน...' : 'ซื้อสินค้า'}
          </button>
          
          {change > 0 && (
            <div style={styles.changeInfo}>
              <p style={{ fontSize: '18px', fontWeight: 'bold', margin: '10px 0' }}>เงินทอน: {change} บาท</p>
              <button
                style={styles.changeButton}
                onClick={getChange}
                disabled={loading}
              >
                รับเงินทอน
              </button>
            </div>
          )}
          
          <div style={styles.apiStatus}>
            <p>API: {API_URL}</p>
            <p>สถานะ: {loading ? 'กำลังทำงาน' : 'พร้อมใช้งาน'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}