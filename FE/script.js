let socket = null;
let serverUrl = 'http://localhost:3000';

function updateServerUrl() {
    const urlInput = document.getElementById('serverUrl');
    const newUrl = urlInput.value.trim();
    
    if (newUrl) {
        serverUrl = newUrl;
        addMessage(`Server URL updated to: ${serverUrl}`, 'system');
        document.getElementById('currentServerUrl').textContent = serverUrl;
        
        // Disconnect if already connected
        if (socket && socket.connected) {
            disconnectFromServer();
        }
    }
}

function connectToServer() {
    if (socket && socket.connected) {
        addMessage('Already connected to server', 'system');
        return;
    }
    
    try {
        // Connect to the specified server URL
        socket = io(serverUrl, {
            transports: ['websocket', 'polling']
        });
        
        // Update UI
        updateConnectionStatus(false);
        document.getElementById('currentServerUrl').textContent = serverUrl;
        
        // Socket event listeners
        socket.on('connect', () => {
            console.log('Connected to server with ID:', socket.id);
            addMessage(`Connected to server: ${serverUrl}`, 'system');
            updateConnectionStatus(true);
            document.getElementById('socketId').textContent = socket.id;
        });
        
        socket.on('disconnect', (reason) => {
            console.log('Disconnected from server:', reason);
            addMessage(`Disconnected: ${reason}`, 'system');
            updateConnectionStatus(false);
        });
        
        socket.on('welcome', (data) => {
            console.log('Welcome message:', data);
            addMessage(`Server: ${data.message} (${new Date(data.serverTime).toLocaleTimeString()})`, 'incoming');
        });
        
        socket.on('newChatMessage', (data) => {
            addMessage(`Chat from ${data.sender}: ${data.message}`, 'incoming');
        });
        
        socket.on('connect_error', (error) => {
            console.error('Connection error:', error);
            addMessage(`Connection failed: ${error.message}`, 'system');
            updateConnectionStatus(false);
        });
        
    } catch (error) {
        console.error('Failed to connect:', error);
        addMessage(`Connection error: ${error.message}`, 'system');
    }
}

function sendMessage() {
    if (!socket || !socket.connected) {
        addMessage('Not connected to server!', 'system');
        return;
    }
    
    const messageData = {
        message: 'Hello from frontend client!',
        timestamp: new Date().toISOString(),
        client: 'Web Frontend'
    };
    
    // Send message to server
    socket.emit('sayHi', messageData, (response) => {
        console.log('Server response:', response);
        addMessage(`Server response: ${response}`, 'incoming');
    });
    
    addMessage(`Sent to server: ${messageData.message}`, 'outgoing');
}

function disconnectFromServer() {
    if (socket) {
        socket.disconnect();
        socket = null;
        updateConnectionStatus(false);
        document.getElementById('socketId').textContent = 'Not connected';
        addMessage('Disconnected from server', 'system');
    }
}

function updateConnectionStatus(connected) {
    const statusElement = document.getElementById('connectionStatus');
    const connectBtn = document.getElementById('connectBtn');
    const sendBtn = document.getElementById('sendBtn');
    const disconnectBtn = document.getElementById('disconnectBtn');
    
    if (connected) {
        statusElement.textContent = 'Connected';
        statusElement.className = 'status-connected';
        connectBtn.disabled = true;
        sendBtn.disabled = false;
        disconnectBtn.disabled = false;
    } else {
        statusElement.textContent = 'Disconnected';
        statusElement.className = 'status-disconnected';
        connectBtn.disabled = false;
        sendBtn.disabled = true;
        disconnectBtn.disabled = true;
    }
}

function addMessage(text, type) {
    const messageLog = document.getElementById('messageLog');
    const messageElement = document.createElement('div');
    messageElement.className = `message ${type}`;
    messageElement.textContent = `[${new Date().toLocaleTimeString()}] ${text}`;
    messageLog.appendChild(messageElement);
    messageLog.scrollTop = messageLog.scrollHeight;
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('currentServerUrl').textContent = 'Not connected';
});