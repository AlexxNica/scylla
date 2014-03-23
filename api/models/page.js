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

        },
        relationships:[
            {   kind:   "hasMany",
                model:  "Snapshot"
            }
        ]

    };

};