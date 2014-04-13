define([
    "scyllaApp",
    "moment"
], function(
    scyllaApp,
    moment
    ){


    scyllaApp.filter('dateFormatter', function() {
            return function(isoString) {
                if(typeof isoString === "undefined") return "";
                return moment(isoString).format("MMMM Do, h:mm A");
            }
        });
    scyllaApp.filter('snapshotImage', function(){
            return function(snapshot){
                if(!snapshot || !snapshot.hasOwnProperty('id')){
                    return '/images/broken.png';
                }
                return '/snapshots/' + snapshot.id + '/image';
            };
    });

    return scyllaApp;
});