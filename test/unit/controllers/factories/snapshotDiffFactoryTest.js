var expect  = require('chai').expect;
var sinon   = require('sinon');
var Q       = require('q');
var log     = require('../../../../config/logging')(false);
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
    var sharedBuildAndValidateModelSuccessResponse = {};


    describe('build', function(){
        before(function(){
            controllers.images = {
                getImageContents:sinon.stub().returns(Q.resolve("Binary Contents")),
                createDiff:sinon.stub().returns(Q.resolve(imagesCreateDiffSuccessResponse))
            };
            controllers.charybdis = {
                diffTwoSnapshots:sinon.stub().returns(Q.resolve(charybdisDiffSuccessResult))
            };
            controllers.shared = {
                buildAndValidateModel:sinon.stub().returns(Q.resolve(sharedBuildAndValidateModelSuccessResponse))
            };
            models.Snapshot = {};

            Factory.init(log, models, controllers);
        });

        it('handles happy path', function(done){
            Factory.build(snapshotA, snapshotB)
                .then(function(snapshotDiff){
                    expect(snapshotDiff).to.exist;
                    done();
                });
        });
    });


});

