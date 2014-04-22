module.exports = function(models){
    'use strict';
    var Q = require('q');
    var ObjectId = require('mongoose').Types.ObjectId;
    var commonController = require('./commonController')(ObjectId);

    var execDeferredBridge = commonController.execDeferredBridge;
    var execDeferredDeleteBridge = commonController.execDeferredDeleteBridge;

    var find = function find(){
        var deferred = Q.defer();
        models.AbCompareResult.find()
            //.populate("report")
            .exec(execDeferredBridge(deferred));
        return deferred.promise;
    };

    var findById = function findById(resultId){
        var deferred = Q.defer();
        models.AbCompareResult.findOne({_id:new ObjectId(resultId)})
            //.populate("report")
            .exec(execDeferredBridge(deferred));
        return deferred.promise;
    };

    var update = function update(resultId, result){
        var deferred = Q.defer();
        var id = new ObjectId(resultId);
        delete result._id;
        models.AbCompareResult.findOneAndUpdate({_id:id}, result,
            execDeferredBridge(deferred));
        return deferred.promise;
    };

    var remove = function remove(resultId){
        var deferred = Q.defer();
        models.AbCompareResult.findOne({_id:new models.ObjectId(resultId)})
            .remove(execDeferredDeleteBridge(deferred));
        return deferred.promise;

    };

    var createNew = function createNew(resultJSON){
        var result = new models.AbCompareResult(resultJSON);
        result.qSave = Q.nfbind(result.save.bind(result));
        return result.qSave()
            .then(commonController.first);
    };

    return {
        find:find,
        findById:findById,
        update:update,
        remove:remove,
        createNew:createNew
    };
};
