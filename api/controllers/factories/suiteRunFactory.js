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

    var build = function build(properties, suiteId){
        LOG.info("Building Suite Run");
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
                suite = theSuite;
//Get all Page/Master Combos
//Create Preliminary Snapshot and Diff Object for each Master
                return Qe.eachItemIn(suite.masterSnapshots).aggregateThisPromise(function (master) {
                    return SnapshotFactory.buildAndExecute(master.snapshot.page.id, {})
                        .then(function (newSnapshot) {
                            return DiffFactory.build(master.snapshot.id, newSnapshot.id)
                                .then(function (diff) {
                                    diff.setSuiteRun(theRun);
                                    return diff.save();
                                })
                                .then(function (diff) {
                                    return {
                                        master: master,
                                        snap  : newSnapshot,
                                        diff  : diff
                                    }
                                });
                        });
                });

            }).then(function(workloads){
                return Qe.eachItemIn(workloads).aggregateThisPromise(function(workload){
                    //TODO: move snapshotting to two-stage approach.
                    console.log("Executing Diff #" + workload.diff.id +
                                " for page: ", workload.master.snapshot.page.name);
                    return controllers.factories.diff.execute(workload.diff.id)
                });
            })
            .then(function(completedDiffs){
                LOG.info("Received Completed Diffs:", completedDiffs.length);
                return suiteRun;
            });
    };

    var execute = function execute(suiteId){

    };

    return {
        init:init,
        build:build
    };
}();