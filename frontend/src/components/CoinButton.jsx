export default function CoinButton({ value, onClick, disabled }) {
  return (
    <button
      style={{
        backgroundColor: '#eab308',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        padding: '8px 12px',
        fontWeight: 'bold',
        cursor: disabled ? 'not-allowed' : 'pointer'
      }}
      onClick={onClick}
      disabled={disabled}
    >
      {value} บาท
    </button>
  );
}
