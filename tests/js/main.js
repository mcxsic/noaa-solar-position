var SolarCalculator = require('../../src/js/index');
var mc = require('../../src/js/math-constants');
var cu = require('../../src/js/calendar-utils');

let sc = new SolarCalculator();
var lat = 33.9876385;
var lng = -118.472396;
var date = new Date();
var time = date.getTime();
var timeOffset = -8;
sc.updateSolarPosition(time, timeOffset, lat, lng);
console.log(sc);
var { azimuth, zenith } = sc;
var sunset, sunrise, noon;
azimuth *= mc.RADIANS_TO_DEGREES;
zenith *= mc.RADIANS_TO_DEGREES;
sunrise = cu.getDateInTimezone(sc.times.sunrise, 3600000);
sunset = cu.getDateInTimezone(sc.times.sunset, 3600000);
var now = cu.getDateInTimezone(Date.now(), timeOffset * 3600000);
var beginningDay = cu.getBeginningDay(Date.now(), timeOffset * 3600000);

console.log('/// Solar Position ///');
console.log('Position:', `(${azimuth} deg, ${zenith} deg)`);
console.log('Sunrise:', sunrise);
console.log('Sunset:', sunset);
console.log('Now:', now);
