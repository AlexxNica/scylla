module.exports = function(LOG, models){
    'use strict';
    var Q = require('q');
    var shared = require('./commonController')(LOG);
    var suiteRunFactory = require('./factories/suiteRunFactory');
    var SuiteRun = models.SuiteRun;

    var list = function list(){
        return Q(SuiteRun.findAll());
    };

    var findById = function findById(id){
        return Q(SuiteRun.find({where:{id:id}, include:[models.SnapshotDiff]}));
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
        return Q(SuiteRun.find(id)
            .success(function(suiteRun){
                return suiteRun.destroy()
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