var expect = require('chai').expect;
var log = require('../../../config/logging')(false);
var config = require('./databaseTestConfig');
var User = require('../../../api/models')(log, config, true ).User;

describe('User Spec', function(){

    /**
     * Properties
     */

    describe('Properties', function(){
        it('id', function(){
            expect(User.rawAttributes.id).to.exist;
        });
        it('email', function(){
            expect(User.rawAttributes.email).to.exist;
        });
        it('password', function(){
            expect(User.rawAttributes.password).to.exist;
        });
        it('name', function(){
            expect(User.rawAttributes.name).to.exist;
        });
        it('photoUrl', function(){
            expect(User.rawAttributes.photoUrl).to.exist;
        });

    });


    /**
     * Validations
     */

    describe('Validations', function(){

        it('validates Email', function(){
            var user = User.build({});
            var validations = user.validate();
            expect(validations.email[0]).to.equal('Validation notEmpty failed: email');
            expect(validations.email[1]).to.equal('Validation notNull failed: email');
            expect(validations.email[2]).to.equal('Validation isEmail failed: email');
        });

        /*
        it('validates Email is unique', function(done){
            var user = User.create({
                email:'user@test.com',
                password:'test',
                name:'unique test',
                photoUrl:'http://nope.com/'
            }).complete(function(){
                console.log("Testing")
                var second = User.create({
                    email:'user@test.com',
                    password:'test',
                    name:'unique test',
                    photoUrl:'http://nope.com/'
                }).error(function(error){
                        expect(error).to.be.instanceof(Error);
                        expect(error.message).to.equal('SQLITE_CONSTRAINT: column email is not unique');
                    });
            }).error(function(error){
                    expect(error).to.be.instanceof(Error);
                    expect(error.message).to.equal('SQLITE_CONSTRAINT: column email is not unique');
                    done();
                });
        });
        */

        it('validates Password', function(){
            var user = User.build({email:'unique@email.com'});
            var validations = user.validate();
            expect(validations.password[0]).to.equal('Validation notEmpty failed: password');
            expect(validations.password[1]).to.equal('Validation notNull failed: password');
        });

        it('validates Name', function(){
            var user = User.build({});
            var validations = user.validate();
            expect(validations.name[0]).to.equal('Validation notEmpty failed: name');
            expect(validations.name[1]).to.equal('Validation notNull failed: name');
        });

        it('requires Photo Url', function(){
            var user = User.build({});
            var validations = user.validate();
            expect(validations.photoUrl[0]).to.equal('Validation notEmpty failed: photoUrl');
            expect(validations.photoUrl[1]).to.equal('Validation notNull failed: photoUrl');
            expect(validations.photoUrl[2]).to.equal('Validation isUrl failed: photoUrl');
        });


    });


    /**
     * Relationships
     */
    describe('Relationships', function(){

    });
});

