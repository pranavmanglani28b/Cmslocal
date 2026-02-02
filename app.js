// Initialize Gun.js
// We use a public relay peer so users on different networks can find each other.
const gun = Gun([
    'https://gun-manhattan.herokuapp.com/gun'
]);

const chatNode = gun.get('persistent-chat-room-v1');

const form = document.getElementById('chat-form');
const input = document.getElementById('msg-input');
const userField = document.getElementById('username');
const messageList = document.getElementById('messages');

// 1. Send Message
form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const user = userField.value || 'Anonymous';
    const message = input.value;

    if (message.trim()) {
        // Create a unique key for the message based on timestamp
        const timestamp = Date.now();
        chatNode.get(timestamp).put({
            name: user,
            text: message,
            time: timestamp
        });

        input.value = ''; // Clear input
    }
});

// 2. Listen for Messages (Real-time & Persistent)
// Gun's .map() automatically fetches existing data and listens for new data.
chatNode.map().on((data, id) => {
    if (data && data.text) {
        // Check if message already exists in UI to prevent duplicates
        if (!document.getElementById(id)) {
            const li = document.createElement('li');
            li.id = id;
            li.className = 'msg-item';
            li.innerHTML = `
                <span class="msg-user">${data.name}</span>
                ${data.text}
            `;
            messageList.appendChild(li);
            
            // Auto-scroll to bottom
            messageList.scrollTop = messageList.scrollHeight;
        }
    }
});
