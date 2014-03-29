var expect = require('chai').expect;
var assert = require('assert');
var Mocha = require('mocha');

var host = "localhost";
var port = "3000";

var h = require('../util/asyncHelpers.js')(host, port);

describe("Suites", function(){

    var createdSuite;

    it('can create a suite', function(){
        var suite = {
            name:"Suites Routes Test Post",
            UserId:null,
            schedule:null
        };
        return h.getJsonObject(h.postRequest("/suites", suite))
            .then(function(result){
                createdSuite = result;
                expect(result).to.exist;
                expect(result.id).to.exist;
            });
    });

    it('gets an error when trying to save invalid suite', function(){
        var suite = {};
        return h.getJsonObject(h.postRequest("/suites", suite))
            .then(function(result){
                return new Error("Should Have Failed");
            })
            .fail(function(error){
                expect(error).to.exist;
                expect(JSON.parse(error.message).code).to.equal("ValidationError");
            });

    });

    it('gets a list of suites', function(){
        return h.getJsonObject(h.getRequest("/suites"))
            .then(function(suites){
                delete(suites.masterSnapshots);
                expect(suites).to.be.instanceof(Array);
            });
    });

    it('can retrieve a suite', function(){
        return h.getJsonObject(h.getRequest("/suites/" + createdSuite.id))
            .then(function(result){
                expect(result).to.deep.equal(createdSuite);
            });
    });

    it('can modify a suite', function(){
        //console.log(require('util').inspect(createdPage));
        createdSuite.name = "Suites Routes Test Modify";

        return h.getJsonObject(h.putRequest("/suites/" + createdSuite.id, createdSuite))
            .then(function(result){
                //console.log(require('util').inspect(result));
                expect(result.id).to.equal(createdSuite.id);
                expect(result.name).to.equal(createdSuite.name);
                //MySQL doesn't store MS in time stamps, so this won't ever be updated.
                //expect(result.updatedAt).to.not.equal(createdPage.updatedAt);
            });
    });

    it('can delete a suite', function(){
        return h.getResponse(h.delRequest("/suites/" + createdSuite.id, createdSuite))
            .then(function(response){
                expect(response.status).to.equal(200);
            });
    });


});