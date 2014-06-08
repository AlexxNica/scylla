var LOG, controllers, models;
var DiffFactory,SnapshotFactory;

var Q = require('q');
var Qe = require('charybdis')().qExtension;
var merge = require('merge');

module.exports = function SuiteRunFactory(){

    var init = function init(LOG_in, models_in, controllers_in){
        LOG = LOG_in;
        models = models_in;
        controllers = controllers_in;
        DiffFactory = controllers.factories.diff;
        SnapshotFactory = controllers.factories.snapshot;
        LOG.info("SuiteRun Factory Initialized");
    };

    var build = function build(suiteId, properties){
        properties = properties || {};
        LOG.info("Building Suite Run: " + suiteId);
        if(!controllers && !models){
            throw new Error("Factory must be initialized first");
        }

        if(suiteId) properties.SuiteId = suiteId;
        if(!properties.SuiteId){
            return Q.reject(new controllers.shared.ValidationError(require('util').inspect(validations)));
        }
        properties.start = new Date();

        var suiteRun = models.SuiteRun.build(properties);

        var suite;


//Create Suite Run from Suite
        return Q.all([
                controllers.suites.findById(suiteId),
                suiteRun.save()
            ]).spread(function(theSuite, theRun ) {
//Get all Page/Master Combos
//Create Preliminary Snapshot and Diff Object for each Master
                return Qe.eachItemIn(theSuite.masterSnapshots).aggregateThisPromise(function (master) {

                    return SnapshotFactory.build(master.snapshot.page.id, {})
                        .then(function(newSnapshot){
                            return DiffFactory.build(master.snapshot.id, newSnapshot.id)
                                .then(function (diff) {
                                    diff.setSuiteRun(theRun);
                                    return diff.save();
                                });
                        })
                });

            }).then(function(){
                return suiteRun;
            });
    };

    var execute = function execute(suiteRunId){
        var suiteRun;
        return Q.all([
            controllers.suiteRuns.findById(suiteRunId)
        ]).spread(function(theRun ) {
            suiteRun = theRun;

            return Qe.eachItemIn(suiteRun.snapshotDiffs).aggregateThisPromise(function(diff){
                LOG.info("Executing Snapshot #" + diff.id +
                            " for page: ", diff.snapshotA.page.name);
                return SnapshotFactory.execute(diff.snapshotB.id, {});
                return controllers.factories.diff.execute(diff.id)
            });

        }).then(function(){
            return Qe.eachItemIn(suiteRun.snapshotDiffs).aggregateThisPromise(function(diff){
                LOG.info("Executing Diff #" + diff.id +
                            " for page: ", diff.snapshotA.page.name);
                return controllers.factories.diff.execute(diff.id);
            });
        }).then(function(completedDiffs){
            LOG.info("Received Completed Diffs:", completedDiffs.length);
            return suiteRun;
        });
    };

    var buildAndExecute = function(suiteId, properties){
        return build(suiteId, properties)
            .then(function(suiteRun){
                return execute(suiteRun.id);});
    };


    return {
        init:init,
        build:build,
        execute:execute,
        buildAndExecute:buildAndExecute
    };
}();