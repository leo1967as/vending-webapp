// 📦 ProductCard.jsx — การ์ดสินค้าแยกแบบ component

export default function ProductCard({ product, isSelected, isEmpty, loading, onSelect }) {
  const styles = {
    card: {
      backgroundColor: 'white',
      padding: '15px',
      borderRadius: '8px',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
      cursor: isEmpty || loading ? 'not-allowed' : 'pointer',
      border: isSelected ? '3px solid #3b82f6' : '1px solid #e5e7eb',
      opacity: isEmpty ? 0.5 : 1,
      transition: 'transform 0.2s, box-shadow 0.2s',
      display: 'flex',
      flexDirection: 'column'
    },
    image: {
      width: '100%',
      height: '120px',
      objectFit: 'contain',
      marginBottom: '10px'
    },
    name: {
      fontWeight: 'bold',
      fontSize: '18px',
      margin: '5px 0'
    },
    price: {
      color: '#16a34a',
      fontWeight: 'bold',
      fontSize: '16px'
    },
    quantity: {
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
    progressFill: {
      backgroundColor: '#22c55e',
      height: '100%',
      width: `${(product.quantity / 15) * 100}%`,
      borderRadius: '4px'
    },
    pinText: {
      fontSize: '12px',
      color: '#9ca3af',
      marginTop: '5px'
    }
  };

  return (
    <div style={styles.card} onClick={onSelect}>
      <img src={product.image} alt={product.name} style={styles.image} />
      <h3 style={styles.name}>{product.name}</h3>
      <p style={styles.price}>{product.price} บาท</p>
      <p style={styles.quantity}>เหลือ: {product.quantity} ชิ้น</p>
      <div style={styles.progressBar}>
        <div style={styles.progressFill}></div>
      </div>
      <p style={styles.pinText}>GPIO Pin: {product.gpio_pin}</p>
    </div>
  );
}