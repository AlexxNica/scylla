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

    return scyllaApp.controller("CompareController", function($scope, $modal, Header, ComparesService) {
        Header.setFirstLevelNavId("comparesNav");

        $scope.compares = [];

        $scope.getAllCompares = function(){
            $scope.isProcessing = true;
            ComparesService.list()
                .then(function(compares){
                    $scope.isProcessing = false;
                    $scope.compares = compares;
                });
        };
        $scope.getAllCompares();


        $scope.deleteCompare = function deleteRCompare(compare){
            $scope.showDeleteCompare = true
            $scope.compareToDelete = compare;
            console.log("AB Compare to Delete", compare);
        };

        $scope.deleteResult = function deleteResult(resultId){
            $http.delete("/abcompare-results/" + resultId)
                .error(function(error){
                    console.error("Error Deleting AB Compare Result", resultId, error);
                })
        };

        $scope.confirmDeleteCompare = function confirmDeleteCompare(compare){
            console.log("Deleting AB Compare", compare);
            $http.get("/abcompares/" + compare.id, {params:{includeResults:true}})
                .success(function(compare){
                    if(compare.results){
                        compare.results.forEach(function(result){
                            $scope.deleteResult(result.id);
                        });
                    }
                    $http.delete("/abcompares/" + compare.id)
                        .success(function(deletedCompare){
                            console.log("Deleted Compare",deletedCompare);
                            $scope.getAllCompares();
                            $scope.showDeleteCompare = false;
                        })
                        .error(function(err){
                            console.error(err);
                        });
                });

        };

        $scope.showNew = function () {
            var modalInstance = $modal.open({
                templateUrl: 'app/compares/dialogs/compareEditor.html',
                controller: 'DialogCompareEditor',
                resolve: {
                    compare: function () {
                        return {
                            pageA:{name:"",url:""},
                            pageB:{name:"",Url:""}
                        };
                    }
                }
            });

            modalInstance.result.then(function (compare) {
                $scope.saveCompare(compare)
                    .then(function(newCompare){
                        toastr.success("New Compare Created.<br>Now capturing snapshots and creating diff.");
                        $scope.executeCompare(newCompare);
                    })
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        $scope.saveCompare = function saveCompare(compare){
            $scope.isProcessing = true;
            return ComparesService.save(compare)
                .then(function(newCompare){
                    $scope.compares.push(newCompare);
                    $scope.isProcessing = false;
                    return newCompare;
                });
        };

        $scope.executeCompare = function executeCompare(compare){
            $scope.isProcessing = true;
            return ComparesService.save(compare)
                .then(function(newCompare){
                    $scope.compares.push(newCompare);
                    $scope.isProcessing = false;
                    return newCompare;
                });
        };

    });
});
