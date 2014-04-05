module.exports = function(LOG, models){
    'use strict';
    var restify = require('restify');
    var Q = require('q');
    var util = require('util');

    var normalSuccess = function(res, next){
        return function(value){
            if(value){
                try{
                    res.send(value);
                } catch(err){
                   LOG.info("ERROR?", util.inspect(err));
                }
                //LOG.info("Sending: ", value);
                return next();
            } else {
                res.send(404, new Error('Resource Not Found'));
                return next(new restify.ResourceNotFoundError("Not Found"));
            }
        };
    };
    var forwardSuccess = function forwardSuccess(res, next){
        return function(value){
            if(value){
                try{
                    res.header('Location', '/resources/' + value.url);
                    res.send(302);
                } catch(err){
                    LOG.info("ERROR?", util.inspect(err));
                }
                //LOG.info("Sending: ", value);
                return next();
            } else {
                res.send(404, new Error('Resource Not Found'));
                return next(new restify.ResourceNotFound("Not Found"));
            }
        };
    };

    var emptyOkSuccess = function(res,next){
        return function(value){
            //LOG.info("Returning a 204", value);
            if(value){
                try{
                    res.send(value);
                } catch(err){
                    LOG.info("ERROR?", util.inspect(err));
                }
                //LOG.info("Sending: ", value);
                return next();
            } else {
                res.send(204, undefined);
                return next();
            }
        };
    }

    var normalFail = function(res, next){
        return function(error){
            if(error instanceof restify.RestError){
                return next(error);
            } else {
                console.error("\nRoute Failure: ", util.inspect(error));
                LOG.info(error.stack);
                return next(new restify.InternalError(util.inspect(error)));
            }
        };
    };

    var respond = {
        notFound:function(message){
            return Q.reject(new restify.ResourceNotFoundError(message || "Resource Not Found"));
        }
    }

    var respondBasedOnSnapshotState = function respondBasedOnSnapshotState(){
        return function(snapshot){
            switch(snapshot.state){
                //TODO: This should actually look at thumbnails...
                case models.Snapshot.COMPLETE:
                    return snapshot;
                    break;
                case models.Snapshot.QUEUED:
                    return respond.notFound("Snapshot currently queued for capture.");
                    break;
                case models.Snapshot.CAPTURING:
                    return respond.notFound("Snapshot currently being captured.");
                    break;
                case models.Snapshot.FAILURE:
                    return respond.notFound("Snapshot failed to generate");
                    break;
                default:
                    throw new Error("Unknown Snapshot State: " + snapshot.state + " on Snapshot: " + req.params.id);
            }
        }
    }


    return {
        respond:respond,
        respondBasedOnSnapshotState:respondBasedOnSnapshotState,
        success:normalSuccess,
        successRedirect:forwardSuccess,
        successEmptyOk:emptyOkSuccess,
        fail:normalFail
    };
};
