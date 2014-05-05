define([
    "scyllaApp"
], function(
    scyllaApp
    ){
    'use strict';

    return scyllaApp
        .controller('DialogDeleteCompare', function ($scope, $modalInstance, compare) {


            $scope.compare = compare;

            $scope.ok = function () {
                $modalInstance.close($scope.compare);
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        });
});