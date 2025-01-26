const roomService = require('./roomService');

class SocketService {
    constructor(io) {
        this.io = io;
        this.setupSocketHandlers();
    }

    setupSocketHandlers() {
        this.io.on('connection', async (socket) => {
            const domain = socket.handshake.headers.origin;
            const room = await roomService.findOrCreateRoom(domain);

            room.currentUsers++;
            await roomService.updateRoomStats(room);

            socket.join(domain);
            this.broadcastTraffic(domain, room);

            socket.on('disconnect', async () => {
                room.currentUsers--;
                await room.save();
                this.broadcastTraffic(domain, room);
            });
        });
    }

    broadcastTraffic(domain, room) {
        this.io.to(domain).emit('traffic', {
            currentUsers: room.currentUsers,
            maxCurrentUsers: room.maxCurrentUsers,
            maxReachedAt: room.maxReachedAt
        });
    }
}

module.exports = SocketService; 