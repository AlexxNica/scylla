define([
    "scyllaApp",
    "toastr"
], function(
    scyllaApp,
    toastr
    ){
    'use strict';

    return scyllaApp.controller("SnapshotDetailController", function($scope, $route, $routeParams, $http, Header) {
        Header.setFirstLevelNavId("reportsNav");

        $scope.snapshot = {};

        $scope.getSnapshot = function(snapshotId){

            $http.get("/snapshots/" + snapshotId)
                .success(function(snapshot){
                    $scope.snapshot = snapshot;
                })
                .error(function(err){
                    alert(err)
                });
        };

        $scope.getSnapshot($routeParams.id);


    });
});
