define([
    "scyllaApp",
    "toastr",
    "services/pagesService",
    "directives/spin/processingSpinner"
], function(
    scyllaApp,
    toastr,
    ThePagesService,
    processingSpinner
    ){
    'use strict';

    return scyllaApp.controller("PageDetailController", function($scope, $route, $routeParams, $modal, PagesService, Header) {
        Header.setFirstLevelNavId("reportsNav");
        $scope.isProcessing = false;
        $scope.page = {};

        var sortCreatedAt = function(a,b){
            return a.createdAt < b.createdAt;
        };

        $scope.getPage = function(id){
            PagesService.get(id)
                .then(function(page){
                    if(page.snapshots){
                        page.snapshots.sort(sortCreatedAt);
                    }
                    $scope.page = page;
                    console.log("Got Page", $scope.page);
                });
        };
        $scope.getPage($routeParams.id);


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

        $scope.snapshotPageNow = function snapshotPageNow(page){
            $scope.isProcessing = true;
            PagesService.snapshotPage(page)
                .then(function(snapshot){
                    $scope.page.snapshots.unshift(snapshot);
                    toastr.success("Page Snapshot Finished");
                    $scope.isProcessing = false;
                },function(error){
                    console.error("Error Capturing Page: ", error);
                    alert(error);
                    $scope.isProcessing = false;
                });
        };

        $scope.showEdit = function showEdit() {
            var modalInstance = $modal.open({
                templateUrl: 'app/pages/dialogs/pageEditor.html',
                controller: 'DialogPageEditor',
                resolve: {
                    page: function () {
                        return angular.copy($scope.page);
                    }
                }
            });

            modalInstance.result.then(function (page) {
                $scope.savePage(page);
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };


        $scope.savePage = function savePage(page){
            $scope.isProcessing = true;
            return PagesService.save(page)
                .then(function(newPage){
                    $scope.page = newPage;
                    $scope.isProcessing = false;
                    return newPage;
                });
        };
    });
});
