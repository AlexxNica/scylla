//RequireJS Config
require.config({
    paths:{
        jquery:"stubs/jquery",
        aBootstrap:"../components/angular-bootstrap/ui-bootstrap-tpls",
        angular:"stubs/angular",
        toastr:"../components/toastr/toastr",
        moment:"../components/moment/moment"
    }
});

//Start App
require([
    'angular',
    'scyllaApp',
    'snapshotDiffs/snapshotDiffDetailController',
    'home/headerController',
    'home/homeController',
    'pages/pageController',
    'pages/pageBookmarkletController',
    'pages/pageDetailController',
    'compares/comparesController',
    'compares/compareDetailController',
    'compares/compareResultDetailController',
    'suites/suiteController',
    'suites/suiteDetailController',
    'suites/suiteRunController'
], function (
    angular,
    scyllaApp,
    SnapshotDiffDetailController,
    HeaderController,
    HomeController,
    PageController,
    ReportBookmarkletController,
    ReportDetailController,
    ComparesController,
    CompareDetailController,
    CompareResultDetailController,
    SuiteController,
    SuiteDetailController,
    SuiteRunController
    ) {

    'use strict';

    scyllaApp.config(['$routeProvider',function($routeProvider){
        console.log("Configuring Routes");
        $routeProvider
            .when('/home',
                  {templateUrl:'app/home/home.html',
                      controller:"HomeController"})
            .when('/pages',
                  {templateUrl:'app/pages/pages.html',
                      controller:"PageController"})
            .when('/pages/bookmarklet',
                  {templateUrl:'app/pages/pageBookmarklet.html',
                      controller:"PageBookmarkletController"})
            .when('/pages/:id',
                  {templateUrl:'app/pages/pageDetail.html',
                      controller:"PageDetailController"})
            .when('/compares',
                  {templateUrl:'app/compares/compares.html',
                      controller:"ComparesController"})
            .when('/compares/:id',
                  {templateUrl:'app/compares/compareDetail.html',
                      controller:"CompareDetailController"})
            .when('/compares/:compareId/results/:id',
                  {templateUrl:'app/compares/compareResultDetail.html',
                      controller:"CompareResultDetailController"})
            .when('/snapshotDiffs/:id',
                  {templateUrl:'app/snapshotDiffs/snapshotDiffDetail.html',
                      controller:"SnapshotDiffDetailController"})
            .when('/suites',
                  {templateUrl:'app/suites/suites.html',
                      controller:"SuiteController"})
            .when('/suites/:suiteId/suiteRuns/:suiteRunId',
                  {templateUrl:'app/suites/suiteRun.html',
                      controller:"SuiteRunController",
                      reloadOnSearch:false})
            .when('/suites/:id',
                  {templateUrl:'app/suites/suiteDetail.html',
                      controller:"SuiteDetailController"})
            .otherwise({redirectTo:"/home"})
    }]);


    angular.bootstrap(document, ['scyllaApp']);
});
