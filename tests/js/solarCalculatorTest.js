var sc = require('../../src/js/index');
var mc = require('../../src/js/math-constants');
var tu = require('../../src/js/time-utils');

var Location = sc.Location;
var Moment = sc.Moment;
var SolarPosition = sc.SolarPosition;

var places = [
    { name: 'LA', lat: 33.9876385, lng: -118.472396, tz: -8 },
    { name: 'Paris', lat: 48.8535541, lng: 2.3471351, tz: 1 },
    { name: 'Tokyo', lat: 35.7089895, lng: 139.7318839, tz: 9 }
];

console.log(`/// TEST ///`);

var now = Date.now();
console.log('Now:', now.toString());
for (let i = 0; i < places.length; i++) printPlace(places[i], now);

function printPlace(place, now) {
    var location = new Location(place.lat, place.lng);
    var date = new Moment(now, place.tz * tu.constants.HOURS_TO_MINUTES);

    var sp = SolarPosition(date, location);

    var { azimuth, zenith } = sp.position;
    azimuth *= mc.RADIANS_TO_DEGREES;
    zenith *= mc.RADIANS_TO_DEGREES;

    var { sunset, sunrise, solarNoon } = sp.times;

    console.log(``);
    console.log(`/// Solar Position in ${place.name} ///`);
    console.log('Current Time: ', date.toString());
    console.log('Beginning of Day:', date.getDateAtBeginningDay().toString());
    console.log('Sunrise:', sunrise.toString());
    console.log('Noon:', solarNoon.toString());
    console.log('Sunset:', sunset.toString());
    console.log('Position:', `(${azimuth}deg, ${zenith}deg)`);
    console.log('state:', sp.state);
}
