define([
    "scyllaApp",
    "toastr",
    "moment",
    "directives/diff/diff",
    "directives/diff/diffAdapter"
], function(
    scyllaApp,
    toastr,
    moment,
    diffDirective,
    diffAdapter
    ){
    'use strict';

    return scyllaApp.controller("SnapshotDiffDetailController", function($scope, $route, $routeParams, $http, Header) {
        Header.setFirstLevelNavId("reportsNav");
        $scope.resultDiff = {};
        $scope.diff = {};

        $scope.getSnapshotDiff = function(snapshotDiffId){

            $http.get("/snapshotDiffs/" + snapshotDiffId)
                .success(function(snapshotDiff){
                    $scope.resultDiff = snapshotDiff;
                    $scope.diff = snapshotDiff;//diffAdapter.reportResultToDiff(resultDiff);
                })
                .error(function(err){
                    alert(err)
                });
        };

        $scope.getSnapshotDiff($routeParams.id);


    });
});
