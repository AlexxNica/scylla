module.exports = function(log, server){
    'use strict';
    var os = require('os');

    server.get('/healthcheck', function(req, res, next) {
        res.send({
            alive:true,
            hostname:os.hostname(),
            type:os.type(),
            platform:os.platform(),
            arch:os.arch(),
            release:os.release(),
            uptime:os.uptime(),
            load:os.loadavg(),
            totalMemory:os.totalmem(),
            freeMemory:os.freemem(),
            cpus:os.cpus()
        });
        return next();
    });

    server.get('/monitoring', function(req, res, next) {
        res.send({
            alive:true
        });
        return next();
    });

    server.post('/echo', function(req, res, next) {
        res.send(req.body);
        return next();
    });
};