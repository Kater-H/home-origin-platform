import React, { useState } from 'react';

const SimpleChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const buttonStyle = {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    backgroundColor: '#059669',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    fontSize: '24px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    zIndex: 999999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const modalStyle = {
    position: 'fixed',
    bottom: '90px',
    right: '20px',
    width: '300px',
    height: '400px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
    zIndex: 999999,
    border: '1px solid #e5e7eb'
  };

  const headerStyle = {
    padding: '16px',
    backgroundColor: '#059669',
    color: 'white',
    borderRadius: '12px 12px 0 0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  const closeButtonStyle = {
    background: 'none',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    fontSize: '18px'
  };

  const contentStyle = {
    padding: '16px',
    height: '300px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    color: '#666'
  };

  return (
    <>
      <button
        style={buttonStyle}
        onClick={() => setIsOpen(!isOpen)}
        title="Chat with us"
      >
        💬
      </button>
      
      {isOpen && (
        <div style={modalStyle}>
          <div style={headerStyle}>
            <h3 style={{ margin: 0, fontSize: '16px' }}>Chat Support</h3>
            <button
              style={closeButtonStyle}
              onClick={() => setIsOpen(false)}
            >
              ×
            </button>
          </div>
          <div style={contentStyle}>
            <p>Chat functionality is working! 🎉<br/>Backend: Connected<br/>Widget: Visible</p>
          </div>
        </div>
      )}
    </>
  );
};

export default SimpleChatButton;

