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
                    notNull:true,
                    isUrl:true
                }
            }
        },
        options:{},
        relationships:{
            hasMany:"Thumb"
        }
    };

};