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

    return scyllaApp.controller("SuiteRunController", function($scope, $route, $routeParams, $http, Header) {
        Header.setFirstLevelNavId("suitesNav");

        $scope.suite = {};
        $scope.suiteRun = {};
        $scope.snapshotDiff = {};

        /*
        dpd.batchresults.on("create", function(batchResult){
            console.log("DPD Event", batchResult);
            if(batchResult.batchId == $scope.batch.id){
                $scope.getBatch($scope.batch.id);
            }
        });
        */

        $scope.selectSnapshotDiff = function(selectedDiffId){
            $scope.suiteRun.snapshotDiffs.forEach(function(diff){
                if(selectedDiffId == diff.id) $scope.diff = diff;
            })
        }

        $scope.dateFormat = function(isoString) {
            return moment(isoString).format("MMMM Do, h:mm A");
        };


        $scope.getSuite = function(id){
            $http.get("/suites/" + id)
                .success(function(suite){
                    //batch.results.sort(function(a,b) { return a.end < b.end; } );
                    $scope.suite = suite

                })
                .error(function(err){
                    alert(err)
                });
        };

        $scope.getSuiteRun = function(id){
            $http.get("/suiteRuns/" + id)
                .success(function(suiteRun){
                    $scope.suiteRun = suiteRun;
                    $scope.diff = suiteRun.snapshotDiffs[0]
                })
                .error(function(err){
                    alert(err)
                });
        };

        $scope.getSuite($routeParams.suiteId);
        $scope.getSuiteRun($routeParams.suiteRunId);
    });
});
