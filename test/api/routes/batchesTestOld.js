var expect = require('chai').expect;
var assert = require('assert');
var Mocha = require('mocha');

var host = "localhost";
var port = "3000";

var h = require('../util/asyncHelpers.js')(host, port);

describe("Batches", function(){

    it('gets a list of batches', function(){
        return h.getJsonObject(h.getRequest("/batches/"))
            .then(function(batches){
                expect(batches).to.be.instanceof(Array);
            })
    });

    it('has all of the CRUD', function(){
        var batch = {
            name:"Mocha Test Batch Creation"
        }
        var reportId;
        return h.getJsonObject(h.postRequest("/batches", batch))
            //Create
            .then(function(savedBatch){
                expect(savedBatch._id).to.exist;
                reportId = savedBatch._id;
                expect(savedBatch.name).to.equal(batch.name);
                return savedBatch;
            })
            //Update
            .then(function(savedBatch){
                var editedBatch = {
                    _id:savedBatch._id,
                    name:"Mocha Test Batch Edited"
                }
                return h.getJsonObject(h.putRequest("/batches/" + savedBatch._id, editedBatch))
                    .then(function(newEditedReport){
                        expect(newEditedReport._id).to.equal(editedBatch._id);
                        expect(newEditedReport.name).to.equal(editedBatch.name);
                        return newEditedReport;
                    })
            })
            //Read
            .then(function(savedBatch){
                return h.getJsonObject(h.getRequest("/batches/" + savedBatch._id))
                    .then(function(singleReport){
                        expect(singleReport._id).to.equal(savedBatch._id);
                        expect(singleReport.name).to.equal(savedBatch.name);
                        return savedBatch;
                    })
            })
            //Delete
            .then(function(savedBatch){
                return h.getJsonObject(h.delRequest("/batches/" + savedBatch._id, savedBatch))
                    .then(function(deletedReport){
                        expect(deletedReport._id).to.equal(savedBatch._id);
                        return deletedReport;
                    })
            })
            .then(function(deletedBatch){
                return h.getJsonObject(h.getRequest("/batches/" + deletedBatch._id))
                    .then(function(ohNo){
                        expect(ohNo).to.equal(undefined);
                        return;
                    }, function(error){
                        expect(error.message).to.equal("404");
                        return;
                    })
            })
    });

});