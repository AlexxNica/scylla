module.exports = function(log, server, models, controllers){
    'use strict';
    var utils = require('./routeUtils');

    server.get('/suites/:suiteId/masters', function(req, res, next) {
        controllers.masterSnapshots.findById(req.params.suiteId)
            .then(function(suite){
                console.log("Found Suite, Looking for masters");
                return suite.getMasterSnapshots()
                    .then(utils.success(res, next))
            })
            .fail(utils.fail(res, next));

    });

    server.post('/suites/:suiteId/master', function(req, res, next) {
        controllers.masterSnapshots.create(req.body, parseInt(req.params.suiteId, 10))
            .then(utils.success(res, next))
            .fail(utils.fail(res, next));

    });


    server.get('/masters', function(req, res, next) {
        controllers.snapshots.list()
            .then(utils.success(res, next))
            .fail(utils.fail(res, next));
    });

    server.get('/masters/:masterId', function(req, res, next) {
        controllers.snapshots.findById(req.params.masterId)
            .then(utils.success(res, next))
            .fail(utils.fail(res, next));

    });

    server.get('/masters/:masterId/image', function(req, res, next) {
        controllers.snapshots.findById(req.params.masterId)
            .then(utils.success(res, next))
            .fail(utils.fail(res, next));

    });

    server.get('/masters/:masterId/thumb', function(req, res, next) {
        controllers.snapshots.findById(req.params.masterId)
            .then(utils.success(res, next))
            .fail(utils.fail(res, next));

    });

    server.put('/masters/:masterId', function(req, res, next) {
        controllers.snapshots.update(req.params.masterId, req.body)
            .then(utils.success(res, next))
            .fail(utils.fail(res, next));

    });

    server.del('/masters/:masterId', function(req, res, next) {
        controllers.snapshots.destroy(req.params.masterId)
            .then(utils.successEmptyOk(res, next))
            .fail(utils.fail(res, next));

    });


};
