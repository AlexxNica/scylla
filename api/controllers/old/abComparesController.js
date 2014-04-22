module.exports = function(models){
    'use strict';
    var Q = require('q');
    var ObjectId = require('mongoose').Types.ObjectId;
    var commonController = require('./commonController')(ObjectId);
    var execDeferredBridge = commonController.execDeferredBridge;


    var find = function find(){
        var deferred = Q.defer();
        models.AbCompare.find()
            //.populate({path:"result", select:"-resultA -resultB -image"})
            .exec(execDeferredBridge(deferred));
        return deferred.promise;
    };

    var findById = function findById(id, includeFullImage, includeResults){
        var deferred = Q.defer();
        var q = models.AbCompare.findOne({_id:new models.ObjectId(id)});
        var select = (includeFullImage) ? "" : "-resultA -resultB -image";
        if(includeResults){ q = q.populate({path:"results",select:select}); }
        q.exec(execDeferredBridge(deferred));
        return deferred.promise;
    };

    var update = function update(compareId, abCompare){
        var deferred = Q.defer();
        var id = new models.ObjectId(compareId);
        delete abCompare._id;
        delete abCompare.results;
        models.AbCompare.findOneAndUpdate({_id:id}, abCompare,
            execDeferredBridge(deferred));
        return deferred.promise;
    };

    var remove = function remove(compareId){
        var deferred = Q.defer();
        models.AbCompare.findOne({_id:new models.ObjectId(compareId)})
            .remove(execDeferredBridge(deferred));
        return deferred.promise;
    };

    var createNew = function createNew(abCompareJSON){
        var abCompare = new models.AbCompare(abCompareJSON);
        abCompare.qSave = Q.nfbind(abCompare.save.bind(abCompare));
        return abCompare.qSave();
    };

    var addResultToCompare = function addResultToCompare(abCompareId, result) {
        return models.AbCompare.qFindOne({_id: new models.ObjectId(abCompareId)})
            .then(function(abCompare){
                abCompare.results.push(result);
                abCompare.thumbA = result.thumbA;
                abCompare.thumbB = result.thumbB;
                abCompare.qSave = Q.nfbind(abCompare.save.bind(abCompare));
                return abCompare.qSave()
                    .then(commonController.first);
            });

    };


    return {
        find:find,
        findById:findById,
        update:update,
        remove:remove,
        createNew:createNew,
        addResultToCompare:addResultToCompare
    };

};
