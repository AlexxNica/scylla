/**
 * Scylla Server
 *
 *
 */

var cli = require('cli');

cli.parse({
    port: ['p', 'The Port Number', 'number', 3000],
    https_port: ['sp', 'The HTTPS Port Number', 'number', 3443],
    syslog: ['s', 'Log to Syslog', 'boolean', false]
});
var fs = require('fs');
var restify = require('restify');
var path = require('path');


cli.main(function(args, options) {

    var LOG = require('./config/logging')(options.syslog);

    var SendGrid        = require('sendgrid');
    var mailConfig      = require('./config/mail');
    var databaseConfig  = require('./config/database');
    databaseConfig.properties.logging = function(message){
        //If we pass Bunyan's log functions directly to Sequelize, it throws errors...
        //So we have to create this passthrough :-/
        LOG.debug('Sequelize', message);
    }
    //Restify does some odd things, so this folder needs to be 2x deep
    var imagePath       = path.resolve( "images", "resources");

    var Q = require('q');
    Q.longStackSupport = true;

    var sendgrid = SendGrid(mailConfig.user, mailConfig.key);

    var models = require('./api/models')(LOG, databaseConfig, true);

    var imageFormatter = require('./api/lib/imageFormatter');

    var httpServer = restify.createServer({
        name: 'Scylla',
        log:LOG
    });
    /*
    var httpsServer = restify.createServer({
        name: 'Scylla Secure',
        log:LOG,
        formatters:{
            'image/png; q=0.9':imageFormatter
        },
        formatters:imageFormatter,
        key: fs.readFileSync('/etc/ssl/self-signed/server.key'),
        certificate: fs.readFileSync('/etc/ssl/self-signed/server.crt')
    });
    */
    //var io = require('socket.io').listen(httpsServer);

    var controllers = require('./api/controllers')(LOG, models, imagePath);

    var setupServer = function(restServer){
        restServer.use(restify.requestLogger());
        restServer.use(restify.queryParser());
        restServer.use(restify.bodyParser());
        /*
        //This can be REALLY noisy... I only ever use it when debugging
        restServer.on('after', restify.auditLogger({
            log: LOG
        }));
        */
        var routes = require('./api/routes')(LOG, restServer, models, controllers);

        //As mentioned above, Restify appends 'directory' when looking for these files
        //So we need to create a directory structure that accommodates that.
        restServer.get(/\/resources/, restify.serveStatic({
            directory: './images',
            default:'index.html'
        }));

        //We serve the 'static' site AFTER the API,
        restServer.get(/\//, restify.serveStatic({
            directory: './public',
            default:'index.html'
        }));


    };


    setupServer(httpServer);
    //setupServer(httpsServer);


    httpServer.listen(options.port);
    //httpsServer.listen(options.https_port);

    LOG.info("Listening on local ports: " + options.port + ", " + options.https_port);



})
