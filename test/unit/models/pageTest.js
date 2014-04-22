var expect = require('chai').expect;
var log = require('../../../config/logging')(false);
var config = require('./databaseTestConfig');
var Page = require('../../../api/models')(log, config, true ).Page;

describe('Page Spec', function(){

    /**
     * Properties
     */

    describe('Properties', function(){
        it('id', function(){
            expect(Page.rawAttributes.id).to.exist;
        });
        it('url', function(){
            expect(Page.rawAttributes.url).to.exist;
        });
        it('name', function(){
            expect(Page.rawAttributes.name).to.exist;
        });

    });


    /**
     * Validations
     */

    describe('Validations', function(){

        it('requires url', function(done){
            Page.create({name:'Test'})
                .error(function(errors){
                    expect(errors.url[0]).to.equal('Validation notEmpty failed: url');
                    expect(errors.url[1]).to.equal('Validation notNull failed: url');
                    done();
                })
        });

        it('requires url in right format', function(done){
            Page.create({name:'Test', url:'broken'})
                .error(function(errors){
                    expect(errors.url[0]).to.equal('Validation isUrl failed: url');
                    done();
                })
        });

        it('requires name', function(done){
            Page.create({url:'http://test/'})
                .error(function(errors){
                    expect(errors.name[0]).to.equal('Validation notEmpty failed: name');
                    expect(errors.name[1]).to.equal('Validation notNull failed: name');
                    done();
                })
        });

    });


    /**
     * Relationships
     */
    describe('Relationships', function(){

        it('HasMany Snapshots', function(){
            expect(Page.associations.PagesSnapshots).to.exist;
            expect(Page.associations.PagesSnapshots.associationType).to.equal('HasMany');
        });

    });
});

