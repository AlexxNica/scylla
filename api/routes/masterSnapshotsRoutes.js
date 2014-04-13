module.exports = function(log, server, models, controllers){
    'use strict';
    var utils = require('./routeUtils')(log, models);

    server.get('/suites/:suiteId/masterSnapshots', function(req, res, next) {
        controllers.masterSnapshots.findBySuite(req.params.suiteId)
            .then(utils.success(res, next))
            .fail(utils.fail(res, next));

    });

    server.post('/suites/:suiteId/masterSnapshots', function(req, res, next) {
        controllers.masterSnapshots.create(req.body, parseInt(req.params.suiteId, 10))
            .then(utils.success(res, next))
            .fail(utils.fail(res, next));

    });


    server.get('/masterSnapshots', function(req, res, next) {
        controllers.masterSnapshots.list()
            .then(utils.success(res, next))
            .fail(utils.fail(res, next));
    });

    server.get('/masterSnapshots/:masterId', function(req, res, next) {
        controllers.masterSnapshots.findById(req.params.masterId)
            .then(utils.success(res, next))
            .fail(utils.fail(res, next));

    });

    server.get('/masterSnapshots/:masterId/image', function(req, res, next) {
        controllers.masterSnapshots.findById(req.params.masterId)
            .then(utils.success(res, next))
            .fail(utils.fail(res, next));

    });

    server.get('/masterSnapshots/:masterId/thumb', function(req, res, next) {
        controllers.masterSnapshots.findById(req.params.masterId)
            .then(utils.success(res, next))
            .fail(utils.fail(res, next));

    });

    server.put('/masterSnapshots/:masterId', function(req, res, next) {
        controllers.masterSnapshots.update(req.params.masterId, req.body)
            .then(utils.success(res, next))
            .fail(utils.fail(res, next));

    });

    server.del('/masterSnapshots/:masterId', function(req, res, next) {
        controllers.masterSnapshots.destroy(req.params.masterId)
            .then(utils.successEmptyOk(res, next))
            .fail(utils.fail(res, next));

    });

    server.del('/suites/:suiteId/masterSnapshots/:masterId', function(req, res, next) {
        controllers.masterSnapshots.destroy(req.params.masterId)
            .then(utils.successEmptyOk(res, next))
            .fail(utils.fail(res, next));

    });


};
