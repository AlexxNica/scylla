module.exports = function(mongoose){
    'use strict';
    var ReportResultSchema = new mongoose.Schema({
        report:{type : mongoose.Schema.ObjectId, ref : 'reports'},
        timestamp:{type:String},
        result:{type:String},
        thumb:{type:String}
    });

    var ReportResult = mongoose.model('report-results', ReportResultSchema);

    return ReportResult;
};