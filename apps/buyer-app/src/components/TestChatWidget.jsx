import React from 'react';

const TestChatWidget = () => {
    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 999999999,
            width: '60px',
            height: '60px',
            backgroundColor: 'red',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '24px',
            fontWeight: 'bold',
            boxShadow: '0 4px 20px rgba(255, 0, 0, 0.5)',
            cursor: 'pointer',
            border: '3px solid white'
        }}>
            TEST
        </div>
    );
};

export default TestChatWidget;

