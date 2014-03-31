module.exports = function(log, server, models, controllers){
    'use strict';
    var utils = require('./routeUtils');

    server.get('/pages', function(req, res, next) {
        controllers.pages.list()
            .then(utils.success(res, next))
            .fail(utils.fail(res, next));

    });

    server.get('/pages/:id', function(req, res, next) {
        controllers.pages.findById(req.params.id)
            .then(utils.success(res, next))
            .fail(utils.fail(res, next));

    });
    server.get('/pages/:id/thumb', function(req, res, next) {
        controllers.snapshots.findByPageId(req.params.id)
            .then(function(snapshot){
                return snapshot.image;
            })
            .then(utils.successRedirect(res, next))
            .fail(utils.fail(res, next));

    });

    server.post('/pages', function(req, res, next) {
        controllers.pages.create(req.body)
            .then(utils.success(res, next))
            .fail(utils.fail(res, next));

    });

    server.put('/pages/:id', function(req, res, next) {
        console.log("Updating");
        controllers.pages.update(req.params.id, req.body)
            .then(utils.success(res, next))
            .fail(utils.fail(res, next));

    });

    server.del('/pages/:id', function(req, res, next) {
        controllers.pages.destroy(req.params.id)
            .then(utils.successEmptyOk(res, next))
            .fail(utils.fail(res, next));

    });


};
