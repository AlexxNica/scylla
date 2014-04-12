define([
    "scyllaApp",
    "moment",
    "toastr",
    "services/suitesService",
    "suites/dialogs/suiteEditor",
    "suites/dialogs/deleteSuite",
    "directives/spin/processingSpinner"
], function(
    scyllaApp,
    moment,
    toastr,
    theSuitesService,
    theDialogSuiteEditor,
    theDialogDeleteSuite,
    processingSpinner
    ){
    'use strict';

    return scyllaApp.controller("SuiteController", function($scope, $modal, $log, Header, SuitesService) {
        Header.setFirstLevelNavId("suitesNav");
        $scope.suites = SuitesService.suites;
        $scope.reportToDelete = {};
        $scope.showDeleteSuite = false;

        $scope.showNewSuite = false;
        $scope.availableReports = [];
        $scope.newSuiteName = "";
        $scope.newSuiteReportIds = [];
        $scope.suiteScheduleEnabled = false;
        $scope.suiteScheduleTime = "06:00";

        var dayList =["sun", "mon", "tues", "wed","thurs","fri","sat"];
        $scope.days = {
            sun: false,
            mon: true,
            tues: true,
            wed: true,
            thurs: true,
            fri:true,
            sat:false
        };


        $scope.showNew = function () {

            /*
             var sch = $scope.suite.schedule;
             for(var i in dayList){
             $scope.days[dayList[i]] = (sch.days.indexOf(parseInt(i)) != -1);
             }
             var localTime = new moment().utc().hours(sch.hour).minutes(sch.minute);
             $scope.suiteScheduleTime = localTime.local().format("HH:mm");
             console.log($scope.days);
             console.log($scope.suiteScheduleTime);
             */

            var modalInstance = $modal.open({
                templateUrl: 'app/suites/dialogs/suiteEditor.html',
                controller: 'DialogSuiteEditor',
                resolve: {
                    suite: function () {
                        return {};
                    }
                }
            });

            modalInstance.result.then(function (suite) {
                $scope.saveSuite(suite);
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        $scope.confirmDeleteSuite = function(suite){
            var modalInstance = $modal.open({
                templateUrl: 'app/suites/dialogs/deleteSuite.html',
                controller: 'DialogDeleteSuite',
                resolve: {
                    suite: function () {
                        return suite;
                    }
                }
            });

            modalInstance.result.then(function (suite) {
                $scope.deleteSuite(suite);
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };


        $scope.deleteSuite = function(suite){
            $scope.isProcessing = true;
            console.log("Deleting Suite", suite);
            SuitesService.delete(suite)
                .then(function(deleteResult){
                    toastr.success("Suite " + suite.name + " deleted");
                    $scope.getAllSuites();
                    $scope.isProcessing = false;
                });
        };

        $scope.saveSuite = function(suite){
            return SuitesService.save( suite)
                .then(function(suite){
                    $scope.suites.push(suite);
                    toastr.success("Suite Saved: " + suite.name);
                });
        };

        $scope.getAllSuites = function(){
            return SuitesService.list()
                .then(function(suites){
                    $scope.suites = suites;
                });
        };

        $scope.getAllSuites();

        $scope.dateFormat = function(isoString) {
            return moment(isoString).format("MMMM Do, h:mm A");
        };
    });

})
