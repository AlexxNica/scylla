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
            }
        },
        options:{
            classMethods:{
                'QUEUED':'Queued',
                'CAPTURING':'Capturing',
                'COMPLETE':'Complete',
                'FAILURE':'Failure',
                // The paranoid option doesn't seem to affect OR queries... we have to do it manually
                findByTwoIds:function(snapIdA, snapIdB, include){
                    return this.find({
                        where:ORM.or(
                            {SnapshotAId:snapIdA, SnapshotBId:snapIdB, deletedAt:null},
                            {SnapshotAId:snapIdB, SnapshotBId:snapIdA, deletedAt:null}
                        ),
                        include:include
                    });
                }
            },
            paranoid:true,
            scopes:{
                none:{},
                deleted:{
                    where:['deletedAt IS NOT NULL']
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