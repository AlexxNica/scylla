define([
    "scyllaApp"
], function(
    scyllaApp
    ){
    'use strict';

    return scyllaApp
        .service('SuitesService', function ($http, $log) {

            // TODO: Maintain a client-side cache, so that updating a model in once place updates it everywhere
            //For now, we'll keep requesting things all the time.
            /*
            var suitesList = [];

            var updateItem = function(item){
                angular.forEach(suitesList, function(value,index){
                    if(value.id == id) angular.copy(item,value);
                });
            };

            this.suites = suitesList;
            */

            this.list = function list(){
                return $http.get("/suites")
                    .then(function(response){
                        return response.data;
                        //return angular.copy(suites, suitesList);
                    });
            };

            this.get = function get(id){
                /*
                var suite = {};
                angular.forEach(suitesList, function(value,index){
                    if(value.id == id) suite = value;
                });
                */
                return $http.get("/suites/" + id)
                    .success(function(response){
                        return response.data;
                        //return angular.copy(savedSuite, suite);
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
                            return response.data;
                            //return angular.extend(suite, response.data)
                        });
                }
                return $http.post("/suites", suite)
                    .then(function(response){
                        return response.data;
                        //angular.copy(response.data,suite);
                        //suitesList.push(suite);
                        //return suite;
                    });
            };

            this.delete = function (suite){
                return $http.delete("/suites/" + suite.id)
                    .finally(function(){
                        /*
                        var index = suitesList.indexOf(suite);
                        if(index > -1){
                            suitesList.splice(index,1);
                        }
                        */
                    });
            };

            this.run = function (suite){
                return $http.post("/suites/" + suite.id + "/suiteRuns", {})
                    .then(function(response){
                        suite.suiteRuns.unshift(response.data);
                        return response.data;
                    })
            };

            this.addPageSnapshotAsMaster = function(suite, snapshot){
                return $http.post("/suites/" + suite.id + "/masterSnapshots", {
                    SnapshotId:snapshot.id
                }).then(function(response){
                    return response.data;
                })
            };



        });
});