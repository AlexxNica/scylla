define([
    "scyllaApp",
    "toastr",
    "directives/spin/processingSpinner"
], function(
    scyllaApp,
    toastr,
    processingSpinner
    ){
    'use strict';

    return scyllaApp.controller("ReportBookmarkletController", function($scope, $http, $location, Page) {
        Page.setFirstLevelNavId("reportsNav");
        $scope.isProcessing = false;
        $scope.newReportTitle = $location.search().title;
        $scope.newReportUrl = $location.search().url;

        $scope.addReport = function(name, url, width, height){
            $scope.isProcessing = true;
            console.log("New Report: ", name, url, width, height);
            $http.post("/reports", {name:name,url:url, width:width, height:height})
                .success(function(report){
                    toastr.success("New Report Created: " + report.name + "<br>Now capturing first screenshot.");
                    $http.get("/reports/" + report._id + "/newMaster" )
                        .success(function(report){
                            toastr.success("Captured Screen for Report: " + name);
                            $scope.isProcessing = false;
                            window.parent.postMessage("close", '*')
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
