define([
    "scyllaApp",
    "toastr",
    "moment",
    "services/pagesService",
    "pages/dialogs/pageEditor",
    "pages/dialogs/deletePage",
    "directives/spin/processingSpinner"
], function(
    scyllaApp,
    toastr,
    moment,
    ThePagesService,
    ThePageEditor,
    ThePageDeleter,
    processingSpinner
    ){
    'use strict';

    return scyllaApp.controller("PageController", function($scope, $modal, Header, PagesService) {
        Header.setFirstLevelNavId("pagesNav");
        $scope.isProcessing = false;
        $scope.pages = [];
        $scope.suites = [];
        $scope.pageToDelete = {};


        $scope.getAllPages = function(){
            $scope.isProcessing = true;
            PagesService.list()
                .then(function(pages){
                    $scope.isProcessing = false;
                    $scope.pages = pages;
                });
        };

        $scope.confirmDeleteSuite = function(page){
            var modalInstance = $modal.open({
                templateUrl: 'app/pages/dialogs/deletePage.html',
                controller: 'DialogDeletePage',
                resolve: {
                    page: function () {
                        return page;
                    }
                }
            });

            modalInstance.result.then(function (page) {
                $scope.deletePage(page);
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };


        $scope.deletePage = function deletePage(page){
            $scope.isProcessing = true;

            PagesService.delete(page)
                .then(function(){
                    $scope.isProcessing = true;
                    toastr.success("Page " + page.name + " deleted");
                    $scope.getAllPages();
                })
                .finally(function(){
                    $scope.isProcessing = false;
                });
        };

        $scope.showNew = function () {
            var modalInstance = $modal.open({
                templateUrl: 'app/pages/dialogs/pageEditor.html',
                controller: 'DialogPageEditor',
                resolve: {
                    page: function () {
                        return {};
                    }
                }
            });

            modalInstance.result.then(function (page) {
                $scope.savePage(page)
                    .then(function(newPage){
                        toastr.success("New Page Created: " + newPage.name + "<br>Now capturing first screenshot.");
                        $scope.snapshotPage(newPage);
                    })
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        $scope.savePage = function savePage(page){
            $scope.isProcessing = true;
            return PagesService.save(page)
                .then(function(newPage){
                    $scope.pages.push(newPage);
                    $scope.isProcessing = false;
                    return newPage;
                });
        };

        $scope.snapshotPage = function snapshotPage(page){
            $scope.isProcessing = true;
            PagesService.snapshotPage(page)
                .then(function(newSnapshot){
                    $scope.isProcessing = false;
                    toastr.success("Captured Screen for Page: " + page.name);
                });
        };


        $scope.getAllPages();

    });
});
