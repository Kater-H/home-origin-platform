// Vanilla JavaScript Chat Widget
(function() {
  'use strict';

  // Configuration
  const CHATBOT_API_URL = 'https://vgh0i1co9gqp.manus.space/api/chat';
  const sessionId = 'session_' + Math.random().toString(36).substr(2, 9);

  // State
  let isOpen = false;
  let isHidden = localStorage.getItem('chatWidgetHidden') === 'true';
  let messages = [
    {
      type: 'bot',
      content: 'Hello! I\'m your shopping assistant. How can I help you today?',
      timestamp: new Date()
    }
  ];

  // Create chat widget HTML
  function createChatWidget() {
    const widgetContainer = document.createElement('div');
    widgetContainer.id = 'chat-widget-container';
    widgetContainer.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 2147483647;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;

    updateWidgetContent();
    document.body.appendChild(widgetContainer);

    function updateWidgetContent() {
      const container = document.getElementById('chat-widget-container');
      if (!container) return;

      if (isHidden) {
        container.innerHTML = `
          <button id="show-chat-btn" style="
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background-color: #059669;
            color: white;
            border: none;
            cursor: pointer;
            font-size: 16px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0.7;
            transition: all 0.3s ease;
          " title="Show chat">💬</button>
        `;
        
        document.getElementById('show-chat-btn').addEventListener('click', function() {
          isHidden = false;
          localStorage.setItem('chatWidgetHidden', 'false');
          updateWidgetContent();
        });
        
        return;
      }

      if (!isOpen) {
        container.innerHTML = `
          <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 10px;">
            <button id="hide-chat-btn" style="
              width: 30px;
              height: 30px;
              border-radius: 50%;
              background-color: #6b7280;
              color: white;
              border: none;
              cursor: pointer;
              font-size: 12px;
              box-shadow: 0 2px 6px rgba(0,0,0,0.1);
              display: flex;
              align-items: center;
              justify-content: center;
              opacity: 0.6;
              transition: all 0.3s ease;
            " title="Hide chat">×</button>
            
            <button id="open-chat-btn" style="
              width: 60px;
              height: 60px;
              border-radius: 50%;
              background-color: #059669;
              color: white;
              border: none;
              cursor: pointer;
              font-size: 24px;
              box-shadow: 0 4px 12px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
              transition: all 0.3s ease;
              animation: pulse 2s infinite;
            " title="Open chat">💬</button>
          </div>
          
          <style>
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
          </style>
        `;

        document.getElementById('hide-chat-btn').addEventListener('click', function() {
          isHidden = true;
          localStorage.setItem('chatWidgetHidden', 'true');
          updateWidgetContent();
        });

        document.getElementById('open-chat-btn').addEventListener('click', function() {
          isOpen = true;
          updateWidgetContent();
        });

        return;
      }

      // Chat window open
      const isMobile = window.innerWidth <= 768;
      container.innerHTML = `
        <div id="chat-window" style="
          width: ${isMobile ? '90vw' : '380px'};
          max-width: 380px;
          height: ${isMobile ? '70vh' : '500px'};
          max-height: 500px;
          background-color: white;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          border: 1px solid #e5e7eb;
        ">
          <!-- Header -->
          <div style="
            padding: 16px;
            background-color: #059669;
            color: white;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-radius: 16px 16px 0 0;
          ">
            <div style="display: flex; align-items: center; gap: 8px;">
              <div style="
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background-color: #10b981;
              "></div>
              <div>
                <h3 style="margin: 0; font-size: 16px; font-weight: 600;">Shopping Assistant</h3>
                <p style="margin: 0; font-size: 12px; opacity: 0.9;">Online • Ready to help</p>
              </div>
            </div>
            <button id="close-chat-btn" style="
              background: none;
              border: none;
              color: white;
              cursor: pointer;
              font-size: 18px;
              padding: 4px;
              border-radius: 4px;
              opacity: 0.8;
              transition: opacity 0.2s;
            " title="Close chat">×</button>
          </div>

          <!-- Messages -->
          <div id="messages-container" style="
            flex: 1;
            padding: 16px;
            overflow-y: auto;
            background-color: #f9fafb;
            min-height: 200px;
          ">
            ${renderMessages()}
          </div>

          <!-- Quick Actions -->
          <div style="
            padding: 12px 16px;
            border-top: 1px solid #e5e7eb;
            background-color: white;
          ">
            <p style="margin: 0 0 8px 0; font-size: 12px; color: #6b7280; font-weight: 500;">Quick actions:</p>
            <div style="display: flex; flex-wrap: wrap; gap: 6px;">
              <button class="quick-action" data-action="Track my order" style="
                padding: 6px 10px;
                font-size: 12px;
                background-color: #f3f4f6;
                color: #374151;
                border: 1px solid #d1d5db;
                border-radius: 16px;
                cursor: pointer;
                transition: all 0.2s ease;
                font-weight: 500;
              ">Track my order</button>
              <button class="quick-action" data-action="Find products" style="
                padding: 6px 10px;
                font-size: 12px;
                background-color: #f3f4f6;
                color: #374151;
                border: 1px solid #d1d5db;
                border-radius: 16px;
                cursor: pointer;
                transition: all 0.2s ease;
                font-weight: 500;
              ">Find products</button>
              <button class="quick-action" data-action="Check delivery status" style="
                padding: 6px 10px;
                font-size: 12px;
                background-color: #f3f4f6;
                color: #374151;
                border: 1px solid #d1d5db;
                border-radius: 16px;
                cursor: pointer;
                transition: all 0.2s ease;
                font-weight: 500;
              ">Check delivery status</button>
              <button class="quick-action" data-action="Contact support" style="
                padding: 6px 10px;
                font-size: 12px;
                background-color: #f3f4f6;
                color: #374151;
                border: 1px solid #d1d5db;
                border-radius: 16px;
                cursor: pointer;
                transition: all 0.2s ease;
                font-weight: 500;
              ">Contact support</button>
            </div>
          </div>

          <!-- Input -->
          <div style="
            padding: 16px;
            border-top: 1px solid #e5e7eb;
            background-color: white;
            border-radius: 0 0 16px 16px;
          ">
            <form id="chat-form" style="display: flex; gap: 8px;">
              <input id="chat-input" type="text" placeholder="Type your message..." style="
                flex: 1;
                padding: 10px 14px;
                border: 1px solid #d1d5db;
                border-radius: 20px;
                outline: none;
                font-size: 14px;
                background-color: #f9fafb;
                transition: all 0.2s ease;
              ">
              <button id="send-btn" type="submit" style="
                background-color: #059669;
                color: white;
                border: none;
                padding: 10px 16px;
                border-radius: 20px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 500;
                transition: all 0.2s ease;
                min-width: 60px;
              ">Send</button>
            </form>
          </div>
        </div>
      `;

      // Add event listeners
      document.getElementById('close-chat-btn').addEventListener('click', function() {
        isOpen = false;
        updateWidgetContent();
      });

      document.getElementById('chat-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const input = document.getElementById('chat-input');
        const message = input.value.trim();
        if (message) {
          sendMessage(message);
          input.value = '';
        }
      });

      // Quick action buttons
      document.querySelectorAll('.quick-action').forEach(btn => {
        btn.addEventListener('click', function() {
          sendMessage(this.dataset.action);
        });
        
        btn.addEventListener('mouseenter', function() {
          this.style.backgroundColor = '#059669';
          this.style.color = 'white';
          this.style.borderColor = '#059669';
        });
        
        btn.addEventListener('mouseleave', function() {
          this.style.backgroundColor = '#f3f4f6';
          this.style.color = '#374151';
          this.style.borderColor = '#d1d5db';
        });
      });

      // Input focus/blur effects
      const chatInput = document.getElementById('chat-input');
      chatInput.addEventListener('focus', function() {
        this.style.borderColor = '#059669';
        this.style.backgroundColor = 'white';
      });
      
      chatInput.addEventListener('blur', function() {
        this.style.borderColor = '#d1d5db';
        this.style.backgroundColor = '#f9fafb';
      });
    }

    function renderMessages() {
      return messages.map(message => `
        <div style="
          margin-bottom: 12px;
          display: flex;
          justify-content: ${message.type === 'user' ? 'flex-end' : 'flex-start'};
        ">
          <div style="
            max-width: 85%;
            padding: 10px 14px;
            border-radius: ${message.type === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px'};
            background-color: ${message.type === 'user' ? '#059669' : 'white'};
            color: ${message.type === 'user' ? 'white' : '#374151'};
            font-size: 14px;
            line-height: 1.4;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            word-wrap: break-word;
          ">
            ${message.content}
          </div>
        </div>
      `).join('');
    }

    async function sendMessage(message) {
      // Add user message
      messages.push({
        type: 'user',
        content: message,
        timestamp: new Date()
      });

      // Update UI
      updateMessagesContainer();

      // Show typing indicator
      showTypingIndicator();

      try {
        const response = await fetch(`${CHATBOT_API_URL}/message`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: message,
            session_id: sessionId,
            app_type: 'buyer'
          })
        });

        if (response.ok) {
          const data = await response.json();
          messages.push({
            type: 'bot',
            content: data.response || 'I apologize, but I\'m having trouble processing your request right now.',
            timestamp: new Date()
          });
        } else {
          throw new Error('API request failed');
        }
      } catch (error) {
        console.error('Chat error:', error);
        messages.push({
          type: 'bot',
          content: 'I\'m sorry, I\'m having trouble connecting right now. Please try again later.',
          timestamp: new Date()
        });
      }

      hideTypingIndicator();
      updateMessagesContainer();
    }

    function updateMessagesContainer() {
      const container = document.getElementById('messages-container');
      if (container) {
        container.innerHTML = renderMessages();
        container.scrollTop = container.scrollHeight;
      }
    }

    function showTypingIndicator() {
      const container = document.getElementById('messages-container');
      if (container) {
        const typingDiv = document.createElement('div');
        typingDiv.id = 'typing-indicator';
        typingDiv.innerHTML = `
          <div style="
            display: flex;
            justify-content: flex-start;
            margin-bottom: 12px;
          ">
            <div style="
              padding: 10px 14px;
              border-radius: 18px 18px 18px 4px;
              background-color: white;
              color: #6b7280;
              font-size: 14px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            ">
              Typing...
            </div>
          </div>
        `;
        container.appendChild(typingDiv);
        container.scrollTop = container.scrollHeight;
      }
    }

    function hideTypingIndicator() {
      const indicator = document.getElementById('typing-indicator');
      if (indicator) {
        indicator.remove();
      }
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createChatWidget);
  } else {
    createChatWidget();
  }
})();

