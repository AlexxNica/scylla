module.exports = function(mongoose){
    'use strict';
    var ResultDiffSchema = new mongoose.Schema({
        report:{type : mongoose.Schema.ObjectId, ref : 'reports'},
        reportResultA:{type : mongoose.Schema.ObjectId, ref : 'report-results'},
        reportResultAName:{type:String},
        reportResultB:{type : mongoose.Schema.ObjectId, ref : 'report-results'},
        reportResultBName:{type:String},

        distortion:{type:Number, default:0},
        image:{type:String},
        //We can identify some "Errors", like image size difference, but still return a distortion.
        warning:{type:String},
        //If there was an issue taking or comparing a screenshot, it gets dumped here
        error:{},

        meta:{}
    });

    var ResultDiff = mongoose.model('result-diffs', ResultDiffSchema);

    return ResultDiff;
};