module.exports = function(ORM){
    'use strict';

    /**
     * A First-Class Join between Suite and Snapshot
     */
    return {
        name:'MasterSnapshot',
        schema:{
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
            },
            {   kind:   "belongsTo",
                model:  "Snapshot"
            }

        ]
    };

};