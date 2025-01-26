const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    domain: {
        type: String,
        unique: true,
        required: true
    },
    currentUsers: {
        type: Number,
        default: 0
    },
    maxCurrentUsers: {
        type: Number,
        default: 0
    },
    maxReachedAt: {
        type: Date
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('Room', roomSchema); 