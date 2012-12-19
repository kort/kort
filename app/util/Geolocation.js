/**
 * Geolocation with distance calculation function
 */
Ext.define('Kort.util.Geolocation', {
    extend: 'Ext.util.Geolocation',

    config: {
        available: false,
        autoUpdate: false,
        timeout: 20000,

        listeners: {
            locationupdate: function(geo, eOpts) {
                geo.setAvailable(true);
            },
            locationerror: function(geo, bTimeout, bPermissionDenied, bLocationUnavailable, message, eOpts) {
                geo.setAvailable(false);
            }
        }
    },

    /**
     * @private
     * Calculates the distance to given latitude / logitude. Source: http://www.movable-type.co.uk/scripts/latlong.html
     * @param {Number} latitude Latitude
     * @param {Number} longitude Longitude
     */
    getDistance: function(latitude, longitude) {
        var earthRadius = 6371000, // m
            dLat, dLng, thisLatitude, otherLatitude, a, c;

        latitude = parseFloat(latitude);
        longitude = parseFloat(longitude);

        dLat = (latitude - this.getLatitude()).toRad();
        dLng = (longitude - this.getLongitude()).toRad();
        thisLatitude = this.getLatitude().toRad();
        otherLatitude = latitude.toRad();

        a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.sin(dLng/2) * Math.sin(dLng/2) * Math.cos(thisLatitude) * Math.cos(otherLatitude);
        c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return earthRadius * c;
    },

    /**
     * Returns distances with measurement unit
     * @param {Number} distanceInMeters Distance to format
     */
    getFormattedDistance: function(distanceInMeters) {
        if(distanceInMeters > 999) {
            // round to one decimal
            return (Math.round(distanceInMeters / 100) / 10) + "km";
        } else {
            return Math.round(distanceInMeters) + "m";
        }
    }
});