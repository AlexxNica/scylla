var expect = require('chai').expect;
var log = require('../../../config/logging')(false);
var config = require('./databaseTestConfig');
var Snapshot = require('../../../api/models')(log, config, true ).Snapshot;

describe('Snapshot Spec', function(){

    /**
     * Properties
     */

    describe('Properties', function(){
        it('id', function(){
            expect(Snapshot.rawAttributes.id).to.exist;
        });
        it('params', function(){
            expect(Snapshot.rawAttributes.params).to.exist;
        });
        it('notes', function(){
            expect(Snapshot.rawAttributes.notes).to.exist;
        });
        it('console', function(){
            expect(Snapshot.rawAttributes.console).to.exist;
        });
        it('state', function(){
            expect(Snapshot.rawAttributes.state).to.exist;
        });

    })


    /**
     * Validations
     */

    describe('Validations', function(){

        it('state must exist', function(){
            var snapshot = Snapshot.build({});
            var validations = snapshot.validate();
            expect(validations.state[0]).to.equal('Validation isIn failed: state');
        });

        it('state can be Queued, Capturing or Completed', function(){

            var snapshotQueued = Snapshot.build({state:'Queued'});
            expect(snapshotQueued.validate()).to.equal(null);

            var snapshotCapturing = Snapshot.build({state:'Capturing'});
            expect(snapshotCapturing.validate()).to.equal(null);

            var snapshotCompleted = Snapshot.build({state:'Complete'});
            expect(snapshotCompleted.validate()).to.equal(null);

        });

    })

    /**
     * Relationships
     */
    describe('Relationships', function(){
        it('Belongs To Page', function(){
            expect(Snapshot.associations.Page).to.exist;
            expect(Snapshot.associations.Page.associationType).to.equal('BelongsTo');
        });
        it('Belongs To Image', function(){
            expect(Snapshot.associations.Image).to.exist;
            expect(Snapshot.associations.Image.associationType).to.equal('BelongsTo');
        });

    })
});

