module.exports = function(ORM){
    'use strict';

    return {
        name:'Page',
        schema:{
            url: {
                type:ORM.STRING,
                validate:{
                    notEmpty:true,
                    notNull:true,
                    isUrl:true
                }
            },
            name:{
                type:ORM.STRING,
                validate:{
                    notEmpty:true,
                    notNull:true
                }
            },
            cookie:{
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
            {   kind:   "hasMany",
                model:  "Snapshot"
            }
        ]

    };

};