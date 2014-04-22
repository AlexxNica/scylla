
var Sequelize = require("sequelize");

var initModels = function initModels(log, databaseConfig, sync){
    var models = {};
    var relationships = {};
    var modelInfos = {};
    var db = new Sequelize('scylla', databaseConfig.user, databaseConfig.password, databaseConfig.properties);
    var modelNames = ['page','snapshot','image','thumb', 'user', 'suite', 'suiteRun', 'masterSnapshot', 'snapshotDiff'];
    log.info("Initializing Models");

    try{
        modelNames.forEach(function(modelName){
            var modelInfo = require('./' + modelName)(Sequelize);
            modelInfos[modelInfo.name] = modelInfo;
            models[modelInfo.name] = db.define(modelInfo.name, modelInfo.schema, modelInfo.options);
            if(modelInfo.hasOwnProperty("relationships")){
                relationships[modelInfo.name] = modelInfo.relationships;
            }
            log.info("Model Initialized: " + modelInfo.name);
        });

        for(var modelName in relationships){
            log.info("Setting up Relationships for " + modelName);
            var relations = relationships[modelName];
            relations.forEach(function(relation,index,arr){
                log.info(modelName + " " + relation.kind + " " + relation.model + " " + (relation.options ? require('util').inspect(relation.options):'') );
                models[modelName][relation.kind](models[relation.model], relation.options);
            });
        }

    }catch(error){
        log.error("Error Initializing Models", error);
        db.sync({force:true});
        return models;
    }

    //TODO: Ensure this doesn't destroy data
    if(sync) db.sync();
    models.db = db;
    return models;
};
module.exports = initModels;