module.exports = function(ORM){
    'use strict';

    return {
        name:'Snapshot',
        schema:{
            params: ORM.TEXT,
            notes:ORM.TEXT,
            console:ORM.TEXT,
            message:ORM.TEXT,
            /**
             * Queued, Capturing, Complete
             */
            state:{
                type:ORM.STRING,
                validate:{
                    isIn:[['Queued', 'Capturing', 'Complete']]
                }
            }
        },
        options:{},
        relationships:[
            {   kind:   "belongsTo",
                model:  "Page"
            },{
                kind:   "belongsTo",
                model:  "Image"
            },{
                kind:   "hasMany",
                model:  "MasterSnapshot"
            },{
                kind:   "hasMany",
                model:  "SnapshotDiff"
            }

        ]
    };

};