define([
    "scyllaApp"
], function(
    scyllaApp
    ){
    'use strict';

    return scyllaApp
        .controller('DialogCompareEditor', function ($scope, $modalInstance, compare) {


            $scope.compare = compare;

            $scope.ok = function () {
                $modalInstance.close($scope.compare);
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        });
});