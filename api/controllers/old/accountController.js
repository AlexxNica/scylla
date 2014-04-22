module.exports = function(models){
    'use strict';
    var Q = require("q");
    var crypto = require('crypto');

    /*
    var changePassword = function (accountId, newpassword) {
        var deferred = Q.defer();
        var shaSum = crypto.createHash('sha256');
        shaSum.update(newpassword);
        var hashedPassword = shaSum.digest('hex');
        models.Account.update({_id: accountId}, {$set: {password: hashedPassword}}, {upsert: false},
            function changePasswordCallback(err) {
                if(err)
                    deferred.reject(err);
                else
                    deferred.resolve({account:accountId, success:true});
            });
        return deferred.promise;
    };

    var forgotPassword = function (email, resetPasswordUrl, callback) {
        var user = models.Account.findOne({email: email}, function findAccount(err, doc) {
            if (err) {
                // Email address is not a valid user
                callback(false);
            } else {
                var smtpTransport = nodemailer.createTransport('SMTP', config.mail);
                resetPasswordUrl += '?account=' + doc._id;
                smtpTransport.sendMail({
                    from   : 'scylla@simplymeasured.com',
                    to     : doc.email,
                    subject: 'Scylla Password Request',
                    text   : 'Click here to reset your password: ' + resetPasswordUrl
                }, function forgotPasswordResult(err) {
                    if (err) {
                        callback(false);
                    } else {
                        callback(true);
                    }
                });
            }
        });
    };
    */

    var findById = function(accountId) {
        return models.Account.qFindOne({_id:new models.ObjectId(accountId)}, {password:0})
            .then(function(account){
                return account;
            });
    };

    var login = function (email, password) {
        var shaSum = crypto.createHash('sha256');
        shaSum.update(password);
        return models.Account.qFindOne({email: email, password: shaSum.digest('hex')}, {password:0})
            .then(function (account) {
                //console.log("User Logged In", account);
                return account;
        });
    };

    var register = function (email, password, name) {
        var shaSum = crypto.createHash('sha256');
        shaSum.update(password);

        //console.log('Registering ' + email);
        var user = new models.Account({
            email   : email,
            name    : name,
            password: shaSum.digest('hex')
        });

        user.qSave = Q.nfbind(user.save.bind(user));
        return user.qSave()
            .then(function(acct){
                return findById(acct[0]._id.toString());
            });
    };

    return {
        findById:findById,
        login:login,
        register:register
    };
};
