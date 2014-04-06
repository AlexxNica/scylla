var LOG, controllers, models;
var ValidationError;

var Q = require('q');
var merge = require('merge');

module.exports = function SnapshotFactory(){

    var init = function init(LOG_in, models_in, controllers_in){
        LOG = LOG_in;
        models = models_in;
        controllers = controllers_in;
        ValidationError = controllers.shared.ValidationError;
        LOG.info("Snapshot Factory Initialized");
    };

    var build = function build(pageId, properties ){
        LOG.info("Building Snapshot");
        if(!controllers && !models){
            throw new Error("Factory must be initialized first");
        }
        if(!pageId){
            return Q.reject(new controllers.shared.ValidationError('PageId is required'));
        }

        var page, snapshotRaw, snapshot, image;

        properties = properties || {};
        properties.state = models.Snapshot.QUEUED;
        return Q.all([
            controllers.shared.buildAndValidateModel(models.Snapshot, properties),
            controllers.pages.findById(pageId)
        ]).spread(function(snapshot, page){
            snapshot.setPage(page);
            return Q.all([
                snapshot.save(),
                page.save()
            ]).spread(function(snapshot, page){return snapshot;});
        });

    };

    var execute = function execute(snapshotId){
        var snapshot;
        return controllers.snapshots.findById(snapshotId)
            .then(function(theSnapshot){
                LOG.info("Loaded Snapshot: ", theSnapshot);
                snapshot = theSnapshot;
                if(snapshot.state != 'Queued'){
                    return Q.reject(
                        new ValidationError("Snapshot cannot be captured when in state: " + snapshot.state));
                }
                snapshot.state = models.Snapshot.CAPTURING;
                return snapshot.save().then(function(){
                    return controllers.charybdis.webPageToSnapshot(snapshot.page.url, 800, 800);
                });
            })
            .then(function(snapshotResult){
                LOG.info('Charybdis captured screenshot');
                console.log(require('util').inspect(snapshotResult));

                snapshot.console = snapshotResult.console;
                snapshot.message = snapshotResult.message;

                var imageProperties = {
                    width:800,
                    height:800,
                    info:snapshotResult.image.info
                };
                var fileContents = snapshotResult.image.contents;

                return Q.all([
                        controllers.images.createSnapshot(imageProperties, snapshot.PageId, fileContents),
                        snapshot.save()
                    ]).spread(function(image){
                        LOG.info('Image created for snapshot');

                        snapshot.setImage(image);
                        image.setSnapshot(snapshot);
                        snapshot.state = models.Snapshot.COMPLETE;
                        return Q.all([
                            image.save(),
                            snapshot.save()
                        ])
                    })
                    .then(function(){
                        return snapshot;
                    });
            }, function(error){
                LOG.error("Charybdis Error:", error);
                snapshot.state = models.Snapshot.FAILURE;
                snapshot.message = error.message;
                snapshot.console = error.console;
                return snapshot.save();
            })
            .fail(function(error){
                console.log(require('util').inspect(error));
                LOG.error("Error in SnapshotFactory.build", error);
            });
    };

    var buildAndExecute = function(pageId, properties){
        return build(pageId, properties)
            .then(function(snapshot){
                return execute(snapshot.id);});
    };

    return {
        init:init,
        build:build,
        execute:execute,
        buildAndExecute:buildAndExecute
    };
}();