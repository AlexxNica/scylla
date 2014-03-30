var expect = require('chai').expect;
var assert = require('assert');
var Mocha = require('mocha');

var host = "localhost";
var port = "3000";

var h = require('../util/asyncHelpers.js')(host, port);

describe("Snapshot Diffs", function(){
    var snapPage, snapA, snapB;
    var createdSnapshotDiff;
    var snapsBaseUri = function(page){ return "/pages/" + page.id + "/snapshots"};
    var snapDiffsUri = function(snapA, snapB){ return "/snapshots/" + snapA.id + "/.../" + snapB.id};

    /* Snapshots tests may fail if pages aren't working correctly */

    before(function(done){
        this.timeout(10000);
        var page = {
            url:"http://127.0.0.1:3000/testFodder/simpleChanges.html",
            name:"Snapshot Diffs Routes Test",
            state:"Complete"
        };
        return h.getJsonObject(h.postRequest("/pages", page))
            .then(function(result){
                snapPage = result;
                return h.getJsonObject(h.postRequest(snapsBaseUri(snapPage), {}))
            }).then(function(snapAResult){
                snapA = snapAResult;
                return h.getJsonObject(h.postRequest(snapsBaseUri(snapPage), {}))
            }).then(function(snapBResult){
                snapB = snapBResult;
                done();
            });
    });

    it('can create a snapshot Diff', function(){
        this.timeout(5000);
        return h.getJsonObject(h.getRequest(snapDiffsUri(snapA, snapB)))
            .then(function(result){
                createdSnapshotDiff = result;
                expect(result).to.exist;
                expect(result.id).to.exist;
            });
    });

    it('gets a list of snapshot diffs', function(){
        return h.getJsonObject(h.getRequest("/snapshotDiffs"))
            .then(function(snapshots){
                expect(snapshots).to.be.instanceof(Array);
                expect(snapshots.length).to.be.greaterThan(0);
            });
    });


    it('can retrieve a snapshot diff', function(){
        //console.log(require('util').inspect(createdSnapshot));
        return h.getJsonObject(h.getRequest("/snapshotDiffs/" + createdSnapshotDiff.id))
            .then(function(result){
                expect(result.ImageId).to.equal(createdSnapshotDiff.ImageId);
                expect(result.SnapshotAId).to.equal(createdSnapshotDiff.SnapshotAId);
                expect(result.SnapshotBId).to.equal(createdSnapshotDiff.SnapshotBId);
                expect(result.distortion.toString()).to.equal(createdSnapshotDiff.distortion.toString());
                expect(result.createdAt).to.equal(createdSnapshotDiff.createdAt);
                expect(result.updatedAt).to.equal(createdSnapshotDiff.updatedAt);
            });
    });

    it('can modify a snapshot diff', function(){
        createdSnapshotDiff.notes = "Snapshots Routes Test Modify";
        return h.getJsonObject(h.putRequest("/snapshotDiffs/" + createdSnapshotDiff.id, createdSnapshotDiff))
            .then(function(result){
                expect(result.id).to.equal(createdSnapshotDiff.id);
                expect(result.notes).to.equal(createdSnapshotDiff.notes);
            });
    });

    it('can delete a snapshot', function(){
        return h.getResponse(h.delRequest("/snapshotDiffs/" + createdSnapshotDiff.id, createdSnapshotDiff))
            .then(function(response){
                expect(response.status).to.equal(200);
            });
    });
});