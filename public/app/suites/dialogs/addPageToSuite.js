define([
    "scyllaApp",
    "services/pagesService",
    "moment"
], function(
    scyllaApp,
    thePagesService,
    moment
    ){
    'use strict';

    return scyllaApp
        .controller('DialogAddPageToSuite', function ($scope, $modalInstance, suite, PagesService) {


            $scope.suite = suite;
            $scope.pages = [];
            $scope.currentSnapshots = [];

            $scope.selectedPage = {};
            $scope.selectedSnapshot = {};

            PagesService.list()
                .then(function(pages){
                    //We should filter out pages already in the snapshot list
                    $scope.pages = pages;
                });

            $scope.getThumbnail = function getThumbnail(snapshot){
                return "/snapshots/" + snapshot.id + "/image";
            };

            $scope.updateSnapshots = function(selected){
                $scope.pages.forEach(function(page){
                    if(page.id == selected){
                        $scope.selectedPage = page;
                        $scope.currentSnapshots = page.snapshots;
                    }
                });
            };

            $scope.selectSnapshot = function(selected){
                console.log(selected);
                $scope.selectedSnapshot = selected;
            };

            $scope.ok = function () {
                $modalInstance.close($scope.selectedSnapshot);
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        });
});