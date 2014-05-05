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

    scyllaApp.filter('pageThumb', function(){
        return function(page){
            if(!page || !page.hasOwnProperty('id')){
                return '/images/broken.png';
            }
            return '/pages/' + page.id + '/thumb';
        };
    });

    scyllaApp.filter('snapshotImage', function(){
            return function(snapshot){
                if(!snapshot || !snapshot.hasOwnProperty('id')){
                    return '/images/broken.png';
                }
                return '/snapshots/' + snapshot.id + '/image';
            };
    });

    scyllaApp.filter('snapshotThumb', function(){
        return function(snapshot){
            if(!snapshot || !snapshot.hasOwnProperty('id')){
                return '/images/broken.png';
            }
            return '/snapshots/' + snapshot.id + '/image';
        };
    });

    scyllaApp.filter('diffImage', function(){
        return function(diff){
            if(!diff || !diff.hasOwnProperty('id')){
                console.log("Can't Get Image for: " ,diff);
                return '/images/broken.png';
            }
            return '/snapshotDiffs/' + diff.id + '/image';
        };
    });

    scyllaApp.filter('diffThumb', function(){
        return function(diff){
            if(!diff || !diff.hasOwnProperty('id')){
                console.log("Can't Get Image for: " ,diff);
                return '/images/broken.png';
            }
            return '/snapshotDiffs/' + diff.id + '/image';
        };
    });

    scyllaApp.filter('distortionClass', function(){
        return function(diff){
            if(!diff || !diff.hasOwnProperty('distortion')){
                console.log("Can't Get Distortion for: " ,diff);
                return '';
            }
            if(diff.distortion === -1){
                return 'exception';
            } else if(diff.distortion === 0){
                return 'pass';
            } else {
                return 'fail';
            }
            return '/snapshotDiffs/' + diff.id + '/image';
        };
    });

    return scyllaApp;
});