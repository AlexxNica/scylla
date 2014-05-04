module.exports = function(log, server, models, controllers){
    'use strict';
    var utils = require('./routeUtils')(log, models);

    server.get('/abcompares', function(req, res, next) {
        controllers.abCompares.list()
            .then(utils.success(res, next))
            .fail(utils.fail(res, next));

    });

    server.get('/abcompares/:id', function(req, res, next) {
        controllers.abCompares.findById(req.params.id)
            .then(utils.success(res, next))
            .fail(utils.fail(res, next));

    });

    server.post('/abcompares', function(req, res, next) {
        controllers.abCompares.create(req.body)
            .then(utils.success(res, next))
            .fail(utils.fail(res, next));

    });

    server.put('/abcompares/:id', function(req, res, next) {
        controllers.abCompares.update(req.params.id, req.body)
            .then(utils.success(res, next))
            .fail(utils.fail(res, next));

    });

    server.del('/abcompares/:id', function(req, res, next) {
        controllers.abCompares.destroy(req.params.id)
            .then(utils.successEmptyOk(res, next))
            .fail(utils.fail(res, next));

    });


};
