var LOG, controllers, models;
var DiffFactory,SnapshotFactory;

var Q = require('q');
var Qe = require('charybdis')().qExtension;
var merge = require('merge');

module.exports = function ABCompareDiffFactory(){

    var init = function init(LOG_in, models_in, controllers_in){
        LOG = LOG_in;
        models = models_in;
        controllers = controllers_in;
        DiffFactory = controllers.factories.diff;
        SnapshotFactory = controllers.factories.snapshot;
        LOG.info("AB Compare Diff Factory Initialized");
    };


    var build = function build(abCompareId){
        LOG.info("Building AB Compare Diff");
        if(!controllers && !models){
            throw new Error("Factory must be initialized first");
        }

        if(!abCompareId){
            return Q.reject(new controllers.shared.ValidationError("Compare ID Must be specified"));
        }

        return controllers.abCompares.findById(abCompareId)
            .then(function(compare){
                return Qe.eachItemIn([compare.pageAId, compare.pageBId]).aggregateThisPromise(function (pageId){
                    LOG.info("Building Snapshot for: " + pageId);
                    return SnapshotFactory.build(pageId, {});
                })
                .spread(function(snapshotA, snapshotB){
                    LOG.info("Building Diff for Snapshots: " + snapshotA.id + "," + snapshotB.id);
                    return DiffFactory.build(snapshotA.id, snapshotB.id)
                        .then(function(diff){
                            diff.twoPages = true;
                            diff.setABCompare(compare);
                            return diff.save()
                        });
                });
            });
    };

    var execute = function execute(snapshotDiffId){
        LOG.info("Executing AB Compare Diff");
        return controllers.snapshotDiffs.findById(snapshotDiffId)
            .then(function(diff){
                return Qe.eachItemIn([diff.snapshotAId, diff.snapshotBId]).aggregateThisPromise(function (snapshotId){
                    return SnapshotFactory.execute(snapshotId);
                })
                .then(function(){
                    return DiffFactory.execute(diff.id);
                });
            });
    };

    var buildAndExecute = function(abCompareId){
        return build(abCompareId)
            .then(function(snapshotDiff){
                return execute(snapshotDiff.id);});
    };

    return {
        init:init,
        build:build,
        execute:execute,
        buildAndExecute:buildAndExecute
    };
}();