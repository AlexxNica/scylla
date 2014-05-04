module.exports = function(ORM){
    'use strict';

    return {
        name:'ABCompare',
        schema:{
            notes:{
                type:ORM.TEXT
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
                model:  "Page",
                options:{ as:"pageA", foreignKey:"pageAId"}
            },
            {   kind:   "belongsTo",
                model:  "Page",
                options:{ as:"pageB", foreignKey:"pageBId"}
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