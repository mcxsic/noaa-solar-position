function Location(latitude, latitude) {
    this.lat = latitude;
    this.lng = latitude;
}

Location.prototype.getLatitude = function() {
    return this.lat;
};

Location.prototype.getLongitude = function() {
    return this.lng;
};

module.exports = Location;
