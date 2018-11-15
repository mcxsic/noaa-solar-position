var tu = require('./time-utils');

function DateObject(dateTime, timezoneOffset) {
    // Time in millis since epoc
    this.time = dateTime;
    /* In minutes, from UTC+0 */
    this.tz = timezoneOffset;
    this.tzMillis = this.tz * tu.constants.MINUTES_TO_MILLIS;

    /* Get fixed date */
    var fixedDate = tu.getDateInTimezone(this.time, this.tzMillis);

    this.year = fixedDate.getFullYear();
    /* range [0,11] */
    this.month = fixedDate.getMonth();
    /* range [1,31] */
    this.day = fixedDate.getDate();
    /* range [1,7] */
    this.dayOfWeek = fixedDate.getDay();

    // calculate day of year
    var beginningYear = tu.getTimeInitYear(this.year, this.tzMillis);
    var diff = (this.time - beginningYear) / tu.constants.DAYS_TO_MILLIS;
    /* range [0,364] for regular years, [0,365] for leap years */
    this.dayOfYear = Math.floor(diff);
    this.hour = fixedDate.getHours();
    this.minutes = fixedDate.getMinutes();
    this.seconds = fixedDate.getSeconds();
    this.millis = fixedDate.getMilliseconds();
}

DateObject.prototype.getDateAtBeginningYear = function() {
    return new DateObject(
        tu.getTimeInitYear(this.year, this.tzMillis),
        this.tz
    );
};

DateObject.prototype.getDateAtBeginningDay = function() {
    return new DateObject(
        tu.getTimeInitDay(this.year, this.month, this.day, this.tzMillis),
        this.tz
    );
};

DateObject.prototype.getFractionOfYear = function() {
    var doy = this.getDayOfYear();
    var hour = this.getHours();
    var diy = tu.numberOfDaysInYear(this.getYear());
    // FIXME: not clear that we need to substract the 12...
    return (1 / diy) * (doy + (hour - 12) / 24);
};

DateObject.prototype.getDayOfYear = function() {
    return this.dayOfYear;
};

DateObject.prototype.getYear = function() {
    return this.year;
};

DateObject.prototype.getMonth = function() {
    return this.month;
};

DateObject.prototype.getDay = function() {
    return this.day;
};

DateObject.prototype.getDayOfWeek = function() {
    return this.dayOfWeek;
};

DateObject.prototype.getHours = function() {
    return this.hour;
};

DateObject.prototype.getMinutes = function() {
    return this.minutes;
};

DateObject.prototype.getSeconds = function() {
    return this.seconds;
};

DateObject.prototype.getMilliseconds = function() {
    return this.millis;
};

DateObject.prototype.getTime = function() {
    return this.time;
};

DateObject.prototype.getTimezoneOffsetInMin = function() {
    return this.tz;
};

DateObject.prototype.getTimezoneOffsetInMillis = function() {
    return this.tzMillis;
};

DateObject.prototype.toString = function() {
    return (
        tu.weekDayName(this.getDayOfWeek() - 1) +
        ' ' +
        this.getDay() +
        ' ' +
        tu.monthName(this.getMonth()) +
        ' ' +
        this.getYear() +
        ' ' +
        this.timeToString() +
        ' ' +
        this.getTimezoneName()
    );
};

DateObject.prototype.timeToString = function() {
    return (
        tu.formatTimeValue(this.getHours()) +
        ':' +
        tu.formatTimeValue(this.getMinutes()) +
        ':' +
        tu.formatTimeValue(this.getSeconds())
    );
};

DateObject.prototype.getTimezoneName = function() {
    var hours = Math.abs(Math.floor(this.tz / 60));
    var minutes = Math.abs(this.tz % 60);
    var sign = Math.sign(this.tz);

    return (
        'GMT' +
        (sign > 0 ? '+' : '-') +
        tu.formatTimeValue(hours) +
        tu.formatTimeValue(minutes)
    );
};

module.exports = DateObject;
