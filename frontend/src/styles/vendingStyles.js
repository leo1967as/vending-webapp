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
    cursor: 'pointer'
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

export default styles;
