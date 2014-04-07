define([
    "scyllaApp"
], function(
    scyllaApp
    ){
    'use strict';

    return scyllaApp
        .service('SuitesService', function ($http, $log) {

            var suitesList = []

            var updateItem = function(item){
                angular.forEach(suitesList, function(value,index){
                    if(value.id == id) angular.copy(item,value);
                });
            };

            this.suites = suitesList;

            this.list = function list(){
                return $http.get("/suites")
                    .success(function(suites){
                        angular.copy(suites, suitesList);
                    })
                    .error(function(err){
                        $log(err);
                    });
            };

            this.get = function get(id){
                var suite = {};
                angular.forEach(suitesList, function(value,index){
                    if(value.id == id) suite = value;
                });
                return $http.get("/suites/" + id)
                    .success(function(savedSuite){
                        return angular.copy(savedSuite, suite);
                    })
                    .error(function(err){
                        $log(err);
                        return err;
                    });
            };


            this.save = function save(suite){
                if(suite.hasOwnProperty("id")){
                    return $http.put("/suites/" + suite.id, suite)
                        .then(function(response){
                            return angular.extend(suite, response.data)
                        });
                }
                return $http.post("/suites", suite)
                    .then(function(response){
                        angular.copy(response.data,suite);
                        suitesList.push(suite);
                        return suite;
                    });
            };

            this.delete = function (suite){
                return $http.delete("/suites/" + suite.id)
                    .finally(function(){
                        var index = suitesList.indexOf(suite);
                        if(index > -1){
                            suitesList.splice(index,1);
                        }
                    });
            }



        });
});