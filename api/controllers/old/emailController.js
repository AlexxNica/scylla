module.exports = function(models, sendgrid){
    'use strict';

    var path = require("path");
    var templatesDir = path.join(__dirname, '..', 'templates');
    var emailTemplates = require('email-templates');
    var moment = require("moment");

    var sendBatchResultEmail = function(batch, batchResult) {
        emailTemplates(templatesDir, function(err, template){
            if(err){
                console.log("Error attempting to setup email templates: ", err);
                return;
            }
            var locals = {
                formatDate:function(isoString){
                    return moment(isoString).format('MMMM Do YYYY, h:mm:ss a');
                },
                getDiffUrl:function(batchId, resultId, diffId){
                    return ["http://localhost:3000/#" +
                           "/batches/" +
                           batchId +
                           "/results/" +
                           resultId +
                           "?diffId=" +
                           diffId].join("");
                },
                batch:batch,
                batchresult:batchResult
            };

            template('batchresult', locals, function(err, html){
                sendgrid.send({
                    to:batch.watchers,
                    from:'scylla@simplymeasured.com',
                    subject:"[Batch] " + batch.name + ((batchResult.fail + batchResult.exception === 0) ? " Passed" : " Failed"),
                    html:html
                }, function(success, message){
                    if(success){
                        console.log("Email Sent");
                    } else {
                        console.log("Email Failure: ", message);
                    }

                });
            } );
        });
    };

    return {
        sendBatchResultEmail:sendBatchResultEmail
    };
};