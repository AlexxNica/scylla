var expect = require('chai').expect;
var log = require('../../../config/logging')(false);
var config = require('./databaseTestConfig');
var Image = require('../../../api/models')(log, config, true ).Image;

describe('Image Spec', function(){

    /**
     * Properties
     */

    describe('Properties', function(){
        it('id', function(){
            expect(Image.rawAttributes.id).to.exist;
        });
        it('width', function(){
            expect(Image.rawAttributes.width).to.exist;
        });
        it('height', function(){
            expect(Image.rawAttributes.height).to.exist;
        });
        it('notes', function(){
            expect(Image.rawAttributes.notes).to.exist;
        });
        it('url', function(){
            expect(Image.rawAttributes.url).to.exist;
        });

    })


    /**
     * Validations
     */

    describe('Validations', function(){

        it('width must exist', function(){
            var image = Image.build({});
            var validations = image.validate();
            expect(validations.width[0]).to.equal('Validation notEmpty failed: width');
            expect(validations.width[1]).to.equal('Validation notNull failed: width');
        });
        it('height must exist', function(){
            var image = Image.build({});
            var validations = image.validate();
            expect(validations.height[0]).to.equal('Validation notEmpty failed: height');
            expect(validations.height[1]).to.equal('Validation notNull failed: height');
        });
        it('url must exist', function(){
            var image = Image.build({});
            var validations = image.validate();
            expect(validations.url[0]).to.equal('Validation notEmpty failed: url');
            expect(validations.url[1]).to.equal('Validation notNull failed: url');
        });

    })

    /**
     * Relationships
     */
    describe('Relationships', function(){
        it('Has Many Thumb', function(){
            expect(Image.associations.ImagesThumbs).to.exist;
            expect(Image.associations.ImagesThumbs.associationType).to.equal('HasMany');
        });

    })
});

