module.exports = function(mongoose){
    'use strict';
    var BatchResultSchema = new mongoose.Schema({
        batch:{type : mongoose.Schema.ObjectId, ref : 'batches'},
        start:{type:String},
        end:{type:String},

        pass:{type:Number, default:0},
        fail:{type:Number, default:0},
        exception:{type:Number, default:0},

        reportResultSummaries:{}
    });

    var BatchResult = mongoose.model('batch-results', BatchResultSchema);

    return BatchResult;
};