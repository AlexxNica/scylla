module.exports = function(ORM){
    'use strict';

    return {
        name:'Image',
        schema:{
            width:{
                type:ORM.INTEGER,
                validate:{
                    notEmpty:true,
                    notNull:true
                }
            },
            height:{
                type:ORM.INTEGER,
                validate:{
                    notEmpty:true,
                    notNull:true
                }
            },
            notes:ORM.STRING,
            url:{
                type:ORM.STRING,
                validate:{
                    notEmpty:true,
                    notNull:true
                }
            },
            enabled:{
                type:ORM.BOOLEAN,
                defaultValue:true
            }
        },
        options:{},
        relationships:[
            {   kind:   "hasOne",
                model:  "Snapshot"
            },
            {   kind:   "hasOne",
                model:  "SnapshotDiff"
            },
            {   kind:   "hasMany",
                model:  "Thumb"
            }
        ]
    };

};