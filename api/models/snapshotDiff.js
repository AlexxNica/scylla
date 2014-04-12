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
            },
            /**
             * Queued, Capturing, Complete, Failure
             */
            state:{
                type:ORM.STRING,
                validate:{
                    isIn:[['Queued', 'Capturing', 'Complete', 'Failure']]
                }
            },
            enabled:{
                type:ORM.BOOLEAN,
                defaultValue:true
            }
        },
        options:{
            classMethods:{
                'QUEUED':'Queued',
                'CAPTURING':'Capturing',
                'COMPLETE':'Complete',
                'FAILURE':'Failure',
                findByTwoIds:function(snapIdA, snapIdB, include){
                    return this.find({
                        where:ORM.or(
                            {SnapshotAId:snapIdA, SnapshotBId:snapIdB},
                            {SnapshotAId:snapIdB, SnapshotBId:snapIdA}
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
                options:{ as:"snapshotA", foreignKey:"snapshotAId"}
            },
            {   kind:   "belongsTo",
                model:  "Snapshot",
                options:{ as:"snapshotB", foreignKey:"snapshotBId"}
            },
            {   kind:   "belongsTo",
                model:  "Image"
            }

        ]
    };

};