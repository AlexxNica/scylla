define([
    "scyllaApp",
    "moment",
    "toastr",
    "directives/spin/processingSpinner"
], function(
    scyllaApp,
    moment,
    toastr,
    processingSpinner
    ){
    'use strict';

    return scyllaApp.controller("SuiteController", function($scope, $http, Header) {
        Header.setFirstLevelNavId("suitesNav");
        $scope.suites = [];
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

        $scope.showNewSuiteWindow = function(){
            $scope.showNewSuite = true;
            $http.get("/pages")
                .success(function(reports){
                    $scope.availableReports = reports;
                })
                .error(function(err){
                    alert(err);
                });
        };

        $scope.addSuite = function(suiteName, reportIds){
            var suite = {name:suiteName, pages:reportIds};
            /*
            suite.scheduleEnabled = $scope.suiteScheduleEnabled;
            suite.schedule = {days:[]}
            for(var i=0; i < dayList.length; i++){
                if($scope.days[dayList[i]]) suite.schedule.days.push(i);
            }
            var time = $scope.suiteScheduleTime.split(":");
            var d = new moment().hours(time[0]).minutes(time[1]).utc();
            suite.schedule.hour = d.hours();
            suite.schedule.minute = d.minutes();
            */
            $scope.saveSuite(suite)
                .success(function(suite){
                    $scope.showNewSuite = false;
                })
        };
        $scope.askToConfirmDelete = function(suite){
            $scope.showDeleteSuite = true;
            $scope.suiteToDelete = suite;
            console.log("Suite to Delete", suite);
        };

        $scope.deleteSuite = function(suite){
            $scope.isProcessing = true
            console.log("Deleting Suite", suite);
            $http.delete("/suites/" + suite.id)
                .success(function(deleteResult){
                    toastr.success("Suite " + suite.name + " deleted");
                    $scope.getAllSuites();
                    $scope.showDeleteSuite = false;
                    $scope.isProcessing = false;
                });
        };

        $scope.saveSuite = function(suite){
            return $http.post("/suites", suite)
                .success(function(suite){
                    $scope.getAllSuites();
                    toastr.success("Suite Saved: " + suite.name);
                })
                .error(function(err){
                    alert(err);
                })
        };

        $scope.getAllSuites = function(){
            $http.get("/suites", {params:{includeResults:"true"}})
                .success(function(suites){
                             $scope.suites = suites
                         })
                .error(function(err){
                           alert(err)
                       });
        };
        $scope.getAllSuites();

        $scope.dateFormat = function(isoString) {
            return moment(isoString).format("MMMM Do, h:mm A");
        };
    });

})
