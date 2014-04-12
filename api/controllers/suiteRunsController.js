module.exports = function(LOG, models){
    'use strict';
    var Q = require('q');
    var shared = require('./commonController')(LOG);
    var suiteRunFactory = require('./factories/suiteRunFactory');
    var SuiteRun = models.SuiteRun;

    var list = function list(){
        return Q(SuiteRun.findAll({where:{enabled:true}}));
    };

    var findById = function findById(id){
        return Q(SuiteRun.find({where:{id:id, enabled:true}, include:[
            {model:models.SnapshotDiff, include:[
                models.Image,
                {model:models.Snapshot, as:"snapshotA", include:[
                    models.Page,
                    models.Image
                ]},
                {model:models.Snapshot, as:"snapshotB", include:[
                    models.Page,
                    models.Image
                ]}
            ]}
        ]}));
    };

    var create = function create(properties, suiteId){
        return suiteRunFactory.build(properties, suiteId);
    };

    var update = function update(id, properties){
        return Q(SuiteRun.find(id)
            .success(function(suiteRun){
                return suiteRun.updateAttributes(properties);
            }));
    };

    var destroy = function destroy(id){
        return shared.softDelete(SuiteRun, id);
    };

    return {
        list:list,
        create:create,
        update:update,
        findById:findById,
        destroy:destroy
    };

};