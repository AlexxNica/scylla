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