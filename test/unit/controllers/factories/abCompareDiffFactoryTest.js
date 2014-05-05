var expect  = require('chai').expect;
var sinon   = require('sinon');
var Q       = require('q');
var log     = require('../../../../config/logging')(false);
var helpers = require('../../../lib/testHelpers');
var Factory = require('../../../../api/controllers/factories/abCompareDiffFactory');

describe('AB Compare Factory', function(){

    /**
     * Properties
     */
    var models = {};
    var controllers = {};

    describe('init', function(){
        it('takes params LOG, models, controllers', function(){
            var params = helpers.getParamNames(Factory.init);
            expect(params[0]).to.exist;
            expect(params[0]).to.equal("LOG_in");
            expect(params[1]).to.exist;
            expect(params[1]).to.equal("models_in");
            expect(params[2]).to.exist;
            expect(params[2]).to.equal("controllers_in");
        });
    });


    var abComparesFindByIdSuccessResponse = {
        pageAId:2,
        pageBId:3
    };
    var diffFactoryBuildSuccessResponse = {
        setABCompare:sinon.spy(),
        save:sinon.stub().returns(Q.resolve({}))
    };
    var snapshotFactoryBuildSuccessResponse = {
        id:1
    };

    describe('build', function(){
        before(function(){
            controllers.abCompares = {
                findById:sinon.stub().returns(Q.resolve(abComparesFindByIdSuccessResponse))
            };
            controllers.factories = {
                diff: {
                    build: sinon.stub().returns(Q.resolve(diffFactoryBuildSuccessResponse))
                },
                snapshot:{
                    build:sinon.stub().returns(Q.resolve(snapshotFactoryBuildSuccessResponse))
                }
            };
            Factory.init(log, models, controllers);
        });

        it('handles happy path', function(done){
            Factory.build(1)
                .then(function(snapshot){
                    expect(snapshot).to.exist;
                    done();
                });
        });
    });


    var snapshotDiffsFindByIdSuccessResponse = {
        snapshotAId:1,
        snapshotBId:2,
        id:3
    }

    var diffFactoryExecuteSuccessResponse = {};
    var snapshotFactoryExecuteSuccessResponse = {};


    describe('execute', function(){
        before(function(){
            controllers.snapshotDiffs = {
                findById:sinon.stub().returns(Q.resolve(snapshotDiffsFindByIdSuccessResponse))
            };

            controllers.factories = {
                diff: {
                    execute: sinon.stub().returns(Q.resolve(diffFactoryExecuteSuccessResponse))
                },
                snapshot:{
                    execute:sinon.stub().returns(Q.resolve(snapshotFactoryExecuteSuccessResponse))
                }
            };

            Factory.init(log, models, controllers);
        });

        it('handles happy path', function(done){
            Factory.execute(1)
                .then(function(snapshot){
                    expect(snapshot).to.exist;
                    done();
                });
        });
    });


});

