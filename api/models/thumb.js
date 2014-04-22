module.exports = function(ORM){
    'use strict';

    return {
        name:'Thumb',
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
            url:{
                type:ORM.STRING,
                validate:{
                    notEmpty:true,
                    notNull:true,
                    isUrl:true
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
            {   kind:   "belongsTo",
                model:  "Image"}
        ]
    };

};