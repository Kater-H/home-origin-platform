import React, { useState, useEffect } from 'react';

const ChatWidgetReact = ({ appType }) => {
    const CHATBOT_API_URL = 'https://vgh0i1co9gqp.manus.space/api/chat';
    const [isOpen, setIsOpen] = useState(false);
    const [isHidden, setIsHidden] = useState(localStorage.getItem('chatWidgetHidden') === 'true');
    const [messages, setMessages] = useState([
        {
            type: 'bot',
            content: `Hello! I'm your ${appType} assistant. How can I help you today?`,
            timestamp: new Date()
        }
    ]);
    const [sessionId] = useState('session_' + Math.random().toString(36).substr(2, 9));

    useEffect(() => {
        const messagesContainer = document.getElementById('messages-container');
        if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }, [messages, isOpen]);

    const sendMessage = async (message) => {
        const newUserMessage = { type: 'user', content: message, timestamp: new Date() };
        setMessages((prevMessages) => [...prevMessages, newUserMessage]);

        try {
            const response = await fetch(`${CHATBOT_API_URL}/message`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    session_id: sessionId,
                    app_type: appType
                })
            });

            if (response.ok) {
                const data = await response.json();
                setMessages((prevMessages) => [
                    ...prevMessages,
                    { type: 'bot', content: data.response || 'I apologize, but I\'m having trouble processing your request right now.', timestamp: new Date() }
                ]);
            } else {
                throw new Error('API request failed');
            }
        } catch (error) {
            console.error('Chat error:', error);
            setMessages((prevMessages) => [
                ...prevMessages,
                { type: 'bot', content: 'I\'m sorry, I\'m having trouble connecting right now. Please try again later.', timestamp: new Date() }
            ]);
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const input = e.target.elements['chat-input'];
        const message = input.value.trim();
        if (message) {
            sendMessage(message);
            input.value = '';
        }
    };

    const renderMessages = () => {
        return messages.map((message, index) => (
            <div
                key={index}
                style={{
                    marginBottom: '12px',
                    display: 'flex',
                    justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start',
                }}
            >
                <div
                    style={{
                        maxWidth: '85%',
                        padding: '10px 14px',
                        borderRadius: message.type === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                        backgroundColor: message.type === 'user' ? '#059669' : 'white',
                        color: message.type === 'user' ? 'white' : '#374151',
                        fontSize: '14px',
                        lineHeight: '1.4',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        wordWrap: 'break-word',
                    }}
                >
                    {message.content}
                </div>
            </div>
        ));
    };

    const isMobile = window.innerWidth <= 768;

    if (isHidden) {
        return (
            <div style={widgetContainerStyle}>
                <button
                    id="show-chat-btn"
                    style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: '#059669',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '16px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: 0.7,
                        transition: 'all 0.3s ease',
                    }}
                    title="Show chat"
                    onClick={() => {
                        setIsHidden(false);
                        localStorage.setItem('chatWidgetHidden', 'false');
                    }}
                >
                    💬
                </button>
            </div>
        );
    }

    if (!isOpen) {
        return (
            <div style={widgetContainerStyle}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                    <button
                        id="hide-chat-btn"
                        style={{
                            width: '30px',
                            height: '30px',
                            borderRadius: '50%',
                            backgroundColor: '#6b7280',
                            color: 'white',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '12px',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            opacity: 0.6,
                            transition: 'all 0.3s ease',
                        }}
                        title="Hide chat"
                        onClick={() => {
                            setIsHidden(true);
                            localStorage.setItem('chatWidgetHidden', 'true');
                        }}
                    >
                        ×
                    </button>

                    <button
                        id="open-chat-btn"
                        style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '50%',
                            backgroundColor: '#059669',
                            color: 'white',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '24px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.3s ease',
                            animation: 'pulse 2s infinite',
                        }}
                        title="Open chat"
                        onClick={() => setIsOpen(true)}
                    >
                        💬
                    </button>
                </div>
                <style>
                    {`
                        @keyframes pulse {
                            0% {
                                box-shadow: 0 4px 12px rgba(0,0,0,0.3), 0 0 0 0 rgba(5, 150, 105, 0.7);
                            }
                            70% {
                                box-shadow: 0 4px 12px rgba(0,0,0,0.3), 0 0 0 10px rgba(5, 150, 105, 0);
                            }
                            100% {
                                box-shadow: 0 4px 12px rgba(0,0,0,0.3), 0 0 0 0 rgba(5, 150, 105, 0);
                            }
                        }
                    `}
                </style>
            </div>
        );
    }

    return (
        <div id="chat-widget-container" style={widgetContainerStyle}>
            <div
                id="chat-window"
                style={{
                    width: isMobile ? '90vw' : '380px',
                    maxWidth: '380px',
                    height: isMobile ? '70vh' : '500px',
                    maxHeight: '500px',
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    border: '1px solid #e5e7eb',
                }}
            >
                <div
                    style={{
                        padding: '16px',
                        backgroundColor: '#059669',
                        color: 'white',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderRadius: '16px 16px 0 0',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div
                            style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                backgroundColor: '#10b981',
                            }}
                        ></div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>{appType} Assistant</h3>
                            <p style={{ margin: 0, fontSize: '12px', opacity: 0.9 }}>Online • Ready to help</p>
                        </div>
                    </div>
                    <button
                        id="close-chat-btn"
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'white',
                            cursor: 'pointer',
                            fontSize: '18px',
                            padding: '4px',
                            borderRadius: '4px',
                            opacity: 0.8,
                            transition: 'opacity 0.2s',
                        }}
                        title="Close chat"
                        onClick={() => setIsOpen(false)}
                    >
                        ×
                    </button>
                </div>

                <div
                    id="messages-container"
                    style={{
                        flex: 1,
                        padding: '16px',
                        overflowY: 'auto',
                        backgroundColor: '#f9fafb',
                        minHeight: '200px',
                    }}
                >
                    {renderMessages()}
                </div>

                <div
                    style={{
                        padding: '12px 16px',
                        borderTop: '1px solid #e5e7eb',
                        backgroundColor: 'white',
                    }}
                >
                    <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#6b7280', fontWeight: 500 }}>Quick actions:</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        <button
                            className="quick-action"
                            data-action="Track my order"
                            style={quickActionButtonStyle}
                            onClick={() => sendMessage('Track my order')}
                        >
                            Track my order
                        </button>
                        <button
                            className="quick-action"
                            data-action="Find products"
                            style={quickActionButtonStyle}
                            onClick={() => sendMessage('Find products')}
                        >
                            Find products
                        </button>
                        <button
                            className="quick-action"
                            data-action="Check delivery status"
                            style={quickActionButtonStyle}
                            onClick={() => sendMessage('Check delivery status')}
                        >
                            Check delivery status
                        </button>
                        <button
                            className="quick-action"
                            data-action="Contact support"
                            style={quickActionButtonStyle}
                            onClick={() => sendMessage('Contact support')}
                        >
                            Contact support
                        </button>
                    </div>
                </div>

                <div
                    style={{
                        padding: '16px',
                        borderTop: '1px solid #e5e7eb',
                        backgroundColor: 'white',
                        borderRadius: '0 0 16px 16px',
                    }}
                >
                    <form onSubmit={handleFormSubmit} style={{ display: 'flex', gap: '8px' }}>
                        <input
                            id="chat-input"
                            type="text"
                            placeholder="Type your message..."
                            style={{
                                flex: 1,
                                padding: '10px 14px',
                                border: '1px solid #d1d5db',
                                borderRadius: '20px',
                                outline: 'none',
                                fontSize: '14px',
                                backgroundColor: '#f9fafb',
                                transition: 'all 0.2s ease',
                            }}
                        />
                        <button
                            id="send-btn"
                            type="submit"
                            style={{
                                backgroundColor: '#059669',
                                color: 'white',
                                border: 'none',
                                padding: '10px 16px',
                                borderRadius: '20px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: 500,
                                transition: 'all 0.2s ease',
                                minWidth: '60px',
                            }}
                        >
                            Send
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

const widgetContainerStyle = {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    zIndex: 2147483647,
    fontFamily: '-apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, sans-serif',
};

const quickActionButtonStyle = {
    padding: '6px 10px',
    fontSize: '12px',
    backgroundColor: '#f3f4f6',
    color: '#374151',
    border: '1px solid #d1d5db',
    borderRadius: '16px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontWeight: 500,
};

export default ChatWidgetReact;


