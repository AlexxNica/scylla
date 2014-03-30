module.exports = function(LOG, models, controllers){
    'use strict';
    var Q = require('q');
    var shared = require('./commonController')(LOG);
    var SnapshotDiff = models.SnapshotDiff;
    var snapshotDiffFactory = require('./factories/snapshotDiffFactory');

    var fullProperties = [
        models.Image,
        {model:models.Snapshot, as:"snapshotA", include:[
            models.Image
        ]},
        {model:models.Snapshot, as:"snapshotB", include:[
            models.Image
        ]}
    ];

    var list = function list(){
        return Q(SnapshotDiff.findAll({include:[models.Image]}));
    };

    var findById = function findById(id){
        return Q(SnapshotDiff.find({where:{id:id}, include:fullProperties}));
    };

    var findOrCreate = function findOrCreate(snapshotAId, snapshotBId){
        return Q(SnapshotDiff.findByTwoIds(snapshotAId, snapshotBId, fullProperties))
            .then(function(diff){
                if(diff) return Q.resolve(diff);
                return Q.all([
                    models.Snapshot.find(snapshotAId),
                    models.Snapshot.find(snapshotBId)
                ]).spread(function(snapA, snapB){
                    return snapshotDiffFactory.build(snapA.id, snapB.id)
                        .then(function(queuedDiff){
                            console.log("Queued Diff: " + require('util').inspect(queuedDiff));
                            return snapshotDiffFactory.execute(queuedDiff.id);
                        })
                })

            });
    };

    var execute = function execute(diffId){
        return snapshotDiffFactory.execute(diffId);
    };

    var update = function update(id, properties){
        LOG.info("Updating Snapshot: " + id);
        return Q(SnapshotDiff.find({where:{id:id}, include:fullProperties})
            .success(function(snapshotDiff){
                return snapshotDiff.updateAttributes(properties);
            }));
    };

    var destroy = function destroy(id){
        return Q(SnapshotDiff.find(id)
            .success(function(snapshotDiff){
                return snapshotDiff.destroy()
                    .success(function(){
                        return undefined;
                    });
            }));
    };

    return {
        list:list,
        findOrCreate:findOrCreate,
        execute:execute,
        update:update,
        findById:findById,
        destroy:destroy
    };

};