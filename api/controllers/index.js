
var initControllers = function initControllers(LOG, models, imagePath){

    var controllers = {
        shared        : require('./commonController')   (LOG),
        suites         : require('./suitesController')    (LOG, models),
        masterSnapshots         : require('./masterSnapshotsController')    (LOG, models),
        pages         : require('./pagesController')    (LOG, models),
        snapshots     : require('./snapshotsController')(LOG, models),
        charybdis     : require('./charybdisController')(LOG, models),
        images        : require('./imagesController')   (LOG, models, imagePath)
    };
    var factories = {
        snapshot      : require('./factories/snapshotFactory').init (LOG, models, controllers)
    };
    controllers.factories = factories;
    return controllers;
};
module.exports = initControllers;