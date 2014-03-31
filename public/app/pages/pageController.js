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

    return scyllaApp.controller("PageController", function($scope, $http, Header) {
        Header.setFirstLevelNavId("pagesNav");
        $scope.isProcessing = false;
        $scope.pages = [];
        $scope.suites = [];
        $scope.reportToDelete = {};

        $scope.dateFormat = function(isoString) {
            if(typeof isoString === "undefined") return "";
            return moment(isoString).format("MMMM Do, h:mm A");
        };

        $scope.getThumbnail = function getThumbnail(report){
            return "/pages/" + report.id + "/thumb";
        };

        $scope.getAllPages = function(){

            $http.get("/pages")
                .success(function(pages){
                             $scope.loaded = true;
                             $scope.pages = pages;
                         })
                .error(function(err){
                           alert(err)
                       });
        };
        $scope.getAllPages();

        $scope.getAllSuites = function(){
            $http.get("/suites", {params:{includeResults:"false"}})
                .success(function(suites){
                    $scope.suites = suites
                })
                .error(function(err){
                    alert(err)
                });
        };
        $scope.getAllSuites();

        $scope.deleteReport = function deleteReport(report){
            $scope.showDeleteReport = true
            $scope.reportToDelete = report;
            console.log("Report to Delete", report);
        };

        $scope.deleteResult = function deleteResult(resultId){
            $http.delete("/report-results/" + resultId)
                .error(function(error){
                    console.error("Error Deleting Result", resultId, error);
                })
        };

        $scope.confirmDeleteReport = function confirmDeleteReport(report){
            $scope.isProcessing = true;
            console.log("Deleting Report", report);
            $http.get("/pages/" + report.id, {params:{includeResults:true}})
                .success(function(report){
                    if(report.results){
                        report.results.forEach(function(result){
                            $scope.deleteResult(result.id);
                        });
                    }
                    $http.delete("/pages/" + report.id)
                        .success(function(deletedReport){
                            console.log("Deleted Report",deletedReport);
                            $scope.getAllPages();
                            $scope.showDeleteReport = false;
                            $scope.isProcessing = false;
                        })
                        .error(function(err){
                            console.error(err);
                            $scope.isProcessing = false;
                        });
                });
        };

        $scope.addReport = function(name, url, width, height){
            $scope.isProcessing = true;
            console.log("New Report: ", name, url, width, height);
            $http.post("/pages", {name:name,url:url, width:width, height:height})
                .success(function(report){
                    $scope.showNewReport = false;
                    toastr.success("New Report Created: " + report.name + "<br>Now capturing first screenshot.");
                    $http.get("/pages/" + report.id + "/newMaster" )
                        .success(function(report){
                            toastr.success("Captured Screen for Report: " + name);
                            //Or, just replace the report
                            $scope.getAllPages();
                            $scope.isProcessing = false;
                        });
                 })
                .error(function(error){
                    console.error("Error Saving Report: ", error);
                    $("#newReport .alert").show();
                    $scope.isProcessing = false;
                    //TODO: Show Specific Failure Message

                });
        };
    });
});
