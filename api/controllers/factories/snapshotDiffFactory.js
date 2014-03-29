var LOG, controllers, models;

var Q = require('q');
var Qe = require('charybdis')().qExtension;
var merge = require('merge');

module.exports = function SnapshotDiffFactory(){

    var init = function init(LOG_in, models_in, controllers_in){
        LOG = LOG_in.child({factory:"SnapshotDiffFactory"});
        models = models_in;
        controllers = controllers_in;
        LOG.info("Snapshot Diff Factory Initialized");
    };
    //controllers.factories.diff.shortcut(1,3)
    var shortcut = function(snapAId, snapBId){
        return Q.all([
            models.Snapshot.find(snapAId),
            models.Snapshot.find(snapBId)
        ]).spread(function(snapA, snapB){
            //console.log(require('util').inspect(snapA));
            console.log("Executing with Snapshots: " + snapA.id, snapB.id);
            return build(snapA, snapB);
        })
    };

    var build = function build(snapshotA, snapshotB){
        LOG.info("Building Snapshot Diff");
        if(!controllers && !models){
            throw new Error("Factory must be initialized first");
        }

        if(!snapshotA || !snapshotB){
            return Q.reject(new controllers.shared.ValidationError('SnapshotA and SnapshotB are required'));
        }
        var properties = {
            SnapshotAId: snapshotA.id,
            SnapshotBId: snapshotB.id
        };

        var diffRaw;


        return Q.all([
            snapshotA.getImage(),
            snapshotB.getImage()
        ]).spread(function(imageA, imageB){
            LOG.info("Retrieved Images: ", imageA.url, imageB.url);
            return Q.all([
                controllers.images.getImageContents(imageA.url),
                controllers.images.getImageContents(imageB.url)
            ]);
        }).spread(function(imageAContents, imageBContents) {
            LOG.info("Launching Charybdis to diff snapshots: " + typeof imageAContents);
            return controllers.charybdis.diffTwoSnapshots(imageAContents, imageBContents);
        }).then(function(diffResult) {
            LOG.info("Diff generated, saving Image");
            //console.log(require('util').inspect(diffResult));
            diffRaw = merge(properties, diffResult);
            var imageProperties = {
                width : 800,
                height: 800,
                info  : diffRaw.image.info
            };
            //Remove image from the raw results
            var fileContents = diffRaw.image.contents;
            delete diffRaw.image;
            return controllers.images.createDiff(imageProperties, fileContents);
        }).then(function(theImage){
            diffRaw.ImageId = theImage.id;
            return controllers.shared.buildAndValidateModel(models.SnapshotDiff, diffRaw);
        }).fail(function(error){
            LOG.error("Snapshot Diff Factory Failed",error);
        })




    };

    return {
        init:init,
        build:build,
        shortcut:shortcut
    };
}();