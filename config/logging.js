var bunyan = require('bunyan');
var restify = require('restify');

var sysLogger, regularLogger;
var NAME = 'scylla';

module.exports = function (useSyslog) {
    if (useSyslog) {
        if (sysLogger) {
            return sysLogger;
        }
        // In true UNIX fashion, debug messages go to stderr, and audit records go
        // to stdout, so you can split them as you like in the shell
        sysLogger = bunyan.createLogger({
            name       : NAME,
            streams    : [
                {
                    level : (process.env.LOG_LEVEL || 'info'),
                    stream: process.stderr
                },
                {
                    // This ensures that if we get a WARN or above all debug records
                    // related to that request are spewed to stderr - makes it nice
                    // filter out debug messages in prod, but still dump on user
                    // errors so you can debug problems
                    level : 'debug',
                    type  : 'raw',
                    stream: new restify.bunyan.RequestCaptureStream({
                        level        : bunyan.WARN,
                        maxRecords   : 100,
                        maxRequestIds: 1000,
                        stream       : process.stderr
                    })
                }
            ],
            serializers: restify.bunyan.serializers
        });
        return sysLogger;
    } else {
        if (regularLogger) {
            return regularLogger;
        }

        regularLogger = bunyan.createLogger({
            name       : NAME,
            serializers: restify.bunyan.serializers
        });
        return regularLogger;
    }


};