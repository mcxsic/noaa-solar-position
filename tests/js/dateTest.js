DateObject = require('../../src/js/date-object');
constants = require('../../src/js/time-utils').constants;
var now = Date.now();
var dateObj = new DateObject(now, -8 * constants.HOURS_TO_MINUTES);
var regularDate = new Date(dateObj.getTime());

console.log('//// CURRENT TIME ////');
console.log('now ts:', now);
console.log('Date Object:', dateObj.toString());
console.log('Date Object ts:', dateObj.getTime());
console.log('Date JS:', regularDate.toLocaleString());
console.log('Date JS ts:', regularDate.getTime());
console.log('Date Object day of year:', dateObj.getDayOfYear());
console.log('Date Object fraction of year:', dateObj.getFractionOfYear());

console.log('');

dateObj = dateObj.getDateAtBeginningDay();
regularDate = new Date(dateObj.getTime());

console.log('//// INIT DAY ////');
console.log('Date Object:', dateObj.toString());
console.log('Date Object ts:', dateObj.getTime());
console.log('Date JS:', regularDate.toLocaleString());
console.log('Date JS ts:', regularDate.getTime());
console.log('Date Object day of year:', dateObj.getDayOfYear());
console.log('Date Object fraction of year:', dateObj.getFractionOfYear());

console.log('');

dateObj = dateObj.getDateAtBeginningYear();
regularDate = new Date(dateObj.getTime());

console.log('//// INIT YEAR ////');
console.log('Date Object:', dateObj.toString());
console.log('Date Object ts:', dateObj.getTime());
console.log('Date JS:', regularDate.toLocaleString());
console.log('Date JS ts:', regularDate.getTime());
console.log('Date Object day of year:', dateObj.getDayOfYear());
console.log('Date Object fraction of year:', dateObj.getFractionOfYear());
