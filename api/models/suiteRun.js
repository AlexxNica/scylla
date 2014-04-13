module.exports = function(ORM){
    'use strict';

    return {
        name:'SuiteRun',
        schema:{
            notes:{
                type:ORM.TEXT
            },
            runBySchedule:{
                type:ORM.BOOLEAN,
                defaultValue:false
            }
        },
        options:{
            paranoid:true,
            scopes:{
                deleted:{
                    where:['deletedAt IS NOT NULL']
                }
            }
        },
        relationships:[
            {   kind:   "belongsTo",
                model:  "Suite"
            },{
                kind:   "belongsTo",
                model:  "User",
                options:{"as":"runner"}
            },{
                kind:   "hasMany",
                model:  "SnapshotDiff"
            }
        ]
    };

};