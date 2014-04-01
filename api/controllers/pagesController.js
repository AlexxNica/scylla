module.exports = function(LOG, models){
    'use strict';
    var Q = require('q');
    var shared = require('./commonController')(LOG);

    var list = function list(){
        return Q(models.Page.findAll());
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
        return shared.buildAndValidateModel(models.Page, properties);
    };

    var update = function update(id, properties){
        return Q(models.Page.find(id)
            .success(function(page){
                return page.updateAttributes(properties);
            }));
    };

    var destroy = function destroy(id){
        return Q(models.Page.find(id)
            .success(function(page){
                return page.destroy()
                    .success(function(){
                        return undefined;
                    });
            }));
    };

    return {
        list:list,
        create:create,
        update:update,
        findById:findById,
        destroy:destroy
    };

};