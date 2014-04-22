var expect = require('chai').expect;
var assert = require('assert');
var Mocha = require('mocha');

var host = "localhost";
var port = "3001";

var h = require('../util/asyncHelpers.js')(host, port);

var unitTestImage       = "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";
var unitTestImageEdited = "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";
var unitTestImageDiffed = "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";


describe("Report Results", function(){

    it('gets a list of report results', function(){
        return h.getJsonObject(h.getRequest("/report-results/"))
            .then(function(reportResults){
                expect(reportResults).to.be.instanceof(Array);
            })
    });

    it('has all of the CRUD', function(){

        var report = {
            name:"Mocha Test Report Result Creation",
            url:"http://google.com/"
        }
        var resultId;
        return h.getJsonObject(h.getRequest("/pages"))
            .then(function(reports){
                var report = reports[0];
                var result = {
                    report:report,
                    timestamp:new Date().toISOString(),
                    result:unitTestImage
                }
                return h.getJsonObject(h.postRequest("/pages/" + report._id + "/results", result))
                    //Create
                    .then(function(savedResult){
                        resultId = savedResult._id;
                        expect(savedResult._id).to.exist;
                        expect(savedResult.report).to.equal(report.report);
                        expect(savedResult.result).to.equal(unitTestImage);
                        return savedResult;
                    })
                    //Update
                    .then(function(savedReport){
                        var editedReport = {
                            _id:savedReport._id,
                            timestamp:new Date().toISOString(),
                            result:unitTestImageEdited
                        }
                        return h.getJsonObject(h.putRequest("/report-results/" + savedReport._id, editedReport))
                            .then(function(newEditedReport){
                                expect(newEditedReport._id).to.equal(editedReport._id);
                                expect(newEditedReport.timestamp).to.equal(editedReport.timestamp);
                                expect(newEditedReport.result).to.equal(editedReport.result);
                                return newEditedReport;
                            });
                    })
                    //Read
                    .then(function(savedReport){
                        return h.getJsonObject(h.getRequest("/report-results/" + savedReport._id))
                            .then(function(singleReport){
                                expect(singleReport._id).to.equal(savedReport._id);
                                expect(singleReport.timestamp).to.equal(savedReport.timestamp);
                                expect(singleReport.result).to.equal(savedReport.result);
                                return savedReport;
                            })
                    })
                    //Delete
                    .then(function(savedReport){
                        return h.getJsonObject(h.delRequest("/report-results/" + savedReport._id, savedReport))
                            .then(function(deletedReport){
                                expect(deletedReport._id).to.equal(savedReport._id);
                                return deletedReport;
                            })
                    })
                    .then(function(deletedReport){
                        return h.getJsonObject(h.getRequest("/report-results/" + deletedReport._id))
                            .then(function(){
                                expect("Error").to.equal(" should have been returned");
                                return;
                            }, function(error){
                                expect(error.message).to.equal("404");
                                return;
                            })
                    })
            });

    });

});