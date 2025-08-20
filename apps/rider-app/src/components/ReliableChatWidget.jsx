import React, { useState, useEffect, useRef } from 'react';

const ReliableChatWidget = ({ appType = 'buyer' }) => {
    const CHATBOT_API_URL = 'https://vgh0i1co9gqp.manus.space/api/chat';
    const [isOpen, setIsOpen] = useState(false);
    const [isHidden, setIsHidden] = useState(false);
    const [messages, setMessages] = useState([
        {
            type: 'bot',
            content: `Hello! I\'m your ${appType} assistant. How can I help you today?`,
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

    useEffect(() => {
        const savedHidden = localStorage.getItem('chatWidgetHidden');
        if (savedHidden === 'true') {
            setIsHidden(true);
        }
    }, []);

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

    const toggleHidden = () => {
        const newHidden = !isHidden;
        setIsHidden(newHidden);
        localStorage.setItem('chatWidgetHidden', newHidden.toString());
        if (newHidden) {
            setIsOpen(false);
        }
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

    // Determine if it's a mobile device based on user agent or screen width
    const isMobileDevice = /Mobi|Android/i.test(navigator.userAgent) || window.innerWidth <= 768;

    // Hidden state - show small button
    if (isHidden) {
        return (
            <div style={{
                position: 'fixed',
                bottom: isMobileDevice ? '10px' : '20px',
                right: isMobileDevice ? '10px' : '20px',
                zIndex: 2147483647,
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
            }}>
                <button
                    onClick={toggleHidden}
                    style={{
                        width: isMobileDevice ? '40px' : '50px',
                        height: isMobileDevice ? '40px' : '50px',
                        borderRadius: '50%',
                        backgroundColor: appColor,
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: isMobileDevice ? '16px' : '20px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: 0.8,
                        transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => e.target.style.opacity = '1'}
                    onMouseOut={(e) => e.target.style.opacity = '0.8'}
                    title="Show chat"
                >
                    💬
                </button>
            </div>
        );
    }

    // Closed state - show main button with hide option
    if (!isOpen) {
        return (
            <div style={{
                position: 'fixed',
                bottom: isMobileDevice ? '10px' : '20px',
                right: isMobileDevice ? '10px' : '20px',
                zIndex: 2147483647,
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: '10px'
            }}>
                <button
                    onClick={toggleHidden}
                    style={{
                        width: isMobileDevice ? '28px' : '32px',
                        height: isMobileDevice ? '28px' : '32px',
                        borderRadius: '50%',
                        backgroundColor: '#6b7280',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: isMobileDevice ? '12px' : '14px',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: 0.7,
                        transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => e.target.style.opacity = '1'}
                    onMouseOut={(e) => e.target.style.opacity = '0.7'}
                    title="Hide chat"
                >
                    ×
                </button>
                
                <button
                    onClick={() => setIsOpen(true)}
                    style={{
                        width: isMobileDevice ? '50px' : '64px',
                        height: isMobileDevice ? '50px' : '64px',
                        borderRadius: '50%',
                        backgroundColor: appColor,
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: isMobileDevice ? '24px' : '28px',
                        boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.3s ease',
                        animation: 'pulse 2s infinite'
                    }}
                    title="Open chat"
                >
                    💬
                </button>
                
                <style>
                    {`
                        @keyframes pulse {
                            0% {
                                box-shadow: 0 6px 16px rgba(0,0,0,0.2), 0 0 0 0 ${appColor}80;
                            }
                            70% {
                                box-shadow: 0 6px 16px rgba(0,0,0,0.2), 0 0 0 10px ${appColor}00;
                            }
                            100% {
                                box-shadow: 0 6px 16px rgba(0,0,0,0.2), 0 0 0 0 ${appColor}00;
                            }
                        }
                    `}
                </style>
            </div>
        );
    }

    // Open state - show full chat window
    return (
        <div style={{
            position: 'fixed',
            bottom: isMobileDevice ? '10px' : '20px',
            right: isMobileDevice ? '10px' : '20px',
            zIndex: 2147483647,
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>
            <div style={{
                width: isMobileDevice ? '95vw' : '380px',
                maxWidth: '380px',
                height: isMobileDevice ? '80vh' : '500px',
                maxHeight: '500px',
                backgroundColor: 'white',
                borderRadius: '16px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                border: '1px solid #e5e7eb'
            }}>
                {/* Header */}
                <div style={{
                    padding: '16px',
                    backgroundColor: appColor,
                    color: 'white',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderRadius: '16px 16px 0 0'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: '#10b981'
                        }}></div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>
                                {appType.charAt(0).toUpperCase() + appType.slice(1)} Assistant
                            </h3>
                            <p style={{ margin: 0, fontSize: '12px', opacity: 0.9 }}>
                                Online • Ready to help
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'white',
                            cursor: 'pointer',
                            fontSize: '18px',
                            padding: '4px',
                            borderRadius: '4px',
                            opacity: 0.8,
                            transition: 'opacity 0.2s'
                        }}
                        onMouseOver={(e) => e.target.style.opacity = '1'}
                        onMouseOut={(e) => e.target.style.opacity = '0.8'}
                        title="Close chat"
                    >
                        ×
                    </button>
                </div>

                {/* Messages */}
                <div style={{
                    flex: 1,
                    padding: '16px',
                    overflowY: 'auto',
                    backgroundColor: '#f9fafb',
                    minHeight: '200px'
                }}>
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            style={{
                                marginBottom: '12px',
                                display: 'flex',
                                justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start'
                            }}
                        >
                            <div style={{
                                maxWidth: '85%',
                                padding: '10px 14px',
                                borderRadius: message.type === 'user' 
                                    ? '18px 18px 4px 18px' 
                                    : '18px 18px 18px 4px',
                                backgroundColor: message.type === 'user' ? appColor : 'white',
                                color: message.type === 'user' ? 'white' : '#374151',
                                fontSize: '14px',
                                lineHeight: '1.4',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                wordWrap: 'break-word'
                            }}>
                                {message.content}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div style={{
                            marginBottom: '12px',
                            display: 'flex',
                            justifyContent: 'flex-start'
                        }}>
                            <div style={{
                                padding: '10px 14px',
                                borderRadius: '18px 18px 18px 4px',
                                backgroundColor: 'white',
                                color: '#374151',
                                fontSize: '14px',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }}>
                                Typing...
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Quick Actions */}
                <div style={{
                    padding: '12px 16px',
                    borderTop: '1px solid #e5e7eb',
                    backgroundColor: 'white'
                }}>
                    <p style={{ 
                        margin: '0 0 8px 0', 
                        fontSize: '12px', 
                        color: '#6b7280', 
                        fontWeight: 500 
                    }}>
                        Quick actions:
                    </p>
                    <div style={{ 
                        display: 'flex', 
                        flexWrap: 'wrap', 
                        gap: '6px' 
                    }}>
                        {quickActions.map((action, index) => (
                            <button
                                key={index}
                                onClick={() => handleQuickAction(action)}
                                disabled={isLoading}
                                style={{
                                    padding: '6px 10px',
                                    fontSize: '12px',
                                    backgroundColor: '#f3f4f6',
                                    color: '#374151',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '16px',
                                    cursor: isLoading ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.2s ease',
                                    fontWeight: 500,
                                    opacity: isLoading ? 0.6 : 1
                                }}
                                onMouseOver={(e) => {
                                    if (!isLoading) {
                                        e.target.style.backgroundColor = '#e5e7eb';
                                    }
                                }}
                                onMouseOut={(e) => {
                                    if (!isLoading) {
                                        e.target.style.backgroundColor = '#f3f4f6';
                                    }
                                }}
                            >
                                {action}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Input */}
                <div style={{
                    padding: '16px',
                    borderTop: '1px solid #e5e7eb',
                    backgroundColor: 'white',
                    borderRadius: '0 0 16px 16px'
                }}>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px' }}>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Type your message..."
                            disabled={isLoading}
                            style={{
                                flex: 1,
                                padding: '10px 14px',
                                border: '1px solid #d1d5db',
                                borderRadius: '20px',
                                outline: 'none',
                                fontSize: '14px',
                                backgroundColor: isLoading ? '#f9fafb' : '#f9fafb',
                                transition: 'all 0.2s ease',
                                opacity: isLoading ? 0.6 : 1
                            }}
                            onFocus={(e) => e.target.style.borderColor = appColor}
                            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !inputValue.trim()}
                            style={{
                                backgroundColor: (isLoading || !inputValue.trim()) ? '#9ca3af' : appColor,
                                color: 'white',
                                border: 'none',
                                padding: '10px 16px',
                                borderRadius: '20px',
                                cursor: (isLoading || !inputValue.trim()) ? 'not-allowed' : 'pointer',
                                fontSize: '14px',
                                fontWeight: 500,
                                transition: 'all 0.2s ease',
                                minWidth: '60px'
                            }}
                        >
                            {isLoading ? '...' : 'Send'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ReliableChatWidget;

