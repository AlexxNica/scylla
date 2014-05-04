
var initRoutes = function initRoutes(LOG, restServer, models, controllers){

    return {
        monitoring      : require('./monitoringRoutes')     (LOG, restServer),
        suites          : require('./suitesRoutes')         (LOG, restServer, models, controllers),
        abCompares      : require('./abComparesRoutes')     (LOG, restServer, models, controllers),
        suiteRuns       : require('./suiteRunsRoutes')      (LOG, restServer, models, controllers),
        masterSnapshots : require('./masterSnapshotsRoutes')(LOG, restServer, models, controllers),
        pages           : require('./pagesRoutes')          (LOG, restServer, models, controllers),
        snapshots       : require('./snapshotsRoutes')      (LOG, restServer, models, controllers),
        snapshotDiffs   : require('./snapshotDiffsRoutes')  (LOG, restServer, models, controllers),
        charybdis       : require('./charybdisRoutes')      (LOG, restServer, models, controllers)
    };
};
module.exports = initRoutes;