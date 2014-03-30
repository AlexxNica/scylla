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
        options:{
            classMethods:{
                findByTwoIds:function(snapIdA, snapIdB, include){
                    return this.find({
                        where:ORM.or(
                            {snapshotAId:snapIdA, snapshotBId:snapIdB},
                            {snapshotAId:snapIdB, snapshotBId:snapIdA}
                        ),
                        include:include
                    });
                }
            }
        },
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