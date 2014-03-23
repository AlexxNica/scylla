module.exports = function(LOG, models){
    'use strict';
    var Q = require('q');
    var shared = require('./commonController')(LOG);

    var list = function list(){
        return Q(models.Suite.findAll());
    };

    var findById = function findById(id){
        return Q(models.Suite.find(id));
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
        return Q(models.Suite.find(id)
            .success(function(suite){
                return suite.destroy()
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