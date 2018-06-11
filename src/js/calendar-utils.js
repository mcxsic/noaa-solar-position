function _leapYear(year) {
  if (isNan(year)) return null;
  return year % 4 == 0 && (year % 100 != 0 || year % 400 == 0);
}

module.exports = {
  isLeapYear: _leapYear,
};
