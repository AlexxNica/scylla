var expect = require('chai').expect;
var log = require('../../../config/logging')(false);
var config = require('./databaseTestConfig');
var MasterSnapshot = require('../../../api/models')(log, config, true ).MasterSnapshot;

describe('MasterSnapshot Spec', function(){

    /**
     * Properties
     */

    describe('Properties', function(){

    });


    /**
     * Validations
     */

    describe('Validations', function(){

    });

    /**
     * Relationships
     */
    describe('Relationships', function(){
        it('Belongs To Suite', function(){
//            log.info("\n")
//            log.info(require('util').inspect(MasterSnapshot.associations));
            expect(MasterSnapshot.associations.Suite).to.exist;
            expect(MasterSnapshot.associations.Suite.associationType).to.equal('BelongsTo');
        });

        it('Belongs To Snapshot', function(){
//            log.info("\n")
//            log.info(require('util').inspect(MasterSnapshot.associations));
            expect(MasterSnapshot.associations.Snapshot).to.exist;
            expect(MasterSnapshot.associations.Snapshot.associationType).to.equal('BelongsTo');
        });

    })
});

