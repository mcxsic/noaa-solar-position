var calendarUtils = require('./calendar-utils');
var tc = require('./time-constants');
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

function _calculatePosition(
  dateSinceEpocMillis,
  timezoneOffsetHours,
  latitude,
  longitude,
  eqTime,
  solarDecl
) {
  var date = calendarUtils.getDateInTimezone(
    dateSinceEpocMillis,
    timezoneOffsetHours
  );
  var hourOfDay = date.getHours();
  var seconds = date.getSeconds();
  var minutes = date.getMinutes();
  var latRad = latitude * mc.DEGREES_TO_RADIANS;

  var timeOffset =
    eqTime + 4 * longitude - tc.HOURS_TO_MINUTES * timezoneOffsetHours; // minutes
  var trueSolarTime =
    hourOfDay * tc.HOURS_TO_MINUTES +
    minutes +
    seconds / tc.MINUTES_TO_SECONDS +
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

function _calculateSunriseSunsetNoon(
  timezoneOffsetHours,
  latitude,
  longitude,
  eqTime,
  solarDecl
) {
  var timezoneOffsetMin = timezoneOffsetHours * tc.HOURS_TO_MINUTES;
  var latRad = latitude * mc.DEGREES_TO_RADIANS;

  /* Calculate sunrise, sunset and solar noon */
  var ha1 = Math.acos(
    Math.cos(90.833 * mc.DEGREES_TO_RADIANS) /
      (Math.cos(latRad) * Math.cos(solarDecl)) -
      Math.tan(latRad) * Math.tan(solarDecl)
  ); // radians
  ha1 *= mc.RADIANS_TO_DEGREES; // degrees

  var times = { sunrise: 0, sunset: 0, solarNoon: 0 };
  times.sunrise = 720 - 4 * (longitude + ha1) - eqTime; // sunrise in minutes at UTC+0
  times.sunrise += timezoneOffsetMin; // adjust to timezone, minutes
  times.sunrise *= tc.MINUTES_TO_MILLIS; // convert to millis

  times.sunset = 720 - 4 * (longitude - ha1) - eqTime; // sunset in minutes at UTC+0
  times.sunset += timezoneOffsetMin; // adjust to timezone, minutes
  times.sunset *= tc.MINUTES_TO_MILLIS; // convert to millis

  times.solarNoon = 720 - 4 * longitude - eqTime; // solar noon in minutes at UTC+0
  times.solarNoon += timezoneOffsetMin; // adjust to timezone, minutes
  times.solarNoon *= tc.MINUTES_TO_MILLIS; // convert to millis

  return times;
}

function SolarPosition() {
  this.zenith = 0; // Radians
  this.azimuth = 0; // Radians
}

SolarPosition.prototype.updateSolarPosition = function(
  dateSinceEpocMillis,
  timezoneOffsetHours,
  latitude,
  longitude
) {
  var timezoneOffsetMillis = timezoneOffsetHours * tcHOURS_TO_MILLIS;
  var latRad = latitude * mc.DEGREES_TO_RADIANS;

  var fractionYear = calendarUtils.fractionYear(
    dateSinceEpocMillis,
    timezoneOffsetMillis
  );
  var eqTime = _equationOfTime(fractionYear);
  var solarDecl = _solarDeclinationAngle(fractionYear);

  var position = _calculatePosition(
    dateSinceEpocMillis,
    timezoneOffsetHours,
    latitude,
    longitude,
    eqTime,
    solarDecl
  );

  this.zenith = position.zenith; // Radians
  this.azimuth = position.azimuth; // Radians

  var times = _calculateSunriseSunsetNoon(
    timezoneOffsetMillis,
    latitude,
    longitude,
    eqTime,
    solarDecl
  );
};

module.exports = SolarPosition;
