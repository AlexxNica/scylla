define([
    "scyllaApp"
], function(
    scyllaApp
    ){
    'use strict';

    return scyllaApp
        .service('ComparesService', function ($http, $q, $log) {


            this.list = function list(){
                return $http.get("/abcompares")
                    .then(function(response){
                        return response.data;
                    });
            };

            this.get = function get(id){
                return $http.get("/abcompares/" + id)
                    .then(function(response){
                        return response.data;
                    })
            };


            this.save = function save(page){
                if(page.hasOwnProperty("id")){
                    return $http.put("/abcompares/" + page.id, page)
                        .then(function(response){
                            return response.data;
                        });
                }
                return $http.post("/abcompares", page)
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

            this.delete = function deleteCompare(compare) {
                return $http.delete("/abcompares/" + compare.id)
                    .finally(function() {});
            };

            this.executeCompare = function executeCompare(compare){
                return $http.post("/abcompares/" + compare.id + "/snapshotDiffs", {})
                    .then(function(response){
                        return response.data;
                    })
            };


        });
});