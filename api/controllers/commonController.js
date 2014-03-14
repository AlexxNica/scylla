module.exports = function(LOG){
    'use strict';
    var Q = require('q');
    var restify = require('restify');
    var util = require('util');

    var execDeferredBridge = function(deferred){
        return function(result){
            if(err){
                console.log("Failing");
                deferred.reject(err);
            } else {
                console.log("Success: " + require('util').inspect(result));
                deferred.resolve(result);
            }
        };
    };

    var execDeferredDeleteBridge = function(deferred){
        return function(err, result){
            if(err){
                deferred.reject(err);
            } else {
                deferred.resolve({records:result});
            }
        };
    };


    var first = function first(results){
        if(results.length === 0){
            console.error("No Results found on", results);
            throw new Error("No Results");
        }

        return results[0];
    };

    var buildAndValidateModel = function buildAndValidateModel(Model, properties){
        var model = Model.build(properties);
        var validations = model.validate();
        if(validations != null){
            LOG.info("Validations Failed", validations);
            return Q.reject(new ValidationError(require('util').inspect(validations)));
        }
        return Q(model.save());
    }

    var ValidationError = function ValidationError(message) {
        restify.RestError.call(this, {
            restCode: 'ValidationError',
            statusCode: 400,
            message: message,
            constructorOpt: ValidationError
        });
        this.name = 'ValidationError';
    };
    util.inherits(ValidationError, restify.RestError);

    return {
        execDeferredBridge:execDeferredBridge,
        execDeferredDeleteBridge:execDeferredDeleteBridge,
        first:first,
        buildAndValidateModel:buildAndValidateModel,
        ValidationError:ValidationError
    };
};