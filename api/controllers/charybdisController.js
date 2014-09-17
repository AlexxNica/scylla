module.exports = function(LOG){
    'use strict';
    var charybdis = require("charybdis")();

    var webPageToSnapshot = function webPageToSnapshot(url, width, height, cookie){
        LOG.info("Getting Snapshot for URL: " + url);
        var snapshotTimeoutInMS = 2000;
        return charybdis.webPageToSnapshot(url, width, height, snapshotTimeoutInMS, cookie);
    };

    var diffTwoSnapshots = function(contentsA, contentsB){
        return charybdis.diffTwoSnapshots(contentsA, contentsB);
    };


    return {
        webPageToSnapshot:webPageToSnapshot,
        diffTwoSnapshots:diffTwoSnapshots
    };
};