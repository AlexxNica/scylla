define([
    "scyllaApp"
], function(
    scyllaApp
    ){
    'use strict';

    return scyllaApp
        .service('PagesService', function ($http, $log) {


            this.list = function list(){
                return $http.get("/pages")
                    .then(function(response){
                        return response.data;
                    });
            };

            this.get = function get(id){
                return $http.get("/pages/" + id)
                    .success(function(response){
                        return response.data;
                    })
                    .error(function(err){
                        $log(err);
                        return err;
                    });
            };


            this.save = function save(page){
                if(page.hasOwnProperty("id")){
                    return $http.put("/pages/" + page.id, page)
                        .then(function(response){
                            return response.data;
                        });
                }
                return $http.post("/pages", page)
                    .then(function(response){
                        return response.data;
                    });
            };

            this.delete = function (page){
                return $http.delete("/pages/" + page.id)
                    .finally(function(){
                    });
            };

            this.snapshotPage = function snapshotPage(page){
                return $http.post("/pages/" + page.id + "/snapshots", {})
                    .then(function(response){
                        return response.data;
                    })
            }

        });
});