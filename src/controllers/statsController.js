const roomService = require('../services/roomService');
const { formatDateToTurkish } = require('../utils/timeUtils');

class StatsController {
    async getStats(req, res) {
        try {
            const stats = await roomService.getAllRooms();
            const formattedStats = stats.map(room => ({
                ...room.toObject(),
                maxReachedAt: formatDateToTurkish(room.maxReachedAt),
                createdAt: formatDateToTurkish(room.createdAt),
                updatedAt: formatDateToTurkish(room.updatedAt)
            }));
            res.json(formattedStats);
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while fetching statistics' });
        }
    }
}

module.exports = new StatsController(); 