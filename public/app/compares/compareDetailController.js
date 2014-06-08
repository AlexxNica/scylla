define([
    "scyllaApp",
    "toastr",
    "services/comparesService",
    "compares/dialogs/compareEditor",
    "compares/dialogs/deleteCompare"
], function(
    scyllaApp,
    toastr,
    TheComparesService,
    TheCompareEditor,
    TheCompareDeleter
    ){
    'use strict';

    return scyllaApp.controller("CompareDetailController", function($scope, $modal, $routeParams, Header, ComparesService) {
        Header.setFirstLevelNavId("comparesNav");
        $scope.isProcessing = false;
        $scope.compare = {};

        var resultSort = function resultSort(a,b){
            return new Date(b.createdAt) -  new Date(a.createdAt);
        };

        $scope.getCompare = function(id){
            $scope.isProcessing = true;
            ComparesService.get(id)
                .then(function(compare){
                    $scope.isProcessing = false;
                    compare.snapshotDiffs.sort(resultSort);
                    $scope.compare = compare;

                });
        };
        $scope.getCompare($routeParams.id);



        $scope.runCompare = function(){
            $scope.isProcessing = true;
            ComparesService.executeCompare($scope.compare)
                .then(function(diff){
                    $scope.compare.snapshotDiffs.unshift(diff);
                    $scope.isProcessing = false;
                });
        };


        $scope.editCompare = function(compare) {
            $scope.saveCompare(compare)
                .success(function(){
                    $scope.showEditModal = false;
                });
        }

        $scope.saveCompare = function(compare){
            console.log("Save Compare: ", compare);
            return $http.put("/abcompares/" + compare.id, compare)
                .success(function(compare){
                    toastr.success("Compare Saved: " + compare.name);
                 })
                .error(function(error){
                    console.error("Error Saving Compare: ", error);
                    $("#saveCompare .alert").show();
                    //TODO: Show Specific Failure Message

                })
        }
    });
});
