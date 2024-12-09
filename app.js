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

io.on('connection', (socket) => {
    const domain = socket.handshake.headers.origin;

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

    room.currentUsers++;
    if (room.currentUsers > room.maxCurrentUsers) {
        room.maxCurrentUsers = room.currentUsers;
        room.maxReachedAt = getCurrentTimeInTRT();
    }

    socket.join(domain);

    updateUserActivity(socket);

    const broadcastTraffic = () => {
        io.to(domain).emit('traffic', {
            currentUsers: room.currentUsers,
            maxCurrentUsers: room.maxCurrentUsers,
            maxReachedAt: room.maxReachedAt
        });
    };

    broadcastTraffic();

    socket.on('activity', () => {
        updateUserActivity(socket);
    });

    socket.on('disconnect', () => {
        room.currentUsers--;
        broadcastTraffic();
    });
});

const INACTIVITY_TIMEOUT = 5 * 60 * 1000;

const updateUserActivity = (socket) => {
    socket.lastActivity = Date.now();
};

const checkInactiveUsers = () => {
    const now = Date.now();
    io.sockets.sockets.forEach((socket) => {
        if (now - socket.lastActivity > INACTIVITY_TIMEOUT) {
            socket.disconnect(true);
        }
    });
};

setInterval(checkInactiveUsers, INACTIVITY_TIMEOUT);

app.get('/stats', (req, res) => {
    res.send(roomStats);
});

server.listen(3002, () => {
    console.log('Server is running on port 3002');
});