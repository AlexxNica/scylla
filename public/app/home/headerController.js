define([
    "scyllaApp",
    "home/header"
], function(
    scyllaApp,
    Header
    ){
    'use strict';

    return scyllaApp.controller("HeaderController", function($scope, $http, Header) {
        $scope.Header = Header;
        $scope.headers = [
            {label:"Home", href:"#", id:"homeNav", icon:"icon-home", active:false},
            {label:"Pages", href:"#/pages", id:"pagesNav", icon:"icon-th-list", active:false},
            {label:"Suites", href:"#/suites", id:"suitesNav", icon:"icon-sitemap", active:false}/*,
            {label:"AB Compare", href:"#/compares", id:"comparesNav", icon:"icon-exchange", active:false}*/
        ];
        $scope.isActive = function(item){
            //console.log(item.id, Page.firstLevelNavId());
            return item.id === Header.firstLevelNavId() ? "active" : "";
        };




        $scope.showLoginModal = false;
        $scope.showLogin = function(){
            $scope.showLoginModal = true;
        }
        $scope.closeLogin = function(){
            $scope.showLoginModal = false;
        }
        $scope.login = function(email, password){
            $http.post("/account/login", {email:email,password:password})
                .success(function(success){
                    console.log("Success", success);
                })
                .error(function(err){
                    alert(err)
                });
        }

        $scope.showRegisterModal = false;
        $scope.showRegister = function(){
            $scope.showRegisterModal = true;
        }
        $scope.closeLogin = function(){
            $scope.showRegisterModal = false;
        }
        $scope.register = function(name, email, password){
            $http.post("/account/register", {name:name, email:email, password:password})
                .success(function(success){
                    console.log("Success", success);
                })
                .error(function(err){
                    alert(err)
                });
        }

    });

})
