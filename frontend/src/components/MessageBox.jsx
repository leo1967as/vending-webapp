export default function MessageBox({ message }) {
  let bgColor = '#dbeafe';
  if (message.includes('✅')) bgColor = '#dcfce7';
  else if (message.includes('❌')) bgColor = '#fee2e2';
  else if (message.includes('📦')) bgColor = '#fef3c7';

  return (
    <div style={{
      padding: '15px',
      borderRadius: '8px',
      textAlign: 'center',
      marginBottom: '20px',
      backgroundColor: bgColor,
      color: '#333'
    }}>
      <p style={{ fontSize: '18px', fontWeight: '500' }}>{message}</p>
    </div>
  );
}
