module.exports = function(LOG, models){
    'use strict';
    var Q = require('q');
    var shared = require('./commonController')(LOG);
    var abCompareDiffFactory = require('./factories/abCompareDiffFactory');

    var compareProperties = [
        {
            model:models.Page,
            as:"pageA",
            include:[
                {model:models.Snapshot}
            ]
        },{
            model:models.Page,
            as:"pageB",
            include:[
                {model:models.Snapshot}
            ]
        },{
            model:models.SnapshotDiff, include:[
                models.Image,
                {model:models.Snapshot, as:"snapshotA", include:[
                    models.Image
                ]},
                {model:models.Snapshot, as:"snapshotB", include:[
                    models.Image
                ]}
            ]}
    ];

    var list = function list(){
        return Q(models.ABCompare.findAll({
            include:compareProperties
        }));
    };

    var findById = function findById(id){
        return Q(models.ABCompare.find({where:{id:id}, include:compareProperties
        }));
    };

    var create = function create(properties){
        return shared.buildAndValidateModel(models.ABCompare, properties);
    };

    var run = function run(abCompareId){
        return abCompareDiffFactory.buildAndExecute(abCompareId);
    };

    var update = function update(id, properties){
        return Q(models.ABCompare.find(id)
            .success(function(compare){
                return compare.updateAttributes(properties);
            }));
    };

    var destroy = function destroy(id){
        return shared.softDelete(models.ABCompare, id);
    };

    return {
        list:list,
        create:create,
        run:run,
        update:update,
        findById:findById,
        destroy:destroy
    };

};