define([
    "scyllaApp",
    "moment",
    "toastr",
    "services/suitesService",
    "directives/spin/processingSpinner"
], function(
    scyllaApp,
    moment,
    toastr,
    theSuitesService,
    processingSpinner
    ){
    'use strict';

    return scyllaApp.controller("SuiteController", function($scope, $modal, Header, SuitesService) {
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


        $scope.askToConfirmDelete = function(suite){
            $scope.showDeleteSuite = true;
            $scope.suiteToDelete = suite;
            console.log("Suite to Delete", suite);
        };

        $scope.deleteSuite = function(suite){
            $scope.isProcessing = true
            console.log("Deleting Suite", suite);
            SuitesService.delete(suite)
                .success(function(deleteResult){
                    toastr.success("Suite " + suite.name + " deleted");
                    $scope.getAllSuites();
                    $scope.showDeleteSuite = false;
                    $scope.isProcessing = false;
                });
        };

        $scope.saveSuite = function(suite){
            return SuitesService.save( suite)
                .success(function(suite){
                    toastr.success("Suite Saved: " + suite.name);
                });
        };

        $scope.getAllSuites = function(){
            return SuitesService.list();
        };

        $scope.getAllSuites();

        $scope.dateFormat = function(isoString) {
            return moment(isoString).format("MMMM Do, h:mm A");
        };
    });

})
