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

    return scyllaApp.controller("SnapshotRunController", function($scope, $route, $routeParams, $http, Header) {
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

        $scope.selectResultDiff = function(diffId){
            $scope.getResultDiff(diffId);
        }

        $scope.dateFormat = function(isoString) {
            return moment(isoString).format("MMMM Do, h:mm A");
        };


        $scope.getBatch = function(id){
            $http.get("/batches/" + id, {params:{includeResults:"false", includeReports:"false"}})
                .success(function(batch){
                    //batch.results.sort(function(a,b) { return a.end < b.end; } );
                    $scope.batch = batch

                })
                .error(function(err){
                    alert(err)
                });
        };

        $scope.getBatchResult = function(id){
            $http.get("/batch-results/" + id, {params:{includeResults:false, includeReports:true}})
                .success(function(batchResult){
                    $scope.batchResult = batchResult
                    if(!$routeParams.diffId){
                        for(var id in batchResult.reportResultSummaries){
                            $scope.getResultDiff(batchResult.reportResultSummaries[id].resultDiffId);
                            break;
                        }
                    }

                })
                .error(function(err){
                    alert(err)
                });
        };

        $scope.getResultDiff = function(id){
            $http.get("/result-diffs/" + id, {params:{includeResults:true, includeReports:true}})
                .success(function(resultDiff){
                    $scope.currentResultDiff = resultDiff;
                    $scope.diff = diffAdapter.reportResultToDiff(resultDiff);
                })
                .error(function(err){
                    alert(err)
                });
        };

        $scope.getBatch($routeParams.batchId);
        $scope.getBatchResult($routeParams.resultId);
        if($routeParams.diffId){
            $scope.getResultDiff($routeParams.diffId);
        }
    });
});
