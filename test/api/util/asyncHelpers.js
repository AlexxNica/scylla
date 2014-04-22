module.exports = function(host, port){
    var http = require("q-io/http");

    var newRequest = function (method, path, body) {
        return {
            host   : host,
            port   : port,
            method : method,
            path   : path,
            headers: {"Content-type": "application/json"},
            body   : (body) ? [JSON.stringify(body)] : undefined
        };
    };

    var getRequest = function (path) {
        return newRequest("GET", path);
    };
    var postRequest = function (path, body) {
        return newRequest("POST", path, body);
    };
    var putRequest = function (path, body) {
        return newRequest("PUT", path, body);
    };
    var delRequest = function (path, body) {
        return newRequest("DELETE", path, body);
    };
    var getResponse = function(requestObject){
        return http.request(requestObject);
    };
    var getJsonObject = function (requestObject) {
        //console.log("Sending: " + requestObject.method + ": " + requestObject.path);
        return getResponse(requestObject)
            .then(function (response) {
                //console.log("Received " + requestObject.path + ": ", response.status)
                if (response && response.status == 200) {
                    return response.body.read()
                        .then(function (body) {
                            return JSON.parse(body.toString());
                        });
                } else {
                    if(response.status != 404){
                        console.error("\nError with URL: ",requestObject.method, requestObject.path);
                        console.error("Status: " + response.status);
                        return response.body.read()
                            .then(function(body){
                                throw new Error(body.toString());
                            });
                    } else {
                        throw new Error(response.status);
                    }

                }
            });

    };

    return {
        newRequest:newRequest,
        getRequest:getRequest,
        postRequest:postRequest,
        putRequest:putRequest,
        delRequest:delRequest,
        getResponse:getResponse,
        getJsonObject:getJsonObject
    };
};
