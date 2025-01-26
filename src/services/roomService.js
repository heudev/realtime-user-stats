const Room = require('../models/Room');

class RoomService {
    async findOrCreateRoom(domain) {
        let room = await Room.findOne({ domain });
        if (!room) {
            room = new Room({
                domain,
                currentUsers: 0,
                maxCurrentUsers: 0,
                maxReachedAt: new Date()
            });
            await room.save();
        }
        return room;
    }

    async updateRoomStats(room) {
        if (room.currentUsers > room.maxCurrentUsers) {
            room.maxCurrentUsers = room.currentUsers;
            room.maxReachedAt = new Date();
        }
        return room.save();
    }

    async getAllRooms() {
        return Room.find();
    }

    async resetAllRoomUsers() {
        await Room.updateMany({}, { $set: { currentUsers: 0 } });
    }
}

module.exports = new RoomService(); 