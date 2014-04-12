module.exports = function(ORM){
    'use strict';

    /**
     * A First-Class Join between Suite and Snapshot
     */
    return {
        name:'MasterSnapshot',
        schema:{
            enabled:{
                type:ORM.BOOLEAN,
                defaultValue:true
            }
        },
        options:{},
        relationships:[
            {   kind:   "belongsTo",
                model:  "Suite"
            },
            {   kind:   "belongsTo",
                model:  "Snapshot"
            }

        ]
    };

};