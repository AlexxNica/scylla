module.exports = function(ORM){
    'use strict';

    /**
     * A First-Class Join between SuiteRun and Snapshots and the diff Image
     */
    return {
        name:'SnapshotDiff',
        schema:{
            distortion:ORM.STRING,
            warning:ORM.TEXT,
            notes:{
                type:ORM.TEXT
            },
            output:{
                type:ORM.TEXT
            }
        },
        options:{},
        relationships:[
            {   kind:   "belongsTo",
                model:  "SuiteRun"
            },
            {   kind:   "belongsTo",
                model:  "Snapshot",
                options:{ as:"snapshotA", foreignKey:"SnapshotAId"}
            },
            {   kind:   "belongsTo",
                model:  "Snapshot",
                options:{ as:"snapshotB", foreignKey:"SnapshotBId"}
            },
            {   kind:   "belongsTo",
                model:  "Image"
            }

        ]
    };

};