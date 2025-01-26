const moment = require('moment-timezone');

moment.tz.setDefault('Europe/Istanbul');

const formatDateToTurkish = (date) => {
    return moment(date).format('DD MMMM YYYY HH:mm:ss');
};

module.exports = {
    formatDateToTurkish
};