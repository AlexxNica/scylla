var Q = require('q');

module.exports = function(controllers){
    return Q.all([
        controllers.pages.create({
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
        }),
        Q.all([
            controllers.suites.create({
                name:"Default Suite"
            }),
            controllers.pages.create({
                name:"First Page",
                url:"http://127.0.0.1:3000/testFodder/simpleChanges.html"
            }),
            controllers.pages.create({
                name:"Second Page",
                url:"http://127.0.0.1:3000/testFodder/simpleChanges.html"
            }),
            controllers.pages.create({
                name:"Third Page",
                url:"http://127.0.0.1:3000/testFodder/simpleChanges.html"
            })
        ]).spread(function(suite,firstPage,secondPage,thirdPage){
            return Q.all([
                controllers.snapshots.create({}, firstPage.id),
                controllers.snapshots.create({}, secondPage.id),
                controllers.snapshots.create({}, thirdPage.id)
            ]).spread(function(firstSnap, secondSnap, thirdSnap){
                return Q.all([
                    controllers.masterSnapshots.create({SnapshotId: firstSnap.id}, suite.id),
                    controllers.masterSnapshots.create({SnapshotId: secondSnap.id}, suite.id),
                    controllers.masterSnapshots.create({SnapshotId: thirdSnap.id}, suite.id)
                ]);
            }).then(function(){
                return controllers.suiteRuns.create({}, suite.id);
            })
        })

    ])
};