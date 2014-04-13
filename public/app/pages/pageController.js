define([
    "scyllaApp",
    "toastr",
    "moment",
    "services/pagesService",
    "pages/dialogs/pageEditor",
    "directives/spin/processingSpinner"
], function(
    scyllaApp,
    toastr,
    moment,
    ThePagesService,
    ThePageEditor,
    processingSpinner
    ){
    'use strict';

    return scyllaApp.controller("PageController", function($scope, $http, $modal, Header, PagesService) {
        Header.setFirstLevelNavId("pagesNav");
        $scope.isProcessing = false;
        $scope.pages = [];
        $scope.suites = [];
        $scope.pageToDelete = {};

        $scope.dateFormat = function(isoString) {
            if(typeof isoString === "undefined") return "";
            return moment(isoString).format("MMMM Do, h:mm A");
        };

        $scope.getThumbnail = function getThumbnail(page){
            return "/pages/" + page.id + "/thumb";
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
            $http.get("/suites")
                .success(function(suites){
                    $scope.suites = suites
                })
                .error(function(err){
                    alert(err)
                });
        };
        $scope.getAllSuites();

        $scope.deletePage = function deletePage(page){
            $scope.showDeletePage = true;
            $scope.pageToDelete = page;
            console.log("Page to Delete", page);
        };

        $scope.confirmDeletePage = function confirmDeletePage(page){
            $scope.isProcessing = true;
            console.log("Deleting Page", page);
            $http.get("/pages/" + page.id)
                .success(function(page){
                    if(page.results){
                        page.results.forEach(function(result){
                            $scope.deleteResult(result.id);
                        });
                    }
                    $http.delete("/pages/" + page.id)
                        .success(function(deletedPage){
                            console.log("Deleted Page",deletedPage);
                            $scope.getAllPages();
                            $scope.showDeletePage = false;
                            $scope.isProcessing = false;
                        })
                        .error(function(err){
                            console.error(err);
                            $scope.isProcessing = false;
                        });
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

    });
});
