const Room = require('../models/Room');
const { getCurrentTimeInTRT } = require('../utils/timeUtils');

class RoomService {
    async findOrCreateRoom(domain) {
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
    }

    async updateRoomStats(room) {
        if (room.currentUsers > room.maxCurrentUsers) {
            room.maxCurrentUsers = room.currentUsers;
            room.maxReachedAt = getCurrentTimeInTRT();
        }
        return room.save();
    }

    async getAllRooms() {
        return Room.find();
    }
}

module.exports = new RoomService(); 