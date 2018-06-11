var calendarUtils = require('./calendar-utils');
const { DateTime } = require('luxon');

module.exports = function() {
  console.log(
    DateTime.local()
      .setZone('America/New_York')
      //   .minus({ weeks: 1 })
      .startOf('day')
      .toISO()
  );
};
