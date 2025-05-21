// 🔧 แยกจาก VendingMachine.jsx เดิม โดย **ไม่ตัดฟีเจอร์ใด ๆ ออกเลย**
// ไฟล์หลักนี้จะเป็นตัวเรียกส่วนย่อยทั้งหมด

import React from 'react';
import ProductCard from '../components/ProductCard';
import CoinButton from '../components/CoinButton';
import MessageBox from '../components/MessageBox';
import useVendingMachine from '../hooks/useVendingMachine';
import styles from '../styles/vendingStyles';

export default function VendingMachine() {
  const {
    products, insertedMoney, change, selectedProduct,
    loading, message,
    insertCoin, selectProduct, purchaseProduct, getChange
  } = useVendingMachine();

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Vending Machine</h1>

      <MessageBox message={message} />

      <div style={styles.mainContent}>
        <div style={styles.productsGrid}>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isSelected={selectedProduct?.id === product.id}
              isEmpty={product.quantity <= 0}
              loading={loading}
              onSelect={() => !loading && product.quantity > 0 && selectProduct(product)}
            />
          ))}
        </div>

        <div style={styles.controlPanel}>
          <div style={{ marginBottom: '20px' }}>
            <h2 style={styles.sectionTitle}>ใส่เงิน</h2>
            <div style={styles.coinButtons}>
              {[1, 5, 10, 20, 50, 100].map((value) => (
                <CoinButton
                  key={value}
                  value={value}
                  disabled={loading}
                  onClick={() => insertCoin(value)}
                />
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h2 style={styles.sectionTitle}>ยอดเงิน</h2>
            <div style={styles.moneyDisplay}>{insertedMoney} บาท</div>
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
            <p>API: http://localhost:3000/api</p>
            <p>สถานะ: {loading ? 'กำลังทำงาน' : 'พร้อมใช้งาน'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
