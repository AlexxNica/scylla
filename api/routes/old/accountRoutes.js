module.exports = function(server, models, controllers){
    'use strict';
    var utils = require('./../routeUtils');

    /** Routes **/
    server.get('/accounts/:id', function(req, res, next) {
        var accountId =
            (req.params.id === 'me' ) ? req.session.accountId : req.params.id;
        controllers.account.findById(accountId)
            .then(utils.success(res, next), utils.fail(res, next));
    });

    server.get('/account/authenticated', function(req, res, next) {
        if ( req.session.loggedIn ) {
            res.send(200);
        } else {
            res.send(401);
        }
    });

    var registeredValidators = {
        name:utils.v.required,
        email:utils.v.required,
        password:utils.v.required
    };

    server.post('/account/register', function(req, res, next) {
        utils.validateInputs(req.body, registeredValidators )
            .then(function(body){
                controllers.account.register(body.email, body.password, body.name)
                    .then(utils.success(res, next), utils.fail(res, next));
            }, function(message){
                res.send(400, message);
            });
    });

    server.post('/account/login', function(req, res, next) {
        //console.log('login request');
        var email = req.body.email;
        var password = req.body.password;

        if ( null === email || email.length < 1 || null === password || password.length < 1 ) {
            res.send(400);
            return;
        }

        controllers.account.login(email, password)
            .then(function(account) {
            if ( !account ) {
                res.send(401);
                return;
            }
            //console.log('login was successful', account);
            req.session.loggedIn = true;
            req.session.accountId = account._id;
            res.send(account);
        });
    });
};