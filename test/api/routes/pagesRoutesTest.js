var expect = require('chai').expect;
var assert = require('assert');
var Mocha = require('mocha');

var host = "localhost";
var port = "3000";

var h = require('../util/asyncHelpers.js')(host, port);

describe("Pages", function(){

    var createdPage;

    it('can create a page', function(){
        var page = {
            url:"http://test.com/",
            name:"Pages Routes Test Post",
            snapshots:[]
        };
        return h.getJsonObject(h.postRequest("/pages", page))
            .then(function(result){
                createdPage = result;
                expect(result).to.exist;
                expect(result.id).to.exist;
            });
    });

    it('gets an error when trying to save invalid page', function(){
        var page = {
            url:"not an url",
            name:"Pages Routes Test Post Broken"
        };
        return h.getJsonObject(h.postRequest("/pages", page))
            .then(function(result){
                return new Error("Should Have Failed");
            })
            .fail(function(error){
                expect(error).to.exist;
                expect(JSON.parse(error.message).code).to.equal("ValidationError");
            });

    });

    it('gets a list of pages', function(){
        return h.getJsonObject(h.getRequest("/pages"))
            .then(function(pages){
                expect(pages).to.be.instanceof(Array);
            });
    });

    it('can retrieve a page', function(){
        return h.getJsonObject(h.getRequest("/pages/" + createdPage.id))
            .then(function(result){
                expect(result.name).to.equal(createdPage.name);
                expect(result.url).to.equal(createdPage.url);
            });
    });

    it('can modify a page', function(){
        createdPage.name = "Pages Routes Test Modify";

        return h.getJsonObject(h.putRequest("/pages/" + createdPage.id, createdPage))
            .then(function(result){
                //console.log(require('util').inspect(result));
                expect(result.id).to.equal(createdPage.id);
                expect(result.name).to.equal(createdPage.name);
                //MySQL doesn't store MS in time stamps, so this won't ever be updated.
                //expect(result.updatedAt).to.not.equal(createdPage.updatedAt);
            });
    });

    it('can delete a page', function(){
        return h.getResponse(h.delRequest("/pages/" + createdPage.id, createdPage))
            .then(function(response){
                expect(response.status).to.equal(200);
            });
    });


});