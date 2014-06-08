var LOG, controllers, models;
var ValidationError;

var Q = require('q');
var merge = require('merge');

module.exports = function SnapshotDiffFactory(){

    var init = function init(LOG_in, models_in, controllers_in){
        LOG = LOG_in.child({factory:"SnapshotDiffFactory"});
        models = models_in;
        controllers = controllers_in;
        ValidationError = controllers.shared.ValidationError;
        LOG.info("Snapshot Diff Factory Initialized");
    };

    var execute = function execute(snapshotDiffId){
        LOG.info("Executing Snapshot Diff on: " + snapshotDiffId);
        var diff;
        return controllers.snapshotDiffs.findById(snapshotDiffId)
            .then(function(foundDiff){
                diff = foundDiff;
                if(diff.state != models.SnapshotDiff.QUEUED){
                    return Q.reject(
                        new ValidationError("Diff cannot be executed when in state: " + diff.state))
                }
                if(!diff.snapshotA || diff.snapshotA.state != models.Snapshot.COMPLETE){
                    return Q.reject(
                        new ValidationError("Snapshot " + diff.snapshotAId +
                                                        " is in invalid state: " + diff.snapshotA))
                }
                if(! diff.snapshotB || diff.snapshotB.state != models.Snapshot.COMPLETE){
                    return Q.reject(
                        new ValidationError("Snapshot " + diff.snapshotBId +
                                                        " is in invalid state: " + diff.snapshotB))
                }
                LOG.info("Retrieving Images: ", diff.snapshotA.image.url, diff.snapshotB.image.url);
                diff.state = models.SnapshotDiff.CAPTURING;
                return Q.all([
                    controllers.images.getImageContents(diff.snapshotA.image.url),
                    controllers.images.getImageContents(diff.snapshotB.image.url),
                    diff.save()
                ]);
            }).spread(function(imageAContents, imageBContents, savedDiff) {
                LOG.info("Launching Charybdis to diff snapshots");
                return controllers.charybdis.diffTwoSnapshots(imageAContents, imageBContents);
            }).then(function(diffResult) {
                LOG.info("Diff generated, saving Image");
                diff.distortion = diffResult.distortion;
                diff.warning = diffResult.warning;
                diff.output =  JSON.stringify(diffResult.info);

                var imageProperties = {
                    width : 800,
                    height: 800,
                    info  : diffResult.image.info
                };
                return controllers.images.createDiff(imageProperties, diffResult.image.contents);
            }).then(function(theImage){
                diff.setImage(theImage);
                diff.state = models.SnapshotDiff.COMPLETE;
                return diff.save();
            }).fail(function(error){
                LOG.error("Error executing on Diff: ", error);
                diff.output = error.toString();
                diff.state = models.SnapshotDiff.FAILURE;
                return diff.save().then(function(){Q.reject(error);});
            });
    };

    var build = function build(snapshotAId, snapshotBId, properties){
        if(!controllers && !models){
            throw new Error("Factory must be initialized first");
        }

        if(!snapshotAId || !snapshotBId){
            return Q.reject(new controllers.shared.ValidationError('SnapshotA and SnapshotB are required'));
        }

        properties = properties || {};
        properties.state = models.SnapshotDiff.QUEUED;
        LOG.info("Building Snapshot Diff", snapshotAId, snapshotBId, properties);
        return Q.all([
            controllers.shared.buildAndValidateModel(models.SnapshotDiff, properties),
            controllers.snapshots.findById(snapshotAId),
            controllers.snapshots.findById(snapshotBId)
        ]).spread(function(diff, snapA, snapB){
            diff.setSnapshotA(snapA);
            diff.setSnapshotB(snapB);
            return Q.all([
                diff.save(),
                snapA.save(),
                snapB.save()
            ]).spread(function(diff){
                return diff;
            })
        });

    };

    var buildAndExecute = function(snapAId, snapBId){
        return build(snapAId, snapBId)
            .then(function(diff){return execute(diff.id);});
    };



    return {
        init:init,
        build:build,
        execute:execute,
        buildAndExecute:buildAndExecute
    };
}();