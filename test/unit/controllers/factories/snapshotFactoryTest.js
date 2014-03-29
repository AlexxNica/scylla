var expect  = require('chai').expect;
var sinon   = require('sinon');
var Q       = require('q');
var log     = require('../../../../config/logging')(false);
var helpers = require('../../../lib/testHelpers');
var Factory = require('../../../../api/controllers/factories/snapshotFactory');

describe('Snapshot Factory', function(){

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

    var pagesFindByIdSuccessResponse = {
        url:"http://127.0.0.1:3000/testFodder/simpleChanges.html",
        addSnapshot:sinon.spy(),
        save:sinon.stub().returns(Q.resolve({}))
    };

    var webPageToSnapshotSuccessResponse = {
        console: 'Opening Page: http://127.0.0.1:3000/testFodder/simpleChanges.html?phantomjs\n',
        message: '',
        state: 'Captured',
        image:{
            contents: '',
            info: {
                Image: ' /tmp/charybdis-ca-114229-10852-r55l8j.png',
                properties: {}
            }
        }
    };
    var imagesCreateSuccessResponse =  {
        width: 800,
        height: 800,
        url: '1/snapshot-2014329-1drwvtx.png',
        id: 1,
        updatedAt: new Date(),
        createdAt: new Date(),
        setSnapshot:sinon.spy(),
        save:sinon.stub.returns(Q.resolve({}))
    };
    var sharedBuildAndValidateModelSuccessResponse = {
        console: 'Opening Page: http://127.0.0.1:3000/testFodder/simpleChanges.html?phantomjs\n',
        message: '',
        state: 'Complete',
        id: 3,
        updatedAt: new Date(),
        createdAt: new Date(),
        setPage:sinon.spy(),
        setImage:sinon.spy(),
        save:sinon.stub().returns(Q.resolve({}))
    };

    describe('build', function(){
        before(function(){
            controllers.pages = {
                findById:sinon.stub().returns(Q.resolve(pagesFindByIdSuccessResponse))
            };
            controllers.charybdis = {
                webPageToSnapshot:sinon.stub().returns(Q.resolve(webPageToSnapshotSuccessResponse))
            };
            controllers.images = {
                createSnapshot:sinon.stub().returns(Q.resolve(imagesCreateSuccessResponse))
            };
            controllers.shared = {
                buildAndValidateModel:sinon.stub().returns(Q.resolve(sharedBuildAndValidateModelSuccessResponse))
            };
            models.Snapshot = {};

            Factory.init(log, models, controllers);
        });

        it('handles happy path', function(done){
            Factory.build({},1)
                .then(function(snapshot){
                    expect(snapshot).to.exist;
                    done();
                });
        });
    });


});

