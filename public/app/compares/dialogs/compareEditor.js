define([
    "scyllaApp"
], function(
    scyllaApp
    ){
    'use strict';

    return scyllaApp
        .controller('DialogCompareEditor', function ($scope, $modalInstance, compare, isNewCompare) {

            $scope.compare = compare;
            $scope.saveField = '';
            $scope.isNewCompare = isNewCompare;

            $scope.cloneCookie = function cloneCookie() {
                $scope.sameCookie = !$scope.sameCookie;
                if ($scope.sameCookie) {
                    $scope.saveField = $scope.compare.pageB.cookie;
                    $scope.compare.pageB.cookie = $scope.compare.pageA.cookie;
                } else {
                    $scope.compare.pageB.cookie = $scope.saveField;
                }
            }

            $scope.ok = function () {
                $modalInstance.close($scope.compare);
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };

            $scope.checkSameCookie = function() {
                return !isNewCompare
                    && $scope.compare.pageA.cookie
                    && $scope.compare.pageA.cookie == $scope.compare.pageB.cookie;
            }

            $scope.sameCookie = $scope.checkSameCookie();

        });
});