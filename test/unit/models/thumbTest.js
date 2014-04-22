var expect = require('chai').expect;
var log = require('../../../config/logging')(false);
var config = require('./databaseTestConfig');
var Thumb = require('../../../api/models')(log, config, true ).Thumb;

describe('Thumb Spec', function(){

    /**
     * Properties
     */

    describe('Properties', function(){
        it('id', function(){
            expect(Thumb.rawAttributes.id).to.exist;
        });
        it('width', function(){
            expect(Thumb.rawAttributes.width).to.exist;
        });
        it('height', function(){
            expect(Thumb.rawAttributes.height).to.exist;
        });
        it('url', function(){
            expect(Thumb.rawAttributes.url).to.exist;
        });

    })


    /**
     * Validations
     */

    describe('Validations', function(){

        it('width must exist', function(){
            var thumb = Thumb.build({});
            var validations = thumb.validate();
            expect(validations.width[0]).to.equal('Validation notEmpty failed: width');
            expect(validations.width[1]).to.equal('Validation notNull failed: width');
        });
        it('height must exist', function(){
            var thumb = Thumb.build({});
            var validations = thumb.validate();
            expect(validations.height[0]).to.equal('Validation notEmpty failed: height');
            expect(validations.height[1]).to.equal('Validation notNull failed: height');
        });
        it('url must exist and be url formatted', function(){
            var thumb = Thumb.build({});
            var validations = thumb.validate();
            expect(validations.url[0]).to.equal('Validation notEmpty failed: url');
            expect(validations.url[1]).to.equal('Validation notNull failed: url');
            expect(validations.url[2]).to.equal('Validation isUrl failed: url');
        });

    })

    /**
     * Relationships
     */
    describe('Relationships', function(){
        it('Belongs To Image', function(){
            expect(Thumb.associations.Image).to.exist;
            expect(Thumb.associations.Image.associationType).to.equal('BelongsTo');
        });

    })
});

