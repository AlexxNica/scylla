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
        $scope.page = {};
        $scope.showEditModal = false;

        var resultSort = function(a,b){
            return a.createdAt < b.createdAt;
        };

        $scope.getPage = function(id){

            $http.get("/pages/" + id)
                .success(function(page){
                     $scope.loaded = true;
                     if(page.snapshots){
                         page.snapshots.sort(resultSort);
                         /*
                         for(var i in page.snapshots){
                             $scope.loadResultDiffs(page.snapshots[i]);
                         }*/
                     }

                     $scope.page = page;
                 })
                .error(function(err){
                    alert(err)
                });
        };
        $scope.getPage($routeParams.id);

        $scope.loadResultDiffs = function(result){
            $http.get("/report-results/" + result.id + "/diffs")
                .success(function(resultDiffs){
                    result.resultDiffs = resultDiffs;
                            })
                .error(function(err){
                    alert(err)
                });
        };

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
        $scope.getSnapshotDiffClass = function(snapshotDiff, snapshotA, snapshotB){
            var classes = [];
            if(snapshotA.masterSnapshots && snapshotA.masterSnapshots.length > 0) {
                classes.push( "resultAIsMaster");
            }
            if(snapshotB.masterSnapshots && snapshotB.masterSnapshots.length > 0) {
                classes.push( "resultBIsMaster");
            }
            classes.push (snapshotDiff.distortion > 0 ? "fail" : "pass");

            return classes.join(" ");
        };

        $scope.formatResultHeader = function(result){
            var label = $scope.dateFormat(result.createdAt);

            return label;
        };

        $scope.setNewMaster = function setNewMaster(result){
            $scope.isProcessing = true;
            $scope.page.masterResult = result;
            $http.put("/pages/" + $scope.page.id + "/masterResult", result)
                .success(function(){
                    toastr.success("Master Result Set");
                    $scope.isProcessing = false;
                })
                .error(function(error){
                    console.error("Error Saving Master: ", error);
                    alert(error);
                    $scope.isProcessing = false;
                });
            //$scope.saveReport($scope.page);
        };

        $scope.runReport = function runReport(){
            $scope.isProcessing = true
            $http.get("/pages/" + $scope.page.id + "/snapshot")
                .success(function(snapshot){
                    $scope.page.snapshots.unshift(snapshot);
                    toastr.success("Page Snapshot Finished");
                    $scope.isProcessing = false;
                })
                .error(function(error){
                    console.error("Error Capturing Page: ", error);
                    alert(error);
                    $scope.isProcessing = false;
                })
        };

        $scope.editPage = function(page) {
            $scope.isProcessing = true;
            $scope.savePage(page)
                .success(function(){
                    $scope.showEditModal = false;
                    $scope.isProcessing = false;
                })
                .error(function(error){
                    $scope.isProcessing = false;
                });
        };

        $scope.savePage = function(page){
            console.log("Save Page: ", page);
            return $http.put("/pages/" + page.id, page)
                .success(function(page){
                    toastr.success("Page Saved: " + page.name);
                 })
                .error(function(error){
                    console.error("Error Saving Page: ", error);
                    $("#savePage .alert").show();
                    //TODO: Show Specific Failure Message

                })
        }
    });
});
