define([
    "scyllaApp"
], function(
    scyllaApp
    ){
    'use strict';

    return scyllaApp.factory('Header', function(){
        var firstLevelNavId = "";
        return {
            firstLevelNavId:function(){return firstLevelNavId;},
            setFirstLevelNavId:function(id){firstLevelNavId = id;}
        }
    })
})