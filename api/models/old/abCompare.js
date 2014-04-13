module.exports = function(mongoose){
    'use strict';
    var Q = require('q');

    var AbCompareSchema = new mongoose.Schema({
        urlA:{type:String},
        urlB:{type:String},
        name:{type:String},
        thumbA:{type:String},
        thumbB:{type:String},
        width:{type:Number},
        height:{type:Number},
        results:[{type : mongoose.Schema.ObjectId, ref : 'abcompare-results'}]
    });

    var AbCompare = mongoose.model('abcompare', AbCompareSchema);
    AbCompare.qFind = Q.nfbind(AbCompare.find.bind(AbCompare));
    AbCompare.qFindOne = Q.nfbind(AbCompare.findOne.bind(AbCompare));

    return AbCompare;
};