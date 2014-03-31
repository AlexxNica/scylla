module.exports = (function(){
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
                   console.log("ERROR?", util.inspect(err));
                }
                //console.log("Sending: ", value);
                return next();
            } else {
                res.send(404, new Error('Resource Not Found'));
                return next(new restify.ResourceNotFound("Not Found"));
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
                    console.log("ERROR?", util.inspect(err));
                }
                //console.log("Sending: ", value);
                return next();
            } else {
                res.send(404, new Error('Resource Not Found'));
                return next(new restify.ResourceNotFound("Not Found"));
            }
        };
    };

    var emptyOkSuccess = function(res,next){
        return function(value){
                console.log("Returning a 204", value);
            if(value){
                try{
                    res.send(value);
                } catch(err){
                    console.log("ERROR?", util.inspect(err));
                }
                //console.log("Sending: ", value);
                return next();
            } else {
                res.send(204, undefined);
                return next();
            }
        };
    }

    var imageSuccess = function(res, imagePlucker, next){
        return function(value){
            var image = imagePlucker(value);
            if(image){
                //res.contentType("image/png");
                res.setHeader('Content-Type', 'image/png');
                var imageContents = image.replace(/^data:image\/png;base64,/, "");
                var imageBuffer = new Buffer(imageContents, 'base64');
                //res.write(imageBuffer);
                res.end(imageBuffer, 'binary');
                return next();
            } else {
                console.log("No Image Found");
                res.send(404, new Error('Image Not Found'));
                return next(new restify.ResourceNotFound("Not Found"));
            }
        }
    };

    var normalFail = function(res, next){
        return function(error){
            if(error instanceof restify.RestError){
                return next(error);
            } else {
                console.error("\nRoute Failure: ", util.inspect(error));
                console.log(error.stack);
                return next(new restify.InternalError(util.inspect(error)));
            }
        };
    };


    return {
        success:normalSuccess,
        successRedirect:forwardSuccess,
        successImage:imageSuccess,
        successEmptyOk:emptyOkSuccess,
        fail:normalFail
    };
})();
