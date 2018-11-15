// constants
var SECONDS_TO_MILLIS = 1000;
var MINUTES_TO_SECONDS = 60;
var MINUTES_TO_MILLIS = MINUTES_TO_SECONDS * SECONDS_TO_MILLIS;
var HOURS_TO_MINUTES = 60;
var HOURS_TO_SECONDS = HOURS_TO_MINUTES * MINUTES_TO_SECONDS;
var HOURS_TO_MILLIS = HOURS_TO_SECONDS * SECONDS_TO_MILLIS;
var DAYS_TO_HOURS = 24;
var DAYS_TO_MILLIS = DAYS_TO_HOURS * HOURS_TO_MILLIS;
var WEEK_DAYS = ['Mon', 'Tus', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
var MONTHS = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
];

/**
 * Get the date in a different time zone.
 * @param {Number} time time in millis since epoc
 * @param {Number} timezoneOffsetMillis offset from UTC+0 in millis of the timezone we wanna check.
 */
function _getDateInOtherTimezone(time, timezoneOffsetMillis) {
    var d = new Date(time);

    var utc = d.getTime() + d.getTimezoneOffset() * MINUTES_TO_MILLIS;

    var nd = new Date(utc + timezoneOffsetMillis);
    return nd;
}

/**
 * Checks if it's a leap year
 * @param {Number} year the year number
 * @returns {boolean} if it's a leap year
 */
function _isLeapYear(year) {
    if (isNaN(year)) return null;
    return year % 4 == 0 && (year % 100 != 0 || year % 400 == 0);
}

/**
 * Returns the number of days for the year: 365 for regular one, 366 for leap year
 * @param {Number} year the current year
 * @returns {Number} the number of days for current year
 */
function _getNumberOfDaysInYear(year) {
    return _isLeapYear(year) ? 366 : 365;
}

/**
 * Function that adds 0 padding to the number
 * @param {String} value the number that we need to padding
 */
function _formatTimeValue(value) {
    var out = value / 10 > 1 ? '' : '0';
    return out + value;
}

module.exports = {
    constants: {
        SECONDS_TO_MILLIS: SECONDS_TO_MILLIS,
        MINUTES_TO_SECONDS: MINUTES_TO_SECONDS,
        MINUTES_TO_MILLIS: MINUTES_TO_MILLIS,
        HOURS_TO_MINUTES: HOURS_TO_MINUTES,
        HOURS_TO_SECONDS: HOURS_TO_SECONDS,
        HOURS_TO_MILLIS: HOURS_TO_MILLIS,
        DAYS_TO_HOURS: DAYS_TO_HOURS,
        DAYS_TO_MILLIS: DAYS_TO_MILLIS,
        WEEK_DAYS: WEEK_DAYS,
        MONTHS: MONTHS
    },

    getTimeInitYear: function(year, timezoneInMillis) {
        return Date.UTC(year, 0, 1) - timezoneInMillis;
    },

    getTimeInitDay: function(year, month, day, timezoneInMillis) {
        return Date.UTC(year, month, day) - timezoneInMillis;
    },

    monthName: function(month) {
        if (month < 0 || month > 11) return '';
        return MONTHS[month];
    },

    weekDayName: function(dayOfWeek) {
        if (dayOfWeek < 0 || dayOfWeek > 6) return '';
        return WEEK_DAYS[dayOfWeek];
    },

    isLeapYear: _isLeapYear,
    numberOfDaysInYear: _getNumberOfDaysInYear,
    getDateInTimezone: _getDateInOtherTimezone,
    formatTimeValue: _formatTimeValue
};
