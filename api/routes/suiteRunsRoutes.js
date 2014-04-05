module.exports = function(log, server, models, controllers){
    'use strict';
    var utils = require('./routeUtils')(models);

    server.get('/suiteRuns', function(req, res, next) {
        controllers.suiteRuns.list()
            .then(utils.success(res, next))
            .fail(utils.fail(res, next));

    });

    server.get('/suites/:suiteId/suiteRuns', function(req, res, next) {
        controllers.suiteRuns.findBySuite(req.params.suiteId)
            .then(utils.success(res, next))
            .fail(utils.fail(res, next));

    });

    server.get('/suiteRuns/:id', function(req, res, next) {
        controllers.suiteRuns.findById(req.params.id)
            .then(utils.success(res, next))
            .fail(utils.fail(res, next));

    });

    server.get('/suites/:suiteId/suiteRuns/:id', function(req, res, next) {
        controllers.suiteRuns.findById(req.params.id)
            .then(utils.success(res, next))
            .fail(utils.fail(res, next));

    });

    server.post('/suiteRuns', function(req, res, next) {
        controllers.suiteRuns.create(req.body)
            .then(utils.success(res, next))
            .fail(utils.fail(res, next));

    });

    server.post('/suites/:suiteId/suiteRuns', function(req, res, next) {
        controllers.suiteRuns.create(req.body, req.params.suiteId)
            .then(function(value){
                return controllers.suiteRuns.findById(value.id)
                    .then(utils.success(res, next));
            })
            .fail(utils.fail(res, next));

    });

    server.put('/suiteRuns/:id', function(req, res, next) {
        console.log("Updating");
        controllers.suiteRuns.update(req.params.id, req.body)
            .then(utils.success(res, next))
            .fail(utils.fail(res, next));

    });
    server.put('/suites/:suiteId/suiteRuns/:id', function(req, res, next) {
        console.log("Updating");
        controllers.suiteRuns.update(req.params.id, req.body)
            .then(utils.success(res, next))
            .fail(utils.fail(res, next));

    });

    server.del('/suiteRuns/:id', function(req, res, next) {
        controllers.suiteRuns.destroy(req.params.id)
            .then(utils.successEmptyOk(res, next))
            .fail(utils.fail(res, next));

    });

    server.del('/suites/:suiteId/suiteRuns/:id', function(req, res, next) {
        controllers.suiteRuns.destroy(req.params.id)
            .then(utils.successEmptyOk(res, next))
            .fail(utils.fail(res, next));

    });


};
