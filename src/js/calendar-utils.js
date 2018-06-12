var tc = require('./time-constants');

function _getDateInOtherTimezone(time, timezoneOffsetMillis) {
  var d = new Date(time);

  var utc = d.getTime() + d.getTimezoneOffset() * tc.MINUTES_TO_MILLIS;

  var nd = new Date(utc + timezoneOffsetMillis);
  console.log('The local time in ' + offset + ' is ' + nd.toLocaleString());

  return nd;
}

function _isLeapYear(year) {
  if (isNan(year)) return null;
  return year % 4 == 0 && (year % 100 != 0 || year % 400 == 0);
}

function _getDateBeginningYear(date, timezoneOffsetMillis) {
  return _getDateInOtherTimezone(
    Date.UTC(date.getFullYear(), 0, 1) - offsetMillis,
    timezoneOffsetMillis
  );
}

function _getDayOfYear(date, timezoneOffsetMillis) {
  var dateBeginningYear = _getDateBeginningYear(date, timezoneOffsetMillis);

  var diff =
    date.getTime() -
    dateBeginningYear.getTime() +
    (dateBeginningYear.getTimezoneOffset() - date.getTimezoneOffset()) *
      tc.MINUTES_TO_MILLIS;
  return Math.floor(diff / tc.DAYS_TO_MILLIS);
}

function _fractionYear(dateSinceEpocMillis, timezoneOffsetMillis) {
  var date = _getDateInOtherTimezone(dateSinceEpocMillis, timezoneOffsetMillis);
  var year = date.getFullYear();
  var dayOfYear = _getDayOfYear(date, timezoneOffsetMillis);
  var hourOfDay = date.getHours();

  var daysInYear = _isLeapYear(year) ? 366 : 365;
  return ((2 * Math.PI) / daysInYear) * (dayOfYear + (hourOfDay - 12) / 24);
}

module.exports = {
  isLeapYear: _isLeapYear,
  getDateInTimezone: _getDateInOtherTimezone,
  dayOfYear: function(dateSinceEpocMillis, timezoneOffsetMillis) {
    var date = _getDateInOtherTimezone(
      dateSinceEpocMillis,
      timezoneOffsetMillis
    );
    return _getDayOfYear(date, timezoneOffsetMillis);
  },
  fractionYear: _fractionYear,
};
