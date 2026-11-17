/**
 * WebSockets in Node.js
 * 
 * To run this example, first install the standard 'ws' package:
 *   npm install ws
 * 
 * Then run:
 *   node WEB_DEV_3/Unit_4/17Nov/web_socket.js
 */

const { WebSocketServer, WebSocket } = require('ws');

const PORT = 8080;

// -------------------------------------------------------------
// 1. CREATE A WEBSOCKET SERVER
// -------------------------------------------------------------
const wss = new WebSocketServer({ port: PORT }, () => {
    console.log(`WebSocket server is listening on ws://localhost:${PORT}`);
});

// Notice how WebSocket uses the EventEmitter pattern (.on):
// 'connection' fires whenever a new client connects
wss.on('connection', (ws, req) => {
    const clientIp = req.socket.remoteAddress;
    console.log(`[Server] New client connected from ${clientIp}`);

    // Send a welcome message to the newly connected client
    ws.send(JSON.stringify({ type: 'WELCOME', message: 'Welcome to the WebSocket Server!' }));

    // Listen for incoming messages from this specific client
    ws.on('message', (data) => {
        const messageString = data.toString();
        console.log(`[Server] Received message: ${messageString}`);

        // Broadcast message to ALL connected clients (e.g. Group Chat)
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(`Broadcast: ${messageString}`);
            }
        });
    });

    // Handle client disconnect
    ws.on('close', () => {
        console.log('[Server] Client disconnected.');
    });

    // Handle errors on this connection
    ws.on('error', (err) => {
        console.error('[Server] Socket error:', err.message);
    });
});

// -------------------------------------------------------------
// 2. SIMULATED CLIENT (Connects to the server above)
// -------------------------------------------------------------
// In a real application, this part usually lives in the browser!
setTimeout(() => {
    console.log('\n--- Starting Client Connection ---');
    const client = new WebSocket(`ws://localhost:${PORT}`);

    // Client connects successfully
    client.on('open', () => {
        console.log('[Client] Connected to server.');

        // Send a message to the server
        client.send('Hello from the client!');
    });

    // Client receives message from server
    client.on('message', (data) => {
        console.log(`[Client] Message from server: ${data.toString()}`);
    });

    // Client handles connection close
    client.on('close', () => {
        console.log('[Client] Disconnected from server.');
    });
}, 1000);
