module.exports = function(log, server, models, controllers){
    'use strict';
    var Q = require('q');
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
        var rawCompare = req.body;
        Q.all([
                controllers.pages.create(req.body.pageA),
                controllers.pages.create(req.body.pageB)
            ])
            .spread(function(pageA, pageB){
                rawCompare.pageAId = pageA.id;
                rawCompare.pageBId = pageB.id;
                return controllers.abCompares.create(rawCompare);
            })
            .then(utils.success(res, next))
            .fail(utils.fail(res, next));

    });

    server.post('/abcompares/:id/snapshotDiffs', function(req, res, next) {
        controllers.abCompares.run(req.params.id)
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
