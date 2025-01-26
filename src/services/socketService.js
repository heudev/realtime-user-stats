const roomService = require('./roomService');
class SocketService {
    constructor(io) {
        this.io = io;
        this.connectedSockets = new Map();
        this.setupSocketHandlers();
    }

    setupSocketHandlers() {
        this.io.on('connection', async (socket) => {
            const domain = socket.handshake.headers.origin;

            if (!this.connectedSockets.has(domain)) {
                this.connectedSockets.set(domain, new Set());
            }
            this.connectedSockets.get(domain).add(socket.id);

            let room = await roomService.findOrCreateRoom(domain);
            room.currentUsers = this.connectedSockets.get(domain).size;
            await roomService.updateRoomStats(room);

            socket.join(domain);
            this.broadcastTraffic(domain, room);

            socket.on('disconnect', async () => {
                if (this.connectedSockets.has(domain)) {
                    this.connectedSockets.get(domain).delete(socket.id);
                    if (this.connectedSockets.get(domain).size === 0) {
                        this.connectedSockets.delete(domain);
                    }
                }

                room = await roomService.findOrCreateRoom(domain);
                room.currentUsers = this.connectedSockets.has(domain) ?
                    this.connectedSockets.get(domain).size : 0;
                await roomService.updateRoomStats(room);
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