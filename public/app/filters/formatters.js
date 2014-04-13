define([
    "scyllaApp",
    "moment"
], function(
    scyllaApp,
    moment
    ){

    var formatters = angular.module('ScyllaFormatters', []);

    scyllaApp.filter('dateFormatter', function() {
            return function(isoString) {
                if(typeof isoString === "undefined") return "";
                return moment(isoString).format("MMMM Do, h:mm A");
            }
        });

    return formatters;
});