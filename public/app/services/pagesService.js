define([
    "scyllaApp"
], function(
    scyllaApp
    ){
    'use strict';

    return scyllaApp
        .service('PagesService', function ($http, $q, $log) {


            this.list = function list(){
                return $http.get("/pages")
                    .then(function(response){
                        return response.data;
                    });
            };

            this.get = function get(id){
                return $http.get("/pages/" + id)
                    .then(function(response){
                        return response.data;
                    })
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

            this.bulkSave = function(pages){
                var savePromises = [];
                angular.forEach(pages, function(page){
                    savePromises.push(this.save(page))
                }.bind(this) );
                return $q.all(savePromises);
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
            };

            this.bulkSnapshotPages = function snapshotPage(pages){
                var snapshotPromises = [];
                angular.forEach(pages, function(page){
                    snapshotPromises.push($http.post("/pages/" + page.id + "/snapshots", {})
                        .then(function(response){
                            return response.data;
                        }));
                });
                return $q.all(snapshotPromises);
            }

        });
});