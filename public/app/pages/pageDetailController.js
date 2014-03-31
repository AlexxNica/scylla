define([
    "scyllaApp",
    "toastr",
    "moment",
    "directives/spin/processingSpinner"
], function(
    scyllaApp,
    toastr,
    moment,
    processingSpinner
    ){
    'use strict';

    return scyllaApp.controller("PageDetailController", function($scope, $route, $routeParams, $http, Header) {
        Header.setFirstLevelNavId("reportsNav");
        $scope.isProcessing = false;
        $scope.report = {};
        $scope.showEditModal = false;

        var resultSort = function(a,b){
            return a.timestamp < b.timestamp;
        }

        $scope.getReport = function(id){

            $http.get("/pages/" + id, {params:{includeResults:true}})
                .success(function(report){
                             $scope.loaded = true;
                             if(report.results){
                                 report.results.sort(resultSort);
                                 for(var i in report.results){
                                     $scope.loadResultDiffs(report.results[i]);
                                 }
                             }

                             $scope.report = report
                         })
                .error(function(err){
                           alert(err)
                       });
        }
        $scope.getReport($routeParams.id);

        $scope.loadResultDiffs = function(result){
            $http.get("/report-results/" + result.id + "/diffs")
                .success(function(resultDiffs){
                    result.resultDiffs = resultDiffs;
                            })
                .error(function(err){
                    alert(err)
                });
        }

        $scope.dateFormat = function(isoString) {
            if(typeof isoString === "undefined") return "";
            return moment(isoString).format("MMMM Do, h:mm A");
        };
        $scope.getResultClass = function(result) {
            if($scope.report.masterResult && result.id == $scope.report.masterResult.id) {
                return "masterResult"
            }
            return "notMasterResult";
        };
        $scope.getResultDiffClass = function(resultDiff){
            var classes = [];
            if($scope.report.masterResult &&
            //Initially we have just the IDs, but later we'll have the entire object...
            // so our comparison has to take both into account.
               (resultDiff.reportResultA.id || resultDiff.reportResultA) == $scope.report.masterResult.id) {
                classes.push( "resultAIsMaster");
            } else if($scope.report.masterResult &&
               (resultDiff.reportResultB.id || resultDiff.reportResultB) == $scope.report.masterResult.id) {
                classes.push( "resultBIsMaster");
            }
            classes.push (resultDiff.distortion > 0 ? "fail" : "pass");

            return classes.join(" ");
        }

        $scope.formatResultHeader = function(result){
            var label = $scope.dateFormat(result.timestamp);

            return label;
        };

        $scope.setNewMaster = function setNewMaster(result){
            $scope.isProcessing = true
            $scope.report.masterResult = result;
            $http.put("/pages/" + $scope.report.id + "/masterResult", result)
                .success(function(){
                    toastr.success("Master Result Set");
                    $scope.isProcessing = false;
                })
                .error(function(error){
                    console.error("Error Saving Master: ", error);
                    alert(error);
                    $scope.isProcessing = false;
                })
            //$scope.saveReport($scope.report);
        };

        $scope.runReport = function runReport(){
            $scope.isProcessing = true
            $http.get("/pages/" + $scope.report.id + "/run")
                .success(function(mishMash){
                    var result = mishMash.result;
                    var resultDiff = mishMash.resultDiff;
                    result.resultDiffs = [resultDiff];
                    $scope.report.results.unshift(result);
                    if($scope.report.masterResult){
                        var i = $scope.report.results.length;
                        while(i-- > 0){
                            if($scope.report.results[i].id === $scope.report.masterResult.id){
                                $scope.report.results[i].resultDiffs.unshift(resultDiff);
                                i = 0;
                            }
                        }
                    }
                    toastr.success("Report Run");
                    $scope.isProcessing = false;
                })
                .error(function(error){
                    console.error("Error Running report: ", error);
                    alert(error);
                    $scope.isProcessing = false;
                })
        };

        $scope.editReport = function(report) {
            $scope.isProcessing = true;
            $scope.saveReport(report)
                .success(function(){
                    $scope.showEditModal = false;
                    $scope.isProcessing = false;
                })
                .error(function(error){
                    $scope.isProcessing = false;
                });
        }

        $scope.saveReport = function(report){
            console.log("Save Report: ", report);
            return $http.put("/pages/" + report.id, report)
                .success(function(report){
                    toastr.success("Report Saved: " + report.name);
                 })
                .error(function(error){
                    console.error("Error Saving Report: ", error);
                    $("#saveReport .alert").show();
                    //TODO: Show Specific Failure Message

                })
        }
    });
});
