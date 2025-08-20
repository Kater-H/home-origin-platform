import React, { useState, useEffect, useRef } from 'react';

const InlineChatWidget = ({ appType = 'buyer' }) => {
    const CHATBOT_API_URL = 'https://vgh0i1co9gqp.manus.space/api/chat';
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            type: 'bot',
            content: `Hello! I'm your ${appType} assistant. How can I help you today?`,
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId] = useState('session_' + Math.random().toString(36).substr(2, 9));
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async (message) => {
        if (!message.trim()) return;

        const newUserMessage = { 
            type: 'user', 
            content: message, 
            timestamp: new Date() 
        };
        
        setMessages(prev => [...prev, newUserMessage]);
        setInputValue('');
        setIsLoading(true);

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
                setMessages(prev => [...prev, {
                    type: 'bot',
                    content: data.response || 'I apologize, but I\'m having trouble processing your request right now.',
                    timestamp: new Date()
                }]);
            } else {
                throw new Error('API request failed');
            }
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, {
                type: 'bot',
                content: 'I\'m sorry, I\'m having trouble connecting right now. Please try again later.',
                timestamp: new Date()
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        sendMessage(inputValue);
    };

    const handleQuickAction = (action) => {
        sendMessage(action);
    };

    const getAppColor = () => {
        switch (appType) {
            case 'buyer': return '#059669';
            case 'vendor': return '#059669';
            case 'admin': return '#7c3aed';
            case 'rider': return '#ea580c';
            default: return '#059669';
        }
    };

    const getQuickActions = () => {
        switch (appType) {
            case 'buyer':
                return ['Track my order', 'Find products', 'Check delivery status', 'Contact support'];
            case 'vendor':
                return ['Check orders', 'Manage inventory', 'View analytics', 'Contact support'];
            case 'admin':
                return ['System status', 'User reports', 'Platform analytics', 'Technical support'];
            case 'rider':
                return ['Available orders', 'Earnings summary', 'Route optimization', 'Contact support'];
            default:
                return ['Help', 'Support', 'Information', 'Contact'];
        }
    };

    const appColor = getAppColor();
    const quickActions = getQuickActions();

    // Collapsed state - show expandable section
    if (!isOpen) {
        return (
            <div style={{
                margin: '20px auto',
                maxWidth: '800px',
                padding: '0 20px',
                fontFamily: 'system-ui, -apple-system, sans-serif'
            }}>
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    border: '1px solid #e5e7eb',
                    overflow: 'hidden'
                }}>
                    <button
                        onClick={() => setIsOpen(true)}
                        style={{
                            width: '100%',
                            padding: '20px',
                            backgroundColor: appColor,
                            color: 'white',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            outline: 'none',
                            WebkitAppearance: 'none',
                            MozAppearance: 'none',
                            appearance: 'none'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                backgroundColor: 'rgba(255,255,255,0.2)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '20px'
                            }}>
                                💬
                            </div>
                            <div style={{ textAlign: 'left' }}>
                                <div style={{ fontSize: '18px', fontWeight: 600 }}>
                                    {appType.charAt(0).toUpperCase() + appType.slice(1)} Assistant
                                </div>
                                <div style={{ fontSize: '14px', opacity: 0.9 }}>
                                    Click to start chatting • AI-powered support
                                </div>
                            </div>
                        </div>
                        <div style={{
                            fontSize: '24px',
                            transform: 'rotate(0deg)',
                            transition: 'transform 0.3s ease'
                        }}>
                            ▼
                        </div>
                    </button>
                </div>
            </div>
        );
    }

    // Expanded state - show full chat interface
    return (
        <div style={{
            margin: '20px auto',
            maxWidth: '800px',
            padding: '0 20px',
            fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
            <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                border: '1px solid #e5e7eb',
                overflow: 'hidden'
            }}>
                {/* Header */}
                <div style={{
                    padding: '20px',
                    backgroundColor: appColor,
                    color: 'white',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '20px'
                        }}>
                            💬
                        </div>
                        <div>
                            <div style={{ fontSize: '18px', fontWeight: 600 }}>
                                {appType.charAt(0).toUpperCase() + appType.slice(1)} Assistant
                            </div>
                            <div style={{ fontSize: '14px', opacity: 0.9, display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <div style={{
                                    width: '8px',
                                    height: '8px',
                                    borderRadius: '50%',
                                    backgroundColor: '#10b981'
                                }}></div>
                                Online • Ready to help
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'white',
                            cursor: 'pointer',
                            fontSize: '24px',
                            padding: '4px',
                            borderRadius: '4px',
                            opacity: 0.9,
                            transition: 'opacity 0.2s',
                            outline: 'none',
                            WebkitAppearance: 'none',
                            MozAppearance: 'none',
                            appearance: 'none'
                        }}
                        title="Minimize chat"
                    >
                        ▲
                    </button>
                </div>

                {/* Quick Actions */}
                <div style={{
                    padding: '16px 20px',
                    borderBottom: '1px solid #e5e7eb',
                    backgroundColor: '#f9fafb'
                }}>
                    <p style={{ 
                        margin: '0 0 12px 0', 
                        fontSize: '14px', 
                        color: '#6b7280', 
                        fontWeight: 500 
                    }}>
                        Quick actions:
                    </p>
                    <div style={{ 
                        display: 'flex', 
                        flexWrap: 'wrap', 
                        gap: '8px' 
                    }}>
                        {quickActions.map((action, index) => (
                            <button
                                key={index}
                                onClick={() => handleQuickAction(action)}
                                disabled={isLoading}
                                style={{
                                    padding: '8px 14px',
                                    fontSize: '14px',
                                    backgroundColor: 'white',
                                    color: '#374151',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '20px',
                                    cursor: isLoading ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.2s ease',
                                    fontWeight: 500,
                                    opacity: isLoading ? 0.6 : 1,
                                    outline: 'none',
                                    WebkitAppearance: 'none',
                                    MozAppearance: 'none',
                                    appearance: 'none'
                                }}
                                onMouseOver={(e) => {
                                    if (!isLoading) {
                                        e.target.style.backgroundColor = appColor;
                                        e.target.style.color = 'white';
                                        e.target.style.borderColor = appColor;
                                    }
                                }}
                                onMouseOut={(e) => {
                                    if (!isLoading) {
                                        e.target.style.backgroundColor = 'white';
                                        e.target.style.color = '#374151';
                                        e.target.style.borderColor = '#d1d5db';
                                    }
                                }}
                            >
                                {action}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Messages */}
                <div style={{
                    height: '400px',
                    padding: '20px',
                    overflowY: 'auto',
                    backgroundColor: '#f9fafb',
                    WebkitOverflowScrolling: 'touch'
                }}>
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            style={{
                                marginBottom: '16px',
                                display: 'flex',
                                justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start'
                            }}
                        >
                            <div style={{
                                maxWidth: '70%',
                                padding: '12px 16px',
                                borderRadius: message.type === 'user' 
                                    ? '20px 20px 4px 20px' 
                                    : '20px 20px 20px 4px',
                                backgroundColor: message.type === 'user' ? appColor : 'white',
                                color: message.type === 'user' ? 'white' : '#374151',
                                fontSize: '15px',
                                lineHeight: '1.5',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                wordWrap: 'break-word',
                                wordBreak: 'break-word'
                            }}>
                                {message.content}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div style={{
                            marginBottom: '16px',
                            display: 'flex',
                            justifyContent: 'flex-start'
                        }}>
                            <div style={{
                                padding: '12px 16px',
                                borderRadius: '20px 20px 20px 4px',
                                backgroundColor: 'white',
                                color: '#374151',
                                fontSize: '15px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                <div style={{
                                    width: '8px',
                                    height: '8px',
                                    borderRadius: '50%',
                                    backgroundColor: '#6b7280',
                                    animation: 'pulse 1.5s ease-in-out infinite'
                                }}></div>
                                <div style={{
                                    width: '8px',
                                    height: '8px',
                                    borderRadius: '50%',
                                    backgroundColor: '#6b7280',
                                    animation: 'pulse 1.5s ease-in-out infinite 0.2s'
                                }}></div>
                                <div style={{
                                    width: '8px',
                                    height: '8px',
                                    borderRadius: '50%',
                                    backgroundColor: '#6b7280',
                                    animation: 'pulse 1.5s ease-in-out infinite 0.4s'
                                }}></div>
                                <span style={{ marginLeft: '8px' }}>Typing...</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form onSubmit={handleSubmit} style={{
                    padding: '20px',
                    borderTop: '1px solid #e5e7eb',
                    backgroundColor: 'white'
                }}>
                    <div style={{
                        display: 'flex',
                        gap: '12px',
                        alignItems: 'flex-end'
                    }}>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Type your message..."
                            disabled={isLoading}
                            style={{
                                flex: 1,
                                padding: '12px 16px',
                                border: '1px solid #d1d5db',
                                borderRadius: '24px',
                                fontSize: '15px',
                                outline: 'none',
                                resize: 'none',
                                backgroundColor: isLoading ? '#f9fafb' : 'white',
                                color: '#374151',
                                WebkitAppearance: 'none',
                                MozAppearance: 'none',
                                appearance: 'none'
                            }}
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !inputValue.trim()}
                            style={{
                                padding: '12px 20px',
                                backgroundColor: appColor,
                                color: 'white',
                                border: 'none',
                                borderRadius: '24px',
                                cursor: (isLoading || !inputValue.trim()) ? 'not-allowed' : 'pointer',
                                fontSize: '15px',
                                fontWeight: 600,
                                opacity: (isLoading || !inputValue.trim()) ? 0.6 : 1,
                                transition: 'all 0.2s ease',
                                outline: 'none',
                                WebkitAppearance: 'none',
                                MozAppearance: 'none',
                                appearance: 'none'
                            }}
                        >
                            Send
                        </button>
                    </div>
                </form>

                <style>
                    {`
                        @keyframes pulse {
                            0%, 100% {
                                opacity: 0.4;
                            }
                            50% {
                                opacity: 1;
                            }
                        }
                    `}
                </style>
            </div>
        </div>
    );
};

export default InlineChatWidget;

