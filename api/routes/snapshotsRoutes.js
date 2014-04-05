module.exports = function(log, server, models, controllers){
    'use strict';
    var utils = require('./routeUtils')(models);

    server.get('/pages/:pageId/snapshots', function(req, res, next) {
        controllers.pages.findById(req.params.pageId)
            .then(function(page){
                console.log("Found Page, Looking for snapshots");
                return page.getSnapshots()
                    .then(utils.success(res, next))
            })
            .fail(utils.fail(res, next));

    });

    server.post('/pages/:pageId/snapshots', function(req, res, next) {
        controllers.snapshots.create(req.body, parseInt(req.params.pageId, 10))
            .then(utils.success(res, next))
            .fail(utils.fail(res, next));

    });


    server.get('/snapshots', function(req, res, next) {
        controllers.snapshots.list()
            .then(utils.success(res, next))
            .fail(utils.fail(res, next));
    });

    server.get('/snapshots/:snapId', function(req, res, next) {
        controllers.snapshots.findById(req.params.snapId)
            .then(utils.success(res, next))
            .fail(utils.fail(res, next));

    });

    server.get('/snapshots/:snapId/image', function(req, res, next) {
        controllers.snapshots.findById(req.params.snapId)
            .then(utils.respondBasedOnSnapshotState())
            .then(function(snapshot){return snapshot.image})
            .then(utils.success(res, next))
            .fail(utils.fail(res, next));

    });

    server.get('/snapshots/:snapId/image/file', function(req, res, next) {
        controllers.snapshots.findById(req.params.snapId)
            .then(utils.respondBasedOnSnapshotState())
            .then(function(snapshot){return snapshot.image})
            .then(utils.successRedirect(res, next))
            .fail(utils.fail(res, next));
    });

    /*
    //TODO: Implement Thumbnails.
    server.get('/snapshots/:snapId/image/thumb', function(req, res, next) {
        controllers.snapshots.findById(req.params.snapId)
            .then(utils.success(res, next))
            .fail(utils.fail(res, next));

    });

    server.get('/snapshots/:snapId/image/thumb/file', function(req, res, next) {
        controllers.snapshots.findById(req.params.snapId)
            .then(utils.respondBasedOnSnapshotState())
            .then(utils.success(res, next))
            .fail(utils.fail(res, next));

    });
    */

    server.put('/snapshots/:snapId', function(req, res, next) {
        controllers.snapshots.update(req.params.snapId, req.body)
            .then(utils.success(res, next))
            .fail(utils.fail(res, next));

    });

    server.del('/snapshots/:snapId', function(req, res, next) {
        controllers.snapshots.destroy(req.params.snapId)
            .then(utils.successEmptyOk(res, next))
            .fail(utils.fail(res, next));

    });


};
