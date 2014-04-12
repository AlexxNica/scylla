define([
    "scyllaApp"
], function(
    scyllaApp
    ){
    'use strict';

    return scyllaApp
        .controller('DialogDeleteSuite', function ($scope, $modalInstance, suite) {


            $scope.suite = suite;

            $scope.ok = function () {
                $modalInstance.close($scope.suite);
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        });
});