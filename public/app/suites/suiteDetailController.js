define([
    "scyllaApp",
    "toastr",
    "moment",
    "suites/dialogs/suiteEditor",
    "suites/dialogs/addPageToSuite",
    "services/SuitesService",
    "directives/spin/processingSpinner"
], function(
    scyllaApp,
    toastr,
    moment,
    TheDialogSuiteEditor,
    AddPageToSuite,
    TheSuitesService,
    processingSpinner
    ){
    'use strict';

    return scyllaApp.controller("SuiteDetailController", function($scope, $modal, $route, $routeParams, $log, $http, SuitesService, Header) {
        Header.setFirstLevelNavId("suitesNav");
        $scope.suite = {};
        $scope.isProcessing = false;

        $scope.showEditSuite = false;
        $scope.suiteScheduleEnabled = false;
        $scope.suiteScheduleTime = "";
        var dayList =["sun", "mon", "tues", "wed","thurs","fri","sat"];
        $scope.days = {
            sun: false,
            mon: true,
            tues: true,
            wed: true,
            thurs: true,
            fri:true,
            sat:false
        };
        $scope.watchers = "";


        var filterOutAlreadyIncludedReports = function(report){
            return !$scope.suite.pages.some(function(includedReport){
                return (includedReport.id == report.id);
            });
        };

        var MD5=function(s){function L(k,d){return(k<<d)|(k>>>(32-d))}function K(G,k){var I,d,F,H,x;F=(G&2147483648);H=(k&2147483648);I=(G&1073741824);d=(k&1073741824);x=(G&1073741823)+(k&1073741823);if(I&d){return(x^2147483648^F^H)}if(I|d){if(x&1073741824){return(x^3221225472^F^H)}else{return(x^1073741824^F^H)}}else{return(x^F^H)}}function r(d,F,k){return(d&F)|((~d)&k)}function q(d,F,k){return(d&k)|(F&(~k))}function p(d,F,k){return(d^F^k)}function n(d,F,k){return(F^(d|(~k)))}function u(G,F,aa,Z,k,H,I){G=K(G,K(K(r(F,aa,Z),k),I));return K(L(G,H),F)}function f(G,F,aa,Z,k,H,I){G=K(G,K(K(q(F,aa,Z),k),I));return K(L(G,H),F)}function D(G,F,aa,Z,k,H,I){G=K(G,K(K(p(F,aa,Z),k),I));return K(L(G,H),F)}function t(G,F,aa,Z,k,H,I){G=K(G,K(K(n(F,aa,Z),k),I));return K(L(G,H),F)}function e(G){var Z;var F=G.length;var x=F+8;var k=(x-(x%64))/64;var I=(k+1)*16;var aa=Array(I-1);var d=0;var H=0;while(H<F){Z=(H-(H%4))/4;d=(H%4)*8;aa[Z]=(aa[Z]|(G.charCodeAt(H)<<d));H++}Z=(H-(H%4))/4;d=(H%4)*8;aa[Z]=aa[Z]|(128<<d);aa[I-2]=F<<3;aa[I-1]=F>>>29;return aa}function B(x){var k="",F="",G,d;for(d=0;d<=3;d++){G=(x>>>(d*8))&255;F="0"+G.toString(16);k=k+F.substr(F.length-2,2)}return k}function J(k){k=k.replace(/rn/g,"n");var d="";for(var F=0;F<k.length;F++){var x=k.charCodeAt(F);if(x<128){d+=String.fromCharCode(x)}else{if((x>127)&&(x<2048)){d+=String.fromCharCode((x>>6)|192);d+=String.fromCharCode((x&63)|128)}else{d+=String.fromCharCode((x>>12)|224);d+=String.fromCharCode(((x>>6)&63)|128);d+=String.fromCharCode((x&63)|128)}}}return d}var C=Array();var P,h,E,v,g,Y,X,W,V;var S=7,Q=12,N=17,M=22;var A=5,z=9,y=14,w=20;var o=4,m=11,l=16,j=23;var U=6,T=10,R=15,O=21;s=J(s);C=e(s);Y=1732584193;X=4023233417;W=2562383102;V=271733878;for(P=0;P<C.length;P+=16){h=Y;E=X;v=W;g=V;Y=u(Y,X,W,V,C[P+0],S,3614090360);V=u(V,Y,X,W,C[P+1],Q,3905402710);W=u(W,V,Y,X,C[P+2],N,606105819);X=u(X,W,V,Y,C[P+3],M,3250441966);Y=u(Y,X,W,V,C[P+4],S,4118548399);V=u(V,Y,X,W,C[P+5],Q,1200080426);W=u(W,V,Y,X,C[P+6],N,2821735955);X=u(X,W,V,Y,C[P+7],M,4249261313);Y=u(Y,X,W,V,C[P+8],S,1770035416);V=u(V,Y,X,W,C[P+9],Q,2336552879);W=u(W,V,Y,X,C[P+10],N,4294925233);X=u(X,W,V,Y,C[P+11],M,2304563134);Y=u(Y,X,W,V,C[P+12],S,1804603682);V=u(V,Y,X,W,C[P+13],Q,4254626195);W=u(W,V,Y,X,C[P+14],N,2792965006);X=u(X,W,V,Y,C[P+15],M,1236535329);Y=f(Y,X,W,V,C[P+1],A,4129170786);V=f(V,Y,X,W,C[P+6],z,3225465664);W=f(W,V,Y,X,C[P+11],y,643717713);X=f(X,W,V,Y,C[P+0],w,3921069994);Y=f(Y,X,W,V,C[P+5],A,3593408605);V=f(V,Y,X,W,C[P+10],z,38016083);W=f(W,V,Y,X,C[P+15],y,3634488961);X=f(X,W,V,Y,C[P+4],w,3889429448);Y=f(Y,X,W,V,C[P+9],A,568446438);V=f(V,Y,X,W,C[P+14],z,3275163606);W=f(W,V,Y,X,C[P+3],y,4107603335);X=f(X,W,V,Y,C[P+8],w,1163531501);Y=f(Y,X,W,V,C[P+13],A,2850285829);V=f(V,Y,X,W,C[P+2],z,4243563512);W=f(W,V,Y,X,C[P+7],y,1735328473);X=f(X,W,V,Y,C[P+12],w,2368359562);Y=D(Y,X,W,V,C[P+5],o,4294588738);V=D(V,Y,X,W,C[P+8],m,2272392833);W=D(W,V,Y,X,C[P+11],l,1839030562);X=D(X,W,V,Y,C[P+14],j,4259657740);Y=D(Y,X,W,V,C[P+1],o,2763975236);V=D(V,Y,X,W,C[P+4],m,1272893353);W=D(W,V,Y,X,C[P+7],l,4139469664);X=D(X,W,V,Y,C[P+10],j,3200236656);Y=D(Y,X,W,V,C[P+13],o,681279174);V=D(V,Y,X,W,C[P+0],m,3936430074);W=D(W,V,Y,X,C[P+3],l,3572445317);X=D(X,W,V,Y,C[P+6],j,76029189);Y=D(Y,X,W,V,C[P+9],o,3654602809);V=D(V,Y,X,W,C[P+12],m,3873151461);W=D(W,V,Y,X,C[P+15],l,530742520);X=D(X,W,V,Y,C[P+2],j,3299628645);Y=t(Y,X,W,V,C[P+0],U,4096336452);V=t(V,Y,X,W,C[P+7],T,1126891415);W=t(W,V,Y,X,C[P+14],R,2878612391);X=t(X,W,V,Y,C[P+5],O,4237533241);Y=t(Y,X,W,V,C[P+12],U,1700485571);V=t(V,Y,X,W,C[P+3],T,2399980690);W=t(W,V,Y,X,C[P+10],R,4293915773);X=t(X,W,V,Y,C[P+1],O,2240044497);Y=t(Y,X,W,V,C[P+8],U,1873313359);V=t(V,Y,X,W,C[P+15],T,4264355552);W=t(W,V,Y,X,C[P+6],R,2734768916);X=t(X,W,V,Y,C[P+13],O,1309151649);Y=t(Y,X,W,V,C[P+4],U,4149444226);V=t(V,Y,X,W,C[P+11],T,3174756917);W=t(W,V,Y,X,C[P+2],R,718787259);X=t(X,W,V,Y,C[P+9],O,3951481745);Y=K(Y,h);X=K(X,E);W=K(W,v);V=K(V,g)}var i=B(Y)+B(X)+B(W)+B(V);return i.toLowerCase()};

        $scope.getAvatarUrl = function(emailAddy){
            var size = size || 80;
            return 'http://www.gravatar.com/avatar/' + MD5(emailAddy.trim()) + '.jpg?d=404';
        };

        $scope.showEditWatchersModal = function showEditWatchersModal(){
            $scope.showEditWatchers = true;
            $scope.watchers = ($scope.suite.watchers) ? $scope.suite.watchers.join("\n") : "";
        };

        $scope.saveWatchers = function(watchersString){
            var w = watchersString.split("\n").map(function(item){return item.trim()});
            $scope.suite.watchers = w;
            $scope.saveSuite($scope.suite)
                .then(function(){
                    $scope.showEditWatchers = false;
                })
        };

        $scope.runSuite = function(){
            $scope.isProcessing = true;

            SuitesService.run($scope.suite)
                .then(function(suiteRun){
                    $scope.isProcessing = false;
                },function(err){
                    alert(err);
                    $scope.isProcessing = false;
                })
        };

        $scope.showAddPages = function () {

            var modalInstance = $modal.open({
                templateUrl: 'app/suites/dialogs/addPageToSuite.html',
                controller: 'DialogAddPageToSuite',
                resolve: {
                    suite: function () {
                        return $scope.suite;
                    }
                }
            });

            modalInstance.result.then(function (snapshot) {
                SuitesService.addPageSnapshotAsMaster($scope.suite, snapshot)
                    .then(function(master){
                        $scope.suite.masterSnapshots.push(master);
                        $log.info(master);
                    })
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };


        $scope.removeSnapshot = function(masterSnapshot){
            $scope.isProcessing = true;
            SuitesService.removeSnapshotFromSuite($scope.suite, masterSnapshot)
                .then(function(){
                    $scope.isProcessing = false;

                },function(error){
                    console.error(error);
                    alert(error);
                    $scope.isProcessing = false;

                });
        };


        $scope.edit = function () {

            /*
             var sch = $scope.suite.schedule;
             for(var i in dayList){
             $scope.days[dayList[i]] = (sch.days.indexOf(parseInt(i)) != -1);
             }
             var localTime = new moment().utc().hours(sch.hour).minutes(sch.minute);
             $scope.suiteScheduleTime = localTime.local().format("HH:mm");
             console.log($scope.days);
             console.log($scope.suiteScheduleTime);
             */

            var modalInstance = $modal.open({
                templateUrl: 'app/suites/dialogs/suiteEditor.html',
                controller: 'DialogSuiteEditor',
                resolve: {
                    suite: function () {
                        return angular.copy($scope.suite);
                    }
                }
            });

            modalInstance.result.then(function (suite) {
                $scope.saveSuite(suite);
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };


        $scope.editSuite = function(suite){
            suite.scheduleEnabled = $scope.suiteScheduleEnabled
            suite.schedule.days = [];
            for(var i=0; i < dayList.length; i++){
                if($scope.days[dayList[i]]) suite.schedule.days.push(i);
            }
            var time = $scope.suiteScheduleTime.split(":");
            var d = new moment().hours(time[0]).minutes(time[1]).utc();
            suite.schedule.hour = d.hours();
            suite.schedule.minute = d.minutes();
            $scope.saveSuite(suite)
                .success(function(suite){
                    $scope.showEditSuite = false;
                })
        };

        $scope.saveSuite = function saveSuite(suite){
            var p = SuitesService.save( suite )
                .then(function(suite){
                    angular.extend($scope.suite, suite);
                    toastr.success("Suite Saved: " + suite.name);
                })
                .catch(function(err){
                    alert(err);
                });
        };


        $scope.getResultClass = function(result) {
            if(result.fail > 0 || result.exception > 0) {
                return "masterResult"
            }
            return "notMasterResult";
        };

        $scope.getDiffClass = function(diff) {
            if(diff.distortion == -1) {
                return "exception";
            } else if(diff.distortion == 0) {
                return "pass";
            } else {
                return "fail";
            }
        };

        $scope.getSuite = function(id){
            var promise = SuitesService.get( id )
                .success(function(suite){
                     $scope.suite = suite
                })
                .error(function(err){
                    alert(err)
                });
        };


        $scope.getSuite($routeParams.id);
    });
});
