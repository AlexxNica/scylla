define([
    "scyllaApp",
    "services/pagesService"
], function(
    scyllaApp,
    thePagesService
    ){
    'use strict';

    return scyllaApp
        .service('ComparesService', function ($http, $q, $log, PagesService) {


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


            this.save = function save(compare){
                if (compare.hasOwnProperty("id")) {
                    var updatePagePromises = [
                        PagesService.save(compare.pageA),
                        PagesService.save(compare.pageB)
                    ];
                    return $q.all(updatePagePromises);
                }
                return $http.post("/abcompares", compare)
                    .then(function(response){
                        return response.data;
                    });
            };

            this.bulkSave = function(compares){
                var savePromises = [];
                angular.forEach(compares, function(compare){
                    savePromises.push(this.save(compare))
                }.bind(this) );
                return $q.all(savePromises);
            };

            this.delete = function (compare){
                return $http.delete("/abcompares/" + compare.id)
                    .finally(function(){
                    });
            };

            this.executeCompare = function executeCompare(compare){
                return $http.post("/abcompares/" + compare.id + "/snapshotDiffs", {})
                    .then(function(response){
                        return response.data;
                    })
            };


        });
});