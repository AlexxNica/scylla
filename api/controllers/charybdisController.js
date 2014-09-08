module.exports = function(LOG){
    'use strict';
    var charybdis = require("charybdis")();

    var webPageToSnapshot = function webPageToSnapshot(url, width, height, cookie){
        LOG.info("Getting Snapshot for URL: " + url)
        return charybdis.webPageToSnapshot(url, width, height, 2000, cookie);
    };

    var diffTwoSnapshots = function(contentsA, contentsB){
        return charybdis.diffTwoSnapshots(contentsA, contentsB);
    };


    return {
        webPageToSnapshot:webPageToSnapshot,
        diffTwoSnapshots:diffTwoSnapshots
    };
};