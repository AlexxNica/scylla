define([
    "scyllaApp",
    "toastr",
    "moment",
    "directives/spin/processingSpinner"
], function(
    scyllaApp,
    toastr,
    moment,
    processingSpinner
    ){
    'use strict';

    return scyllaApp.controller("PageController", function($scope, $http, Header) {
        Header.setFirstLevelNavId("pagesNav");
        $scope.isProcessing = false;
        $scope.pages = [];
        $scope.suites = [];
        $scope.pageToDelete = {};

        $scope.dateFormat = function(isoString) {
            if(typeof isoString === "undefined") return "";
            return moment(isoString).format("MMMM Do, h:mm A");
        };

        $scope.getThumbnail = function getThumbnail(page){
            return "/pages/" + page.id + "/thumb";
        };

        $scope.getAllPages = function(){

            $http.get("/pages")
                .success(function(pages){
                             $scope.loaded = true;
                             $scope.pages = pages;
                         })
                .error(function(err){
                           alert(err)
                       });
        };
        $scope.getAllPages();

        $scope.getAllSuites = function(){
            $http.get("/suites", {params:{includeResults:"false"}})
                .success(function(suites){
                    $scope.suites = suites
                })
                .error(function(err){
                    alert(err)
                });
        };
        $scope.getAllSuites();

        $scope.deletePage = function deletePage(page){
            $scope.showDeletePage = true
            $scope.pageToDelete = page;
            console.log("Page to Delete", page);
        };

        $scope.confirmDeletePage = function confirmDeletePage(page){
            $scope.isProcessing = true;
            console.log("Deleting Page", page);
            $http.get("/pages/" + page.id, {params:{includeResults:true}})
                .success(function(page){
                    if(page.results){
                        page.results.forEach(function(result){
                            $scope.deleteResult(result.id);
                        });
                    }
                    $http.delete("/pages/" + page.id)
                        .success(function(deletedPage){
                            console.log("Deleted Page",deletedPage);
                            $scope.getAllPages();
                            $scope.showDeletePage = false;
                            $scope.isProcessing = false;
                        })
                        .error(function(err){
                            console.error(err);
                            $scope.isProcessing = false;
                        });
                });
        };

        $scope.addPage = function addPage(name, url, width, height){
            $scope.isProcessing = true;
            console.log("New Page: ", name, url, width, height);
            $http.post("/pages", {name:name,url:url, width:width, height:height})
                .success(function(page){
                    $scope.showNewPage = false;
                    toastr.success("New Page Created: " + page.name + "<br>Now capturing first screenshot.");
                    $http.post("/pages/" + page.id + "/snapshots" )
                        .success(function(page){
                            toastr.success("Captured Screen for Page: " + name);
                            //Or, just replace the page
                            $scope.getAllPages();
                            $scope.isProcessing = false;
                        });
                 })
                .error(function(error){
                    console.error("Error Saving Page: ", error);
                    $("#newPage .alert").show();
                    $scope.isProcessing = false;
                    //TODO: Show Specific Failure Message

                });
        };
    });
});
