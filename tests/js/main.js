var solarCalculator = require('../../src/js/index');
var mc = require('../../src/js/math-constants');
var tu = require('../../src/js/time-utils');
var LocationObject = require('../../src/js/location-object');
var DateObject = require('../../src/js/date-object');
var places = [
    { name: 'LA', lat: 33.9876385, lng: -118.472396, tz: -8 },
    { name: 'Paris', lat: 48.8535541, lng: 2.3471351, tz: 1 }
];
var selected = 0;

var location = new LocationObject(places[selected].lat, places[selected].lng);
var date = new DateObject(
    Date.now(),
    places[selected].tz * tu.constants.HOURS_TO_MINUTES
);

var sc = solarCalculator(date, location);
var { azimuth, zenith } = sc;
var sunset, sunrise, noon;
azimuth *= mc.RADIANS_TO_DEGREES;
zenith *= mc.RADIANS_TO_DEGREES;
sunrise = sc.times.sunrise;
sunset = sc.times.sunset;
var now = Date.now();
var beginningDay = Date.now();

console.log(`/// Solar Position in ${places[selected].name} ///`);
console.log('Current Time: ', date.toString());
console.log('Beginning of Day:', date.getDateAtBeginningDay().toString());
console.log('Position:', `(${azimuth} deg, ${zenith} deg)`);
console.log('Sunrise:', sunrise.toString());
console.log('Sunset:', sunset.toString());
console.log('Now:', now.toString());
