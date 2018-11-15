var tu = require('./time-utils');
var constants = tu.constants;
var DateObject = require('./date-object');
var mc = require('./math-constants');

function _equationOfTime(fractionYear) {
    return (
        229.18 *
        (0.000075 +
            0.001868 * Math.cos(fractionYear) -
            0.032077 * Math.sin(fractionYear) -
            0.014615 * Math.cos(2 * fractionYear) -
            0.040849 * Math.sin(2 * fractionYear))
    ); // minutes
}

function _solarDeclinationAngle(fractionYear) {
    return (
        0.006918 -
        0.399912 * Math.cos(fractionYear) +
        0.070257 * Math.sin(fractionYear) -
        0.006758 * Math.cos(2 * fractionYear) +
        0.000907 * Math.sin(2 * fractionYear) -
        0.002697 * Math.cos(3 * fractionYear) +
        0.00148 * Math.sin(3 * fractionYear)
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

    var times = { sunrise: 0, sunset: 0, solarNoon: 0 };
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
    // times.solarNoon += cbd.getTimezoneOffsetInMin(); // adjust to timezone, minutes
    times.solarNoon *= constants.MINUTES_TO_MILLIS; // convert to millis
    times.solarNoon += cbd.getTime();
    times.solarNoon = new DateObject(
        times.solarNoon,
        cbd.getTimezoneOffsetInMin()
    );

    return times;
}

/**
 * Calculates Solar Position
 * @param {DateObject} date dateobject
 * @param {LocationObject} coordinates a location object
 */
function SolarPosition(date, coordinates) {
    //TODO: check that both objects are right

    // Fractional year
    var fractionYear = date.getFractionOfYear() * 2 * Math.PI; // transform from [0,1] to [0, 2 * PI]

    // Equation of time, // solar declination
    var eqTime = _equationOfTime(fractionYear);
    var solarDecl = _solarDeclinationAngle(fractionYear);

    var position = _calculatePosition(date, coordinates, eqTime, solarDecl);
    var times = _calculateSunriseSunsetNoon(
        date,
        coordinates,
        eqTime,
        solarDecl
    );

    return { times: times, zenith: position.zenith, azimuth: position.azimuth }; // Rad // Rad
}

module.exports = SolarPosition;
