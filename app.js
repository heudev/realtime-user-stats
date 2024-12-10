const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const moment = require('moment-timezone');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: '*',
    }
});

let roomStats = [];

const getCurrentTimeInTRT = () => moment().tz('Europe/Istanbul').format();

const findOrCreateRoom = (domain) => {
    let room = roomStats.find(r => r.domain === domain);
    if (!room) {
        room = {
            domain: domain,
            currentUsers: 0,
            maxCurrentUsers: 0,
            maxReachedAt: getCurrentTimeInTRT()
        };
        roomStats.push(room);
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

io.on('connection', (socket) => {
    const domain = socket.handshake.headers.origin;
    const room = findOrCreateRoom(domain);

    room.currentUsers++;
    if (room.currentUsers > room.maxCurrentUsers) {
        room.maxCurrentUsers = room.currentUsers;
        room.maxReachedAt = getCurrentTimeInTRT();
    }

    socket.join(domain);
    broadcastTraffic(domain, room);

    socket.on('disconnect', () => {
        room.currentUsers--;
        broadcastTraffic(domain, room);
    });
});

app.get('/stats', (req, res) => {
    res.send(roomStats);
});

server.listen(3002, () => {
    console.log('Server is running on port 3002');
});