module.exports = function(LOG, models, imagePath){
    'use strict';
    var shared = require('./commonController')(LOG);
    var charybdis = require("charybdis")();

    var path = require('path');
    var fsQ = require("q-io/fs");

    LOG.info("Image Controller saving files to: " + imagePath);
    var snapshotPath = 'snapshots';
    var diffPath = 'diffs';

    var generateName = function(basePath, prefix, suffix) {
        prefix = prefix || '';
        suffix = suffix || '';

        var now = new Date();
        var name = [prefix, "-",
                    now.getFullYear(), now.getMonth() +1, now.getDate(),
                    '-',
                    (Math.random() * 0x100000000 + 1).toString(36),
                    suffix].join('');
        return name;
    };


    var saveSnapshotImage = function saveSnapshotImage(pageId, content){
        pageId = pageId.toString();
        var filename = generateName(path, "snapshot", ".png");

        //Folder we save in
        var pathyPath = path.join(imagePath, snapshotPath, pageId);
        //URI we give to the app
        var imageUri = path.join(snapshotPath, pageId, filename);
        //Full name so we can actually save the file
        var fullPath = path.join(pathyPath, filename);

        LOG.info("Saving Snapshot for page: " + pageId + " to File: " + filename);
        return saveImage(pathyPath, fullPath, imageUri, content);
    };


    var saveDiffImage = function saveDiffImage(content){
        var filename = generateName(path, "diff", ".png");

        //Folder we save in
        var pathyPath = path.join(imagePath, diffPath);
        //URI we give to the app
        var imageUri = path.join(diffPath, filename);
        //Full name so we can actually save the file
        var fullPath = path.join(pathyPath, filename);

        return saveImage(pathyPath, fullPath, imageUri, content);
    };


    var saveImage = function saveImage(pathyPath, fullPath, imageUri, content){
        LOG.info(typeof content);
        LOG.info("Saving Image to File: " + fullPath);
        return fsQ.makeTree(pathyPath)
            .then(function(){
                return fsQ.write(fullPath, content)
                    .then(function(response){
                        LOG.info("Finished Saving File");
                        return imageUri;
                    })
                    .fail(function(error){
                        LOG.info("Error writing file for some reason");
                        throw new Error(error.message);
                    });

            });
    };



    var getImageContents = function getImageContents(uri){
        var thePath = path.join(imagePath, uri);
        LOG.info("Getting image contents for: " + thePath);
        return fsQ.read(thePath, 'b');
    };

    var createSnapshot = function createSnapshot(properties, pageId, content){
        return saveSnapshotImage(pageId, content)
            .then(function(imageUri){
                properties.url = imageUri;
                return shared.buildAndValidateModel(models.Image, properties);
            });

    };

    var createDiff = function createDiff(properties, content){
        return saveDiffImage(content)
            .then(function(imageUri){
                properties.url = imageUri;
                return shared.buildAndValidateModel(models.Image, properties);
            });
    };

    return {
        createSnapshot:createSnapshot,
        createDiff:createDiff,
        saveSnapshotImage:saveSnapshotImage,
        getImageContents:getImageContents
    };
};