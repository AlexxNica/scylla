module.exports = function(LOG){
    'use strict';
    var charybdis = require("charybdis")();

    var webPageToSnapshot = function webPageToSnapshot(url, width, height){
        LOG.info("Getting Snapshot for URL: " + url)
        return charybdis.webPageToSnapshot(url, width, height);
    };

    var diffTwoSnapshots = function(contentsA, contentsB){
        return charybdis.diffTwoSnapshots(contentsA, contentsB);
    };


    return {
        webPageToSnapshot:webPageToSnapshot,
        diffTwoSnapshots:diffTwoSnapshots
    };
};