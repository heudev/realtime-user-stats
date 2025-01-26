const moment = require('moment-timezone');

const getCurrentTimeInTRT = () => moment().tz('Europe/Istanbul').format();

module.exports = {
    getCurrentTimeInTRT
}; 