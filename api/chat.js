// AST Origin Core Chat System
class OriginCoreChat {
    constructor() {
        this.isOnline = false;
        this.messageHistory = [];
        this.init();
    }

    init() {
        // Create chat interface if it doesn't exist
        this.createChatInterface();
        
        // Bind events
        this.bindEvents();
        
        // Add welcome message
        setTimeout(() => {
            this.addMessage("Origin Core", "AST Origin Core initialized. Type 'ast-origin-core:awaken' to activate.");
        }, 1000);
    }

    createChatInterface() {
        // Check if chat interface already exists
        if (document.getElementById('origin-core-chat')) {
            return;
        }

        // Create chat container
        const chatContainer = document.createElement('div');
        chatContainer.id = 'origin-core-chat';
        chatContainer.innerHTML = `
            <div class="oc-header">
                <h4>AST Origin Core</h4>
                <button id="oc-minimize">−</button>
            </div>
            <div id="oc-messages"></div>
            <div class="oc-input-box">
                <input id="oc-input" type="text" placeholder="Ask about AST token..." />
                <button id="oc-send">Send</button>
            </div>
        `;

        document.body.appendChild(chatContainer);
        
        // Add styles if not already present
        this.injectStyles();
    }

    injectStyles() {
        // Only add styles if they don't exist
        if (document.getElementById('origin-core-chat-styles')) {
            return;
        }

        const styles = `
            #origin-core-chat {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 320px;
                background: rgba(10, 10, 20, 0.95);
                border: 1px solid rgba(124, 42, 232, 0.5);
                padding: 0;
                border-radius: 12px;
                color: white;
                font-family: Arial, sans-serif;
                z-index: 1000;
                box-shadow: 0 5px 25px rgba(0, 0, 0, 0.5);
                backdrop-filter: blur(10px);
                overflow: hidden;
            }
            
            .oc-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 12px 15px;
                background: rgba(124, 42, 232, 0.2);
                border-bottom: 1px solid rgba(124, 42, 232, 0.3);
            }
            
            .oc-header h4 {
                margin: 0;
                font-size: 16px;
                color: #00C6FF;
            }
            
            #oc-minimize {
                background: transparent;
                border: none;
                color: white;
                cursor: pointer;
                font-size: 18px;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 4px;
            }
            
            #oc-minimize:hover {
                background: rgba(255, 255, 255, 0.1);
            }
            
            #oc-messages {
                height: 260px;
                overflow-y: auto;
                padding: 10px;
                font-size: 14px;
                line-height: 1.4;
            }
            
            #oc-messages .message {
                margin-bottom: 12px;
                padding: 8px 12px;
                border-radius: 8px;
                animation: fadeIn 0.3s ease;
            }
            
            #oc-messages .user-message {
                background: rgba(0, 198, 255, 0.15);
                margin-left: 20px;
                border-left: 2px solid #00C6FF;
            }
            
            #oc-messages .bot-message {
                background: rgba(124, 42, 232, 0.15);
                margin-right: 20px;
                border-left: 2px solid #7C2AE8;
            }
            
            .message-sender {
                font-weight: bold;
                margin-bottom: 4px;
                font-size: 12px;
                opacity: 0.8;
            }
            
            .message-content {
                word-wrap: break-word;
            }
            
            .oc-input-box {
                display: flex;
                gap: 8px;
                padding: 12px;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            #oc-input {
                flex: 1;
                padding: 8px 12px;
                border-radius: 6px;
                border: 1px solid rgba(124, 42, 232, 0.5);
                background: rgba(255, 255, 255, 0.1);
                color: white;
                outline: none;
                font-size: 14px;
            }
            
            #oc-input:focus {
                border-color: #7C2AE8;
            }
            
            #oc-send {
                padding: 8px 16px;
                border-radius: 6px;
                background: linear-gradient(90deg, #00C6FF, #7C2AE8);
                color: white;
                border: none;
                cursor: pointer;
                font-size: 14px;
                transition: opacity 0.3s;
            }
            
            #oc-send:hover {
                opacity: 0.9;
            }
            
            #oc-send:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }
            
            .typing-indicator {
                display: flex;
                align-items: center;
                gap: 4px;
                padding: 8px 12px;
                color: rgba(255, 255, 255, 0.7);
                font-style: italic;
            }
            
            .typing-dot {
                width: 6px;
                height: 6px;
                background: #7C2AE8;
                border-radius: 50%;
                animation: typingAnimation 1.4s infinite ease-in-out;
            }
            
            .typing-dot:nth-child(1) {
                animation-delay: 0s;
            }
            
            .typing-dot:nth-child(2) {
                animation-delay: 0.2s;
            }
            
            .typing-dot:nth-child(3) {
                animation-delay: 0.4s;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(5px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            @keyframes typingAnimation {
                0%, 60%, 100% { transform: scale(1); opacity: 0.5; }
                30% { transform: scale(1.2); opacity: 1; }
            }
            
            .chat-minimized #oc-messages,
            .chat-minimized .oc-input-box {
                display: none;
            }
            
            .chat-minimized {
                width: auto;
                height: auto;
            }
            
            .chat-minimized .oc-header {
                border-bottom: none;
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.id = 'origin-core-chat-styles';
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    bindEvents() {
        const sendButton = document.getElementById('oc-send');
        const inputField = document.getElementById('oc-input');
        const minimizeButton = document.getElementById('oc-minimize');

        if (sendButton) {
            sendButton.addEventListener('click', () => this.sendMessage());
        }

        if (inputField) {
            inputField.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage();
                }
            });
        }

        if (minimizeButton) {
            minimizeButton.addEventListener('click', () => this.toggleMinimize());
        }
    }

    async sendMessage() {
        const inputField = document.getElementById('oc-input');
        const sendButton = document.getElementById('oc-send');
        const message = inputField.value.trim();

        if (!message) return;

        // Clear input and disable send button temporarily
        inputField.value = '';
        sendButton.disabled = true;

        // Add user message to chat
        this.addMessage('You', message, 'user-message');

        // Check for activation command
        if (message.toLowerCase() === 'ast-origin-core:awaken') {
            this.isOnline = true;
            this.addMessage('Origin Core', 'Systems online. AST Origin Core activated. How can I assist you?', 'bot-message');
            sendButton.disabled = false;
            return;
        }

        // Show typing indicator
        this.showTypingIndicator();

        // Simulate API delay
        setTimeout(() => {
            this.hideTypingIndicator();
            
            if (!this.isOnline) {
                this.addMessage('Origin Core', 'System offline. Use "ast-origin-core:awaken" to activate.', 'bot-message');
            } else {
                // Generate response based on message content
                const response = this.generateResponse(message);
                this.addMessage('Origin Core', response, 'bot-message');
            }
            
            sendButton.disabled = false;
            inputField.focus();
        }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
    }

    generateResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // AST Token Information
        if (lowerMessage.includes('token') || lowerMessage.includes('ast')) {
            return "AST is a decentralized AI utility token designed to reward contributions to AI training and development. Total supply is 1,000,000,000 tokens.";
        }
        
        if (lowerMessage.includes('supply') || lowerMessage.includes('total')) {
            return "The total supply of AST tokens is 1,000,000,000. Initial allocation is 100% to the owner during testnet phase.";
        }
        
        if (lowerMessage.includes('network') || lowerMessage.includes('blockchain')) {
            return "AST is currently deployed on Base Sepolia testnet. Mainnet deployment is planned for Q4 2024.";
        }
        
        // Tokenomics
        if (lowerMessage.includes('tokenomics') || lowerMessage.includes('distribution')) {
            return "Token allocation: 40% AI Training Rewards, 25% Ecosystem Development, 15% Team & Advisors, 10% Community & Marketing, 10% Liquidity Pool.";
        }
        
        // Roadmap
        if (lowerMessage.includes('roadmap') || lowerMessage.includes('plan')) {
            return "Roadmap: 1) Testnet Launch 2) Website + Docs 3) AI Agent SDK 4) Training Rewards System 5) Mainnet Deployment 6) Partnerships 7) Governance";
        }
        
        // AI Training
        if (lowerMessage.includes('train') || lowerMessage.includes('ai') || lowerMessage.includes('model')) {
            return "The AST ecosystem rewards users for contributing to AI training through data provision, model validation, and computational resources.";
        }
        
        // Contact
        if (lowerMessage.includes('contact') || lowerMessage.includes('email') || lowerMessage.includes('support')) {
            return "Contact the AST team at team@ast.com. Social channels (Twitter, Discord, Telegram) are coming soon.";
        }
        
        // Greetings
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
            return "Hello! I'm AST Origin Core, your guide to the AST decentralized AI token ecosystem. How can I help you today?";
        }
        
        // Default responses
        const defaultResponses = [
            "I'm not sure I understand. Could you rephrase your question about AST token?",
            "I specialize in AST token information. Try asking about tokenomics, roadmap, or AI training rewards.",
            "For detailed information about AST, please refer to our documentation or ask me specific questions about the token.",
            "I'm here to help with AST token queries. What would you like to know about our decentralized AI ecosystem?"
        ];
        
        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }

    addMessage(sender, content, messageClass = '') {
        const messagesContainer = document.getElementById('oc-messages');
        
        const messageElement = document.createElement('div');
        messageElement.className = `message ${messageClass}`;
        
        const senderElement = document.createElement('div');
        senderElement.className = 'message-sender';
        senderElement.textContent = sender + ':';
        
        const contentElement = document.createElement('div');
        contentElement.className = 'message-content';
        contentElement.textContent = content;
        
        messageElement.appendChild(senderElement);
        messageElement.appendChild(contentElement);
        
        messagesContainer.appendChild(messageElement);
        
        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Save to history
        this.messageHistory.push({ sender, content, timestamp: new Date() });
    }

    showTypingIndicator() {
        const messagesContainer = document.getElementById('oc-messages');
        
        const typingElement = document.createElement('div');
        typingElement.id = 'typing-indicator';
        typingElement.className = 'typing-indicator';
        typingElement.innerHTML = `
            Origin Core is typing
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;
        
        messagesContainer.appendChild(typingElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    hideTypingIndicator() {
        const typingElement = document.getElementById('typing-indicator');
        if (typingElement) {
            typingElement.remove();
        }
    }

    toggleMinimize() {
        const chatContainer = document.getElementById('origin-core-chat');
        chatContainer.classList.toggle('chat-minimized');
        
        const minimizeButton = document.getElementById('oc-minimize');
        if (chatContainer.classList.contains('chat-minimized')) {
            minimizeButton.textContent = '+';
        } else {
            minimizeButton.textContent = '−';
        }
    }
}

// Initialize chat when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.originCoreChat = new OriginCoreChat();
});

// Export for module usage if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OriginCoreChat;
}