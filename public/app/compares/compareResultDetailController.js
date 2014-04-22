define([
    "scyllaApp",
    "toastr",
    "moment",
    "directives/diff/diff",
    "directives/diff/diffAdapter"
], function(
    scyllaApp,
    toastr,
    moment,
    diffDirective,
    diffAdapter
    ){
    'use strict';

    return scyllaApp.controller("CompareResultDetailController", function($scope, $route, $routeParams, $http, Header) {
        Header.setFirstLevelNavId("comparesNav");
        $scope.resultDiff = {};
        $scope.diff = {};

        $scope.getCompareResult = function(resultId){

            $http.get("/abcompare-results/" + resultId, {params:{includeResults:true, includeReport:true}})
                .success(function(abCompareResult){
                    $scope.compareResult = abCompareResult;
                    $scope.diff = diffAdapter.compareResultToDiff(abCompareResult);
                })
                .error(function(err){
                    alert(err)
                });
        };

        $scope.getCompareResult($routeParams.id);


    });
});
