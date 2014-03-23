/**
 * Scylla REPL Console
 *
 *
 */

var path = require('path');
var repl = require("repl");

var options = {syslog:false};

var LOG = require('./config/logging')(options.syslog);

var databaseConfig  = require('./config/database');
//Restify does some odd things, so this folder needs to be 2x deep
var imagePath       = path.resolve( "images", "resources");

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

