/**
 * Scylla REPL Console
 *
 *
 */

var path = require('path');
var repl = require("repl");

var options = {syslog:false};

var LOG = require('./config/logging')(options.syslog);
LOG = {
    info:console.log,
    debug:console.log,
    error:console.log,
    child:function(){return LOG;}
}

var databaseConfig  = require('./config/database');
var storageConfig = require('./config/storage');

databaseConfig.properties.logging = function(message){
    //If we pass Bunyan's log functions directly to Sequelize, it throws errors...
    //So we have to create this passthrough :-/
    LOG.debug('Sequelize', message);
}
//Restify does some odd things, so this folder needs to be 2x deep
var imagePath       = path.resolve( storageConfig.base, storageConfig.resources);

var Q = require('q');
Q.longStackSupport = true;


var models = require('./api/models')(LOG, databaseConfig, true);

var controllers = require('./api/controllers')(LOG, models, imagePath);


//We use promises extensively, this makes the repl useful
var promisify = require("repl-promised").promisify;
var scyllaRepl = repl.start({
    prompt:"scylla>",
    useColors:true
});
promisify(scyllaRepl);

//load our models directly into the context, to make invoking easier.
for(var modelName in models){
    scyllaRepl.context[modelName] = models[modelName];
}
scyllaRepl.context.controllers = controllers;
scyllaRepl.context.seed = require('./test/manual/seed');

