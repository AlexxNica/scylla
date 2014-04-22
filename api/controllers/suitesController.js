module.exports = function(LOG, models){
    'use strict';
    var Q = require('q');
    var shared = require('./commonController')(LOG);

    var list = function list(){
        return Q(models.Suite.findAll());
    };

    var findById = function findById(id){
        return Q(models.Suite.find({where:{id:id}, include:[
            {
                model:models.MasterSnapshot,
                include:[
                    {model:models.Snapshot, include:[
                        {model:models.Page}
                    ]}
                ]
            },
            {
                model:models.SuiteRun,
                include:[
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
                ]
            }
        ]}));
    };

    var create = function create(properties){
        return shared.buildAndValidateModel(models.Suite, properties);
    };

    var update = function update(id, properties){
        return Q(models.Suite.find(id)
            .success(function(suite){
                return suite.updateAttributes(properties);
            }));
    };

    var destroy = function destroy(id){
        return shared.softDelete(models.Suite, id);
    };

    return {
        list:list,
        create:create,
        update:update,
        findById:findById,
        destroy:destroy
    };

};