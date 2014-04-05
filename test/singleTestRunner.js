var Mocha = require('mocha'),
    path = require('path'),
    fs = require('fs');
var glob = require("glob");

var mocha = new Mocha({
    reporter: 'spec',
    ui: 'bdd',
    timeout: 500
});

var Q = require('q');
Q.longStackSupport = true;

var testDir = './test/api/routes/suitesRoutesTest.js';
glob(testDir, function (err, files) {
    if (err) {
        console.log(err);
        return;
    }
    files.forEach(function (file) {
        console.log('adding test file: %s', file);
        mocha.addFile(file);
    });

    var runner = mocha.run(function () {
        console.log('finished');
        process.exit();
    });

});