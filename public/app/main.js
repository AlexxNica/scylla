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
    'filters/formatters',
    'snapshotDiffs/snapshotDiffDetailController',
    'home/headerController',
    'home/homeController',
    'pages/pageController',
    'pages/pageBookmarkletController',
    'pages/pageDetailController',
    'compares/compareController',
    'compares/compareDetailController',
    'compares/compareResultDetailController',
    'snapshots/snapshotDetailController',
    'suites/suiteController',
    'suites/suiteDetailController',
    'suites/suiteRunController'
], function (
    angular,
    scyllaApp,
    ScyllaFormatters,
    SnapshotDiffDetailController,
    HeaderController,
    HomeController,
    PageController,
    ReportBookmarkletController,
    ReportDetailController,
    ComparesController,
    CompareDetailController,
    CompareResultDetailController,
    SnapshotDetailController,
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
                      controller:"CompareController"})
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
            .when('/snapshots/:id',
                  {templateUrl:'app/snapshots/snapshotDetail.html',
                      controller:"SnapshotDetailController"})
            .otherwise({redirectTo:"/home"})
    }]);


    angular.bootstrap(document, ['scyllaApp']);
});
