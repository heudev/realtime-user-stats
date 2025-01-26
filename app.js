const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const moment = require('moment-timezone');
const mongoose = require('mongoose');

// MongoDB bağlantısı
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/realtime-stats';
mongoose.connect(MONGODB_URI)
    .then(() => console.log('MongoDB\'ye başarıyla bağlandı'))
    .catch(err => console.error('MongoDB bağlantı hatası:', err));

// Room şeması
const roomSchema = new mongoose.Schema({
    domain: { type: String, unique: true },
    currentUsers: { type: Number, default: 0 },
    maxCurrentUsers: { type: Number, default: 0 },
    maxReachedAt: { type: Date }
});

const Room = mongoose.model('Room', roomSchema);

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: '*',
    }
});

const getCurrentTimeInTRT = () => moment().tz('Europe/Istanbul').format();

const findOrCreateRoom = async (domain) => {
    let room = await Room.findOne({ domain });
    if (!room) {
        room = new Room({
            domain,
            currentUsers: 0,
            maxCurrentUsers: 0,
            maxReachedAt: getCurrentTimeInTRT()
        });
        await room.save();
    }
    return room;
};

const broadcastTraffic = (domain, room) => {
    io.to(domain).emit('traffic', {
        currentUsers: room.currentUsers,
        maxCurrentUsers: room.maxCurrentUsers,
        maxReachedAt: room.maxReachedAt
    });
};

io.on('connection', async (socket) => {
    const domain = socket.handshake.headers.origin;
    const room = await findOrCreateRoom(domain);

    room.currentUsers++;
    if (room.currentUsers > room.maxCurrentUsers) {
        room.maxCurrentUsers = room.currentUsers;
        room.maxReachedAt = getCurrentTimeInTRT();
    }
    await room.save();

    socket.join(domain);
    broadcastTraffic(domain, room);

    socket.on('disconnect', async () => {
        room.currentUsers--;
        await room.save();
        broadcastTraffic(domain, room);
    });
});

app.get('/stats', async (req, res) => {
    const stats = await Room.find();
    res.send(stats);
});

server.listen(3002, () => {
    console.log('Server is running on port 3002');
});