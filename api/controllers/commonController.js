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

    var softDelete = function softDelete(Model, id ){
        return Q(Model.find(id)
            .success(function(instance){
                return instance.destroy()
                    .success(function(){
                        return instance;
                    });
            }));
    };
    var softUnDelete = function softUnDelete(Model, id ){
        return Q(Model.find(id)
            .success(function(instance){
                instance.deletedAt = null;
                return instance.save()
                    .success(function(savedInstance){
                        return savedInstance;
                    });
            }));
    };

    var buildAndValidateModel = function buildAndValidateModel(Model, properties){
        var model = Model.build(properties);
        return validateModel(model);
    };

    var validateModel = function validateModel(model){
        var validations = model.validate();
        if(validations != null){
            LOG.info("Validations Failed", model, validations);
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
        softDelete:softDelete,
        softUnDelete:softUnDelete,
        buildAndValidateModel:buildAndValidateModel,
        validateModel:validateModel,
        ValidationError:ValidationError
    };
};