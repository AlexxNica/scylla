module.exports = function(LOG, models){
    'use strict';
    var Q = require('q');
    var shared = require('./commonController')(LOG);

    var list = function list(){
        return Q(models.Page.findAll({include:[models.Snapshot]}));
    };

    var findById = function findById(id){
        return Q(models.Page.find({where:{id:id}, include:[
            {model:models.Snapshot, include:[
                {model:models.Image},
                {model:models.MasterSnapshot},
                {model:models.SnapshotDiff, as:"snapshotDiffA", include:[
                    {model:models.Snapshot, as:"snapshotB"}
                ]},
                {model:models.SnapshotDiff, as:"snapshotDiffB", include:[
                    {model:models.Snapshot, as:"snapshotA"}
                ]}
            ]}
        ]}));
    };

    var create = function create(properties){
        return Q(models.Page.find({where:{url:properties.url}}))
            .then(function(page){
                if(page){
                    return findById(page.id);
                }
                return shared.buildAndValidateModel(models.Page, properties);
            });
    };

    var update = function update(id, properties){
        return Q(models.Page.find(id))
            .then(function(page){
                return page.updateAttributes(properties);
            })
            .then(function(page){
                return findById(page.id);
            });
    };

    var destroy = function destroy(id){
        return shared.softDelete(models.Page, id);
    };

    return {
        list:list,
        create:create,
        update:update,
        findById:findById,
        destroy:destroy
    };

};