const roomService = require('../services/roomService');

class StatsController {
    async getStats(req, res) {
        try {
            const stats = await roomService.getAllRooms();
            res.json(stats);
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while fetching statistics' });
        }
    }
}

module.exports = new StatsController(); 