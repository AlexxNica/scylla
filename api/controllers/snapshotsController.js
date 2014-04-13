module.exports = function(LOG, models, controllers){
    'use strict';
    var Q = require('q');
    var shared = require('./commonController')(LOG);
    var snapshotFactory = require('./factories/snapshotFactory');


    var list = function list(){
        return Q(models.Snapshot.findAll({include:[models.Image]}));
    };

    var findById = function findById(id){
        return Q(models.Snapshot.find({where:{id:id},
            include:[
                models.Page,
                models.Image,
                {
                    model:models.MasterSnapshot,
                    where:{deletedAt:null}
                },
                {model:models.SnapshotDiff, as:"snapshotDiffA", foreignKey:"snapshotAId"},
                {model:models.SnapshotDiff, as:"snapshotDiffB", foreignKey:"snapshotBId"}
            ]
        }));
    };

    var findByPageId = function findByPageId(id){
        return Q(models.Snapshot.find({where:{PageId:id}, include:[models.Image]}));
    };

    var create = function create(pageId, properties){
        return snapshotFactory.buildAndExecute(pageId, properties);
    };

    var update = function update(id, properties){
        return Q(models.Snapshot.find(id)
            .success(function(snapshot){
                return snapshot.updateAttributes(properties);
            }));
    };

    var destroy = function destroy(id){
        return shared.softDelete(models.Snapshot, id);
    };

    return {
        list:list,
        create:create,
        update:update,
        findById:findById,
        findByPageId:findByPageId,
        destroy:destroy
    };

};