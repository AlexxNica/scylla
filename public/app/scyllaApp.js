define([
    "angular",
    "aBootstrap",
    "toastr"
], function(
    angular,
    aBootstrap,
    toastr
    ){
    'use strict';

    var app = angular.module("scyllaApp",["ui.bootstrap"]);

    toastr.options = {
        "debug": false,
        "positionClass": "toast-bottom-right",
        "onclick": null,
        "fadeIn": 300,
        "fadeOut": 500,
        "timeOut": 3000,
        "extendedTimeOut": 1000
    };

    return app;

});


