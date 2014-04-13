module.exports = function(mongoose){
    'use strict';
    var AbCompareResultSchema = new mongoose.Schema({
        timestamp:{type:String},

        resultA:{type:String},
        thumbA:{type:String},

        resultB:{type:String},
        thumbB:{type:String},

        image:{type:String},

        distortion:{type:Number, default:0},
        //We can identify some "Errors", like image size difference, but still return a distortion.
        warning:{type:String},
        //If there was an issue taking or comparing a screenshot, it gets dumped here

        error:{}
    });

    var AbCompareResult = mongoose.model('abcompare-results', AbCompareResultSchema);

    return AbCompareResult;
};