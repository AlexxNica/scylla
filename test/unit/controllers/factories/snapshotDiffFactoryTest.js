var Q = require('q');
var expect = require('chai').expect;
var sinon = require('sinon');
var inspect = require('util').inspect;

var log = require('../../../../config/logging')(false);
var helpers = require('../../../lib/testHelpers');
var Factory = require('../../../../api/controllers/factories/snapshotDiffFactory');

describe('Snapshot Diff Factory', function(){

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

    var snapshotA = {
        getImage:sinon.stub().returns(Q.resolve({
            url:"image/a/url"
        }))
    };
    var snapshotB = {
        getImage:sinon.stub().returns(Q.resolve({
            url:"image/b/url"
        }))
    };
    var charybdisDiffSuccessResult = {
        info      : { distortion     : 3.51839 },
        distortion: 3.51839,
        warning   : undefined,
        timestamp : '2014-03-29T23:01:05.678Z',
        image     : {
            contents: 'Binary Contents ',
            info    : {
                Image: ' /tmp/charybdis-cc-114229-11818-o03zdx.png',
                properties : []
            }
        }
    };
    var imagesCreateDiffSuccessResponse = {
        id:1
    };
    var diffsFindByIdSuccessResponse = {
        state:"Queued",
        snapshotA:{state:"Complete",image:{url:"fake/url"}},
        snapshotB:{state:"Complete",image:{url:"fake/url"}},
        save:function(){return Q.resolve({})},
        setImage:function(){}
    };
    var sharedBuildAndValidateModelSuccessResponse = { id:123123};


    describe('build and execute', function(){

        before(function(){
            controllers.shared = {
                ValidationError:Error,
                buildAndValidateModel:function(){
                    return Q.resolve(sharedBuildAndValidateModelSuccessResponse);
                }
            };
            controllers.snapshotDiffs = {
                findById:function(){
                    return Q.resolve(diffsFindByIdSuccessResponse)
                }
            };
            controllers.images = {
                getImageContents:function(){return Q.resolve("Binary Contents")},
                createDiff:function(){return Q.resolve(imagesCreateDiffSuccessResponse)}
            };
            controllers.charybdis = {
                diffTwoSnapshots:function(){return Q.resolve(charybdisDiffSuccessResult)}
            };
            models.SnapshotDiff = {};

            Factory.init(log, models, controllers);
        });

        it('builds - Happy Path', function(done){
            var snapAId = 1,snapBId = 2;

            var sharedSpy = sinon.spy(controllers.shared, "buildAndValidateModel" );
            return Factory.build(snapAId, snapBId, {})
                .then(function(snapshotDiff){
                    expect(snapshotDiff).to.equal(sharedBuildAndValidateModelSuccessResponse);

                    expect(sharedSpy.calledWith(models.SnapshotDiff, {
                            snapshotAId:snapAId,
                            snapshotBId:snapBId,
                            state:"Queued"
                        })).to.be.true;
                    done();
                }).fail(function(error){
                    done(new Error( error));
                });
        });

        it('executes - Happy Path', function(done){
            var diffId = 1;
            var diffSave = sinon.spy(diffsFindByIdSuccessResponse, "save");
            var getImageContents = sinon.spy(controllers.images, "getImageContents");
            var diffTwoSnapshots = sinon.spy(controllers.charybdis, "diffTwoSnapshots");
            var createDiff = sinon.spy(controllers.images, "createDiff");
            return Factory.execute(diffId)
                .then(function(){
                    expect(diffSave.callCount).to.equal(2);
                    expect(getImageContents.callCount).to.equal(2);
                    expect(diffTwoSnapshots.callCount).to.equal(1);
                    expect(createDiff.callCount).to.equal(1);
                    expect(diffsFindByIdSuccessResponse.state).to.equal("Complete");
                    done();
                }).fail(function(error){
                    done(new Error( error));
                });
        })
    });


});

