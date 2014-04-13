module.exports = function(log, server, models, controllers){
    'use strict';
    var utils = require('./routeUtils')(log, models);
    var snapshotDiffs = controllers.snapshotDiffs;



    server.get('/snapshotDiffs', function(req, res, next) {
        snapshotDiffs.list()
            .then(utils.success(res, next))
            .fail(utils.fail(res, next));
    });

    server.get('/snapshots/:snapA/.../:snapB', function(req, res, next) {
        snapshotDiffs.findOrCreate(req.params.snapA, req.params.snapB)
            .then(utils.success(res, next))
            .fail(utils.fail(res, next));
    });

    server.get('/snapshotDiffs/:diffId', function(req, res, next) {
        snapshotDiffs.findById(req.params.diffId)
            .then(utils.success(res, next))
            .fail(utils.fail(res, next));

    });

    server.get('/snapshotDiffs/:diffId/image', function(req, res, next) {
        snapshotDiffs.findById(req.params.diffId)
            .then(utils.respondBasedOnSnapshotState())
            .then(function(snapshot){return snapshot.image})
            .then(utils.successRedirect(res, next))
            .fail(utils.fail(res, next));

    });

    server.get('/snapshotDiffs/:diffId/thumb', function(req, res, next) {
        snapshotDiffs.findById(req.params.diffId)
            .then(utils.respondBasedOnSnapshotState())
            .then(function(snapshot){return snapshot.image})
            .then(utils.successRedirect(res, next))
            .fail(utils.fail(res, next));

    });

    server.put('/snapshotDiffs/:diffId', function(req, res, next) {
        snapshotDiffs.update(req.params.diffId, req.body)
            .then(utils.success(res, next))
            .fail(utils.fail(res, next));

    });

    server.del('/snapshotDiffs/:diffId', function(req, res, next) {
        snapshotDiffs.destroy(req.params.diffId)
            .then(utils.successEmptyOk(res, next))
            .fail(utils.fail(res, next));

    });


};
