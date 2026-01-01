const SpaceLoader = ({ isLoading = true }) => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
      opacity: isLoading ? 1 : 0,
      pointerEvents: isLoading ? 'auto' : 'none',
      transition: 'opacity 0.5s ease-out',
    }}>
      {/* Simple spinner */}
      <div style={{
        width: '60px',
        height: '60px',
        border: '4px solid rgba(100, 200, 255, 0.2)',
        borderTop: '4px solid #64c8ff',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
      }} />
      
      {/* Loading text */}
      <p style={{
        color: '#64c8ff',
        fontSize: '18px',
        marginTop: '20px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}>
        Loading...
      </p>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default SpaceLoader;
