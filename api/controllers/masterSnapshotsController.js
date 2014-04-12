module.exports = function(LOG, models, controllers){
    'use strict';
    var Q = require('q');
    var shared = require('./commonController')(LOG);
    var MasterSnapshot = models.MasterSnapshot;

    var list = function list(){
        return Q(MasterSnapshot.findAll({
            where:{enabled:true},
            include:[
                {model:models.Snapshot, include:[
                    {model:models.Page}
                ]}
                , models.Suite
            ]
        }));
    };

    var findById = function findById(id){
        return Q(MasterSnapshot.find({where:{id:id, enabled:true}, include:[
            {model:models.Snapshot, include:[
                {model:models.Page}
            ]},
            models.Suite]}));
    };

    var findBySuite = function findBySuite(suiteId){
        return Q(MasterSnapshot.find({where:{SuiteId:suiteId, enabled:true}, include:[models.Snapshot]}))
    };

    var create = function create(properties, suiteId){
        properties.SuiteId = suiteId; // Just in case it wasn't set correctly
        if(!properties.SuiteId || !properties.SnapshotId){
            return Q.reject(new shared.ValidationError("SuiteId and SnapshotId are required"))
        }
        return shared.buildAndValidateModel(MasterSnapshot, properties)
            .then(function(master){
                return findById(master.id);
            });
    };

    var update = function update(id, properties){
        return Q(MasterSnapshot.find(id)
            .success(function(master){
                return master.updateAttributes(properties);
            }));
    };

    var destroy = function destroy(id){
        return shared.softDelete(MasterSnapshot, id);
    };

    return {
        list:list,
        create:create,
        update:update,
        findById:findById,
        findBySuite:findBySuite,
        destroy:destroy
    };

};