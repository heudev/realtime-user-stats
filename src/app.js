require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const helmet = require('helmet');
const connectDB = require('./config/database');
const statsRoutes = require('./routes/stats');
const SocketService = require('./services/socketService');
const roomService = require('./services/roomService');

const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
    cors: {
        origin: '*',
    }
});

connectDB();

app.use(helmet());

new SocketService(io);

app.use('/stats', statsRoutes);

const PORT = process.env.PORT || 3002;
server.listen(PORT, async () => {
    await roomService.resetAllRoomUsers();
    console.log(`Server is running on port ${PORT}`);
}); 