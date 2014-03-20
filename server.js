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

    var controllers = {
        shared        : require('./api/controllers/commonController')   (LOG),
        pages         : require('./api/controllers/pagesController')    (LOG, models),
        snapshots     : require('./api/controllers/snapshotsController')(LOG, models),
        charybdis     : require('./api/controllers/charybdisController')(LOG, models),
        images        : require('./api/controllers/imagesController')   (LOG, models, imagePath)
    };

    var factories = {
        snapshot      : require('./api/controllers/snapshotFactory').init (LOG, models, controllers)
    }

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
        var routes = {
            monitoring    : require('./api/routes/monitoringRoutes')(LOG, restServer),
            pages         : require('./api/routes/pagesRoutes')     (LOG, restServer, models, controllers),
            snapshots     : require('./api/routes/snapshotsRoutes') (LOG, restServer, models, controllers),
            charybdis     : require('./api/routes/charybdisRoutes') (LOG, restServer, models, controllers)
        };

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
