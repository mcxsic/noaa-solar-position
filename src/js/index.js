var tu = require('./time-utils');
var constants = tu.constants;
var DateObject = require('./date-object');
var mc = require('./math-constants');

function _equationOfTime(fractionalYear) {
    return (
        229.18 *
        (0.000075 +
            0.001868 * Math.cos(fractionalYear) -
            0.032077 * Math.sin(fractionalYear) -
            0.014615 * Math.cos(2 * fractionalYear) -
            0.040849 * Math.sin(2 * fractionalYear))
    ); // minutes
}

function _solarDeclinationAngle(fractionalYear) {
    return (
        0.006918 -
        0.399912 * Math.cos(fractionalYear) +
        0.070257 * Math.sin(fractionalYear) -
        0.006758 * Math.cos(2 * fractionalYear) +
        0.000907 * Math.sin(2 * fractionalYear) -
        0.002697 * Math.cos(3 * fractionalYear) +
        0.00148 * Math.sin(3 * fractionalYear)
    ); // radians
}

function _calculatePosition(date, coordinates, eqTime, solarDecl) {
    var hourOfDay = date.getHours();
    var seconds = date.getSeconds();
    var minutes = date.getMinutes();
    var latRad = coordinates.getLatitude() * mc.DEGREES_TO_RADIANS;

    var timeOffset =
        eqTime + 4 * coordinates.getLongitude() - date.getTimezoneOffsetInMin(); // minutes

    var trueSolarTime =
        hourOfDay * constants.HOURS_TO_MINUTES +
        minutes +
        seconds / constants.MINUTES_TO_SECONDS +
        timeOffset; // minutes
    var solarHourAngle = trueSolarTime / 4 - 180; // Degrees

    var acosZenith =
        Math.sin(latRad) * Math.sin(solarDecl) +
        Math.cos(latRad) *
            Math.cos(solarDecl) *
            Math.cos(solarHourAngle * mc.DEGREES_TO_RADIANS);

    var zenith = Math.acos(acosZenith); // Radians

    var acosAzimuth =
        (Math.sin(latRad) * Math.cos(zenith) - Math.sin(solarDecl)) /
        (Math.cos(latRad) * Math.sin(zenith));

    var signSolarAngle = Math.sign(solarHourAngle);
    var azimuth =
        180 * mc.DEGREES_TO_RADIANS + signSolarAngle * Math.acos(acosAzimuth); // rad

    // radiants
    return { zenith: zenith, azimuth: azimuth };
}

function _calculateSunriseSunsetNoon(date, coordinates, eqTime, solarDecl) {
    var latRad = coordinates.getLatitude() * mc.DEGREES_TO_RADIANS;
    var longitude = coordinates.getLongitude();
    var cbd = date.getDateAtBeginningDay();
    /* Calculate sunrise, sunset and solar noon */
    var ha1 = Math.acos(
        Math.cos(90.833 * mc.DEGREES_TO_RADIANS) /
            (Math.cos(latRad) * Math.cos(solarDecl)) -
            Math.tan(latRad) * Math.tan(solarDecl)
    ); // radians
    ha1 *= mc.RADIANS_TO_DEGREES; // degrees

    var times = { sunrise: 0, sunset: 0, solarNoon: 0, state: 'day' };
    times.sunrise = 720 - 4 * (longitude + ha1) - eqTime; // sunrise in minutes at UTC+0
    times.sunrise += cbd.getTimezoneOffsetInMin(); // adjust to timezone, minutes
    times.sunrise *= constants.MINUTES_TO_MILLIS; // convert to millis
    times.sunrise += cbd.getTime(); // convert to millis
    times.sunrise = new DateObject(times.sunrise, cbd.getTimezoneOffsetInMin());

    times.sunset = 720 - 4 * (longitude - ha1) - eqTime; // sunset in minutes at UTC+0
    times.sunset += cbd.getTimezoneOffsetInMin(); // adjust to timezone, minutes
    times.sunset *= constants.MINUTES_TO_MILLIS; // convert to millis
    times.sunset += cbd.getTime();
    times.sunset = new DateObject(times.sunset, cbd.getTimezoneOffsetInMin());

    times.solarNoon = 720 - 4 * longitude - eqTime; // solar noon in minutes at UTC+0
    times.solarNoon += cbd.getTimezoneOffsetInMin(); // adjust to timezone, minutes
    times.solarNoon *= constants.MINUTES_TO_MILLIS; // convert to millis
    times.solarNoon += cbd.getTime();
    times.solarNoon = new DateObject(
        times.solarNoon,
        cbd.getTimezoneOffsetInMin()
    );

    return times;
}

function _calculateState(date, coordinates, eqTime, solarDecl, times) {
    var currentTime = date.getTime();
    var sunriseTime = times.sunrise.getTime();
    var sunsetTime = times.sunset.getTime();
    var state = { state: 'day', progress: 0 };
    state.state =
        currentTime >= sunriseTime && currentTime < sunsetTime
            ? 'day'
            : 'night';

    var start = sunriseTime;
    var end = sunsetTime;
    if (state.state == 'night') {
        if (currentTime < sunriseTime) {
            var prevDate = new DateObject(
                date.getTime() - constants.DAYS_TO_MILLIS,
                date.getTimezoneOffsetInMin()
            ); // move a day
            var timesPrev = _calculateSunriseSunsetNoon(
                prevDate,
                coordinates,
                eqTime,
                solarDecl
            );
            start = timesPrev.sunset.getTime();
            end = sunriseTime;
        } else {
            var nextDate = new DateObject(
                date.getTime() + constants.DAYS_TO_MILLIS,
                date.getTimezoneOffsetInMin()
            ); // move a day
            var timesNext = _calculateSunriseSunsetNoon(
                nextDate,
                coordinates,
                eqTime,
                solarDecl
            );
            start = sunsetTime;
            end = timesNext.sunrise.getTime();
        }
    }

    state.progress = (currentTime - start) / (end - start);

    return state;
}
/**
 * Calculates Solar Position
 * @param {DateObject} date dateobject
 * @param {LocationObject} coordinates a location object
 */
function SolarPosition(date, coordinates) {
    //TODO: check that both objects are right

    // Fractional year
    var fractionalYear = date.getFractionalYear() * 2 * Math.PI; // transform from [0,1] to [0, 2 * PI]

    // Equation of time, solar declination
    var eqTime = _equationOfTime(fractionalYear);
    var solarDecl = _solarDeclinationAngle(fractionalYear);

    var position = _calculatePosition(date, coordinates, eqTime, solarDecl);
    var times = _calculateSunriseSunsetNoon(
        date,
        coordinates,
        eqTime,
        solarDecl
    );

    var state = _calculateState(date, coordinates, eqTime, solarDecl, times);

    return {
        times: times,
        position: position,
        state: state
    };
}

module.exports = SolarPosition;
