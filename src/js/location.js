function Location(latitude, longitude) {
    this.lat = latitude;
    this.lng = longitude;
}

Location.prototype.getLatitude = function() {
    return this.lat;
};

Location.prototype.getLongitude = function() {
    return this.lng;
};

module.exports = Location;
