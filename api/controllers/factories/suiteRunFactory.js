var LOG, controllers, models;

var Q = require('q');
var Qe = require('charybdis')().qExtension;
var merge = require('merge');

module.exports = function SuiteRunFactory(){

    var init = function init(LOG_in, models_in, controllers_in){
        LOG = LOG_in;
        models = models_in;
        controllers = controllers_in;
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
                suiteRun.save(),
                controllers.suites.findById(suiteId)
            ]).spread(function(suiteRun, theSuite){
                suite = theSuite;
//Get all Page/Master Combos
                return Q.all(suite.masterSnapshots.map(function(master){
//Create Preliminary Diff Object for each Master
                    return models.SnapshotDiff.create({
                        SuiteRunId:suiteRun.id,
                        SnapshotAId:master.id
                    }).then(function(diff){
                            return {
                                page:master.snapshot.page,
                                snapA:master.snapshot,
                                diff:diff
                            }
                        });
                }));

            }).then(function(workloads){
//Create new Snapshot for each Master/Diff
                var queuePromise = Qe.eachItemIn(workloads).aggregateThisPromise(function(workload){
                    console.log("Capturing New Snapshot for Page: ", workload.page.url);
                    return controllers.factories.snapshot.build({}, workload.page.id)
                        .then(function(snapB){
//Update Diff w/ Snapshot
                            workload.snapB = snapB;
                            workload.diff.setSnapshotB(snapB);
//Save Diff
                            return workload.diff.save();
                        })
                        .then(function(){
                            return workload;
                        });
                });
                return queuePromise;
            })
            .then(function(workloads){
//Create Diff Image for each diff
//Save Diff
                LOG.info("Received Completed Diffs:", completedDiffs.length);
            });
            ;
            /*
            .then(function(snapshotResult){
                snapshotRaw = merge(properties,snapshotResult);
                var imageProperties = {
                    width:800,
                    height:800,
                    info:snapshotRaw.image.info
                }
                var fileContents = snapshotRaw.image.contents;
                delete snapshotRaw.image;

                return controllers.images.create(imageProperties, pageId, fileContents)
            })
            .then(function(theImage){
                image = theImage;
                snapshotRaw.state = "Complete";
                return controllers.shared.buildAndValidateModel(models.Snapshot, snapshotRaw)
            })
            .then(function(theSnapshot){
                snapshot = theSnapshot;
                page.addSnapshot(snapshot);
                snapshot.setPage(page);
                snapshot.setImage(image);
                image.setSnapshot(snapshot);
                return Q.all([
                        snapshot.save(),
                        image.save(),
                        page.save()
                ])
            })
            .then(function(){
                return snapshot;
            })
            .fail(function(error){
                LOG.error("Error in SnapshotFactory.build", error);
            });
            */


    };

    return {
        init:init,
        build:build
    };
}();