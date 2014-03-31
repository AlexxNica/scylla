
i = $('<iframe src="' + window.SCYLLA_URL +'/#/pages/bookmarklet?title=' + document.title +'&url=' + location.href +'" style="position:absolute;top:0px;width:700px;height:400px;"></iframe>');
$(document.body).append(i);
i.css('z-index',10000);
window.addEventListener('message',function(event){
    console.log(event);
    if(event.data === "close"){
        i.remove();
    }
}, false);