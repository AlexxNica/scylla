module.exports = function(log, server, models, controllers){
    'use strict';
    var utils = require('./routeUtils');

    server.get('/suites', function(req, res, next) {
        controllers.suites.list()
            .then(utils.success(res, next))
            .fail(utils.fail(res, next));

    });

    server.get('/suites/:id', function(req, res, next) {
        controllers.suites.findById(req.params.id)
            .then(utils.success(res, next))
            .fail(utils.fail(res, next));

    });

    server.post('/suites', function(req, res, next) {
        controllers.suites.create(req.body)
            .then(utils.success(res, next))
            .fail(utils.fail(res, next));

    });

    server.put('/suites/:id', function(req, res, next) {
        console.log("Updating");
        controllers.suites.update(req.params.id, req.body)
            .then(utils.success(res, next))
            .fail(utils.fail(res, next));

    });

    server.del('/suites/:id', function(req, res, next) {
        controllers.suites.destroy(req.params.id)
            .then(utils.successEmptyOk(res, next))
            .fail(utils.fail(res, next));

    });


};
