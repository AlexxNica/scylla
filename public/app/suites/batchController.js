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

    return scyllaApp.controller("BatchController", function($scope, $http, Header) {
        Header.setFirstLevelNavId("batchesNav");
        $scope.batches = [];
        $scope.reportToDelete = {};
        $scope.showDeleteBatch = false;

        $scope.showNewBatch = false;
        $scope.availableReports = [];
        $scope.newBatchName = "";
        $scope.newBatchReportIds = [];
        $scope.batchScheduleEnabled = false;
        $scope.batchScheduleTime = "06:00";
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

        $scope.showNewBatchWindow = function(){
            $scope.showNewBatch = true;
            $http.get("/pages")
                .success(function(reports){
                    $scope.availableReports = reports;
                })
                .error(function(err){
                    alert(err);
                });
        };

        $scope.addBatch = function(batchName, reportIds){
            var batch = {name:batchName, pages:reportIds};
            batch.scheduleEnabled = $scope.batchScheduleEnabled;
            batch.schedule = {days:[]}
            for(var i=0; i < dayList.length; i++){
                if($scope.days[dayList[i]]) batch.schedule.days.push(i);
            }
            var time = $scope.batchScheduleTime.split(":");
            var d = new moment().hours(time[0]).minutes(time[1]).utc();
            batch.schedule.hour = d.hours();
            batch.schedule.minute = d.minutes();
            $scope.saveBatch(batch)
                .success(function(batch){
                    $scope.showNewBatch = false;
                })
        };
        $scope.askToConfirmDelete = function(batch){
            $scope.showDeleteBatch = true;
            $scope.batchToDelete = batch;
            console.log("Batch to Delete", batch);
        };

        $scope.deleteBatch = function(batch){
            $scope.isProcessing = true
            console.log("Deleting Batch", batch);
            $http.delete("/batches/" + batch._id)
                .success(function(deleteResult){
                    toastr.success("Batch " + batch.name + " deleted");
                    $scope.getAllSuites();
                    $scope.showDeleteBatch = false;
                    $scope.isProcessing = false;
                });
        };

        $scope.saveBatch = function(batch){
            return $http.post("/batches", batch)
                .success(function(batch){
                    $scope.getAllSuites();
                    toastr.success("Batch Saved: " + batch.name);
                })
                .error(function(err){
                    alert(err);
                })
        };

        $scope.getAllSuites = function(){
            $http.get("/batches", {params:{includeResults:"true"}})
                .success(function(batches){
                             $scope.batches = batches
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
