var SolarCalculator = require('../../src/js/index');
var mc = require('../../src/js/math-constants');

let sc = new SolarCalculator();
var lat = 33.9876385;
var lng = -118.472396;
var date = new Date();
var time = date.getTime();
var timeOffset = -date.getTimezoneOffset() / 60;
sc.updateSolarPosition(time, timeOffset, lat, lng);
console.log(sc);
var { azimuth, zenith } = sc;
var sunset, sunrise, noon;
azimuth *= mc.RADIANS_TO_DEGREES;
zenith *= mc.RADIANS_TO_DEGREES;
sunrise = new Date(sc.times.sunrise);
sunset = new Date(sc.times.sunset);
noon = new Date(sc.times.noon);

console.log('/// Solar Position ///');
console.log('Position:', `(${azimuth} deg, ${zenith} deg)`);
console.log('Sunrise:', sunrise);
console.log('Sunset:', sunset);
