module.exports = function(LOG, server, models, controllers){
    'use strict';
    var utils = require('./routeUtils');



    /*

    server.get('/reports/:reportId/run', function(req, res, next){
        controllers.charybdis.executeOnReport(req.params.reportId)
            .then(utils.success(res, next), utils.fail(res, next));
    });

    server.get('/batches/:batchId/run', function(req, res, next) {
        controllers.charybdis.executeOnBatch(req.params.batchId)
            .then(utils.success(res, next), utils.fail(res, next));
    });

    server.get('/abcompares/:compareId/run', function(req, res, next) {
        controllers.charybdis.executeABCompare(req.params.compareId)
            .then(utils.success(res, next), utils.fail(res, next));
    });
    */
};