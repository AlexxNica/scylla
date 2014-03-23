var expect = require('chai').expect;
var log = require('../../../config/logging')(false);
var config = require('./databaseTestConfig');
var Suite = require('../../../api/models')(log, config, true ).Suite;

describe('Suite Spec', function(){

    /**
     * Properties
     */

    describe('Properties', function(){
        it('id', function(){
            expect(Suite.rawAttributes.id).to.exist;
        });
        it('name', function(){
            expect(Suite.rawAttributes.name).to.exist;
        });
        it('scheduleEnabled', function(){
            expect(Suite.rawAttributes.scheduleEnabled).to.exist;
        });
        it('schedule', function(){
            expect(Suite.rawAttributes.schedule).to.exist;
        });

    })


    /**
     * Validations
     */

    describe('Validations', function(){

        it('name must exist', function(){
            var suite = Suite.build({});
            var validations = suite.validate();
            expect(validations.name[0]).to.equal('Validation notEmpty failed: name');
            expect(validations.name[1]).to.equal('Validation notNull failed: name');
        });

    })

    /**
     * Relationships
     */
    describe('Relationships', function(){
        it('Has Many Watchers', function(){
//            log.info("\n")
//            log.info(require('util').inspect(Suite.associations));
            expect(Suite.associations.watchers).to.exist;
            expect(Suite.associations.watchers.associationType).to.equal('HasMany');
        });

        it('Belongs To Creator', function(){
//            log.info("\n")
//            log.info(require('util').inspect(Suite.associations));
            expect(Suite.associations.creator).to.exist;
            expect(Suite.associations.creator.associationType).to.equal('BelongsTo');
        });

        it('Has Many Master Snapshots', function(){
            log.info("\n")
            log.info(require('util').inspect(Suite.associations));
            expect(Suite.associations.MasterSnapshotsSuites).to.exist;
            expect(Suite.associations.MasterSnapshotsSuites.associationType).to.equal('HasMany');
        });

    })
});

