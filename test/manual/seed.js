var Q = require('q');

module.exports = function(controllers){
    return controllers.pages.create({
        name:"Always Changes",
        url:"http://127.0.0.1:3000/testFodder/simpleChanges.html"
    }).then(function(page){
        console.log("Page Created, Starting snapshot creation for id: " + page.id);
        return Q.all([
            controllers.snapshots.create({},page.id),
            controllers.snapshots.create({},page.id)
        ]).spread(function(snapA, snapB){
            console.log("Snapshots Captured: " + snapA.id + ", " + snapB.id);
            return controllers.snapshotDiffs.findOrCreate(snapA.id, snapB.id);
        })
    });
};