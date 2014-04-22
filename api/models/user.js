module.exports = function(ORM){
    'use strict';

    return {
        name:'User',
        schema:{
            email:{
                type:ORM.STRING,
                unique:true,
                validate:{
                    notEmpty:true,
                    notNull:true,
                    isEmail:true
                }
            },
            password:{
                type:ORM.STRING,
                validate:{
                    notEmpty:true,
                    notNull:true
                }
            },
            name:{
                type:ORM.STRING,
                validate:{
                    notEmpty:true,
                    notNull:true
                }
            },
            photoUrl:{
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
        relationships:[]
    };

};