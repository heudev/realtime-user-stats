const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const connectDB = require('./config/database');
const statsRoutes = require('./routes/stats');
const SocketService = require('./services/socketService');

// Create Express application
const app = express();
const server = http.createServer(app);

// Setup Socket.io
const io = socketIo(server, {
    cors: {
        origin: '*',
    }
});

// Connect to MongoDB
connectDB();

// Initialize Socket service
new SocketService(io);

// Routes
app.use('/stats', statsRoutes);

// Start server
const PORT = process.env.PORT || 3002;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 