define([
    "scyllaApp",
    "home/header"
], function(
    scyllaApp,
    Page
    ){
    'use strict';

    return scyllaApp.controller("HomeController", function($scope, $http, Header) {
        Header.setFirstLevelNavId("homeNav");

    });

})
