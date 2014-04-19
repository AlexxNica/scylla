define([
    "scyllaApp"
], function(
    scyllaApp
    ){
    'use strict';

    return scyllaApp
        .controller('BulkPageImporter', function ($scope, $modalInstance) {

            $scope.csv = "";
            $scope.pages = [];

            $scope.updatePages = function updatePages(csv){
                var results = $.parse(csv, {
                    delimiter: ",",
                    header: true
                });
                $scope.pages = results.results.rows;
                console.log($scope.pages);
            };

            $scope.ok = function () {
                $modalInstance.close($scope.pages);
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        });
});