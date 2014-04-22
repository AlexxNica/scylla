define([
    "scyllaApp",
    "toastr"
], function(
    scyllaApp,
    toastr
    ){
    'use strict';

    return scyllaApp.controller("ComparesController", function($scope, $http, Header) {
        Header.setFirstLevelNavId("comparesNav");

        $scope.compares = [];
        $scope.compareToDelete = {};

        $scope.showDeleteCompare = false;
        $scope.showNewCompare = false;

        $scope.getThumbnail = function getThumbnail(compare){
            if(compare && compare.thumb) {
                return compare.thumb;
            }
            return "images/compareHasNoThumb.png"
        };

        $scope.getAllCompares = function(){

            $http.get("/abcompares")
                .success(function(compares){
                             $scope.loaded = true;
                             $scope.compares = compares;
                         })
                .error(function(err){
                           alert(err)
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
        }

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

        $scope.addCompare = function(name, urlA, urlB, width, height){
            console.log("New Compare: ", name, urlA, urlB, width, height);
            $http.post("/abcompares", {name:name,urlA:urlA, urlB:urlB, width:width, height:height})
                .success(function(compare){
                    $scope.showNewCompare = false;
                    toastr.success("New AB Compare Created: " + compare.name);
                    $scope.getAllCompares();
                 })
                .error(function(error){
                    console.error("Error Saving Compare: ", error);
                    $("#newCompare .alert").show();
                    //TODO: Show Specific Failure Message

                });
        };
    });
});
