module.exports = function() {
    'use strict';
    var schedule = require('node-schedule');
    var jobs = {};

    var isUndef = function(something){
        return typeof something === "undefined";
    };

    var removeBatchFromSchedule = function(batchId) {
        if(jobs[batchId]){
            jobs[batchId].cancel();
        }
    };

    var addBatchToSchedule = function (batch, func) {
        removeBatchFromSchedule(batch._id);

        if(!batch.scheduleEnabled){
            return;
        }
        if(isUndef(batch.schedule) ||
           isUndef(batch.schedule.days) ||
           isUndef(batch.schedule.hour) ||
           isUndef(batch.schedule.minute)){ return; }

        var rule        = new schedule.RecurrenceRule();
        rule.dayOfWeek  = batch.schedule.days;
        rule.hour       = batch.schedule.hour;
        rule.minute     = batch.schedule.minute;
        jobs[batch._id] = schedule.scheduleJob(rule, func);
        console.log("Batch In Schedule: ", batch._id, batch.schedule);
        /*
        //For debugging, we just set the schedule for 5 seconds in the future.
        var d = new Date();
        d.setSeconds(d.getSeconds() + 5);
        jobs[batch._id] = schedule.scheduleJob(d, func);
        */

    };

    return {
        removeBatchFromSchedule:removeBatchFromSchedule,
        addBatchToSchedule:addBatchToSchedule
    };
};