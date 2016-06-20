console.log('Loading function');
var http = require('https');
var querystring = require('querystring');
var host = 'transit-safe-software-inc-a8d03342-aba0-4088-8a6d-30cff3e2e2da.fmecloud.com';
var path = '/fmedatastreaming/Webinar/';
    
/*
* Handles the GET requests.
*/
var getRequest = function (event, callback) {
    
    var dataJsonObj = "";
    var qs = querystring.stringify(event.params.querystring);
    var paths = querystring.stringify(event.params.path);

    var options = {
      host: host,
      port: 443,
      path: path + event.workspace + '?' + qs + '&' + paths,
      method: 'GET'
    };

    var req = http.request(options, function(response){
        //Trigger an error response if the ajax request fails  
    
        response.on('error', function(d) {
            console.log("error");
            if (callback) {
                callback({
                    statusCode: response.statusCode
                });
            }
        });
        
        //Populate the JSON object as data comes in.
        response.on('data', function(d) {
            if (response.headers['content-type'] === 'application/json') {
                dataJsonObj += d;
            }
        });
        
        //Populate the callback object with the json response and status code.
        response.on('end', function(d) {
            if (dataJsonObj){
                var parsed = JSON.parse(dataJsonObj);                
            }else{
                parsed = [];
            }
            if (callback) {
                callback({
                    body: parsed,
                    statusCode: response.statusCode
                });
            }
        });
      return response;
    });
    req.end();
};

/*
* Handles the POST requests.
*/
var postRequest = function (event, callback) {
    var dataJsonObj = "";
    var qs = querystring.stringify(event.params.querystring)
    var paths = querystring.stringify(event.params.path);
    
    var options = {
      hostname: 'transit-safe-software-inc-a8d03342-aba0-4088-8a6d-30cff3e2e2da.fmecloud.com',
      port: 443,
      path: path + event.workspace + '?' + qs + '&' + paths,
      method: 'POST'
    };

    var req = http.request(options, function(response){
        //Trigger an error response if the ajax request fails
        
        response.on('error', function(d) {
            console.log("error");
            if (callback) {
                callback({
                    statusCode: response.statusCode
                });
            }
        });
        
        //Populate the JSON object as data comes in.
        response.on('data', function(d) {
            if (response.headers['content-type'] === 'application/json') {
                dataJsonObj += d;
            }
        });
        
        //Populate the callback object with the json response and status code.
        response.on('end', function(d) {

            //Check to see if there is any data returned from the request
            if(typeof dataJsonObj != 'undefined'){
                var parsed = JSON.parse(dataJsonObj);
                
                //FME can return a 200 HTTP status but send a warning error back, this
                //overrides the status code on the request object with the status code
                //in the JSON from FME.
                var statusCode;
            
                if(parsed.status){
                    statusCode = parsed.status;
                }else{
                    statusCode = response.statusCode;
                }
                
                if (callback) {
                    callback({
                        body: parsed,
                        statusCode: statusCode,
                        statusMessage: response.statusMessage
                    });
                }
            }else{//Error with request

                if (callback) {
                    callback({
                        body: { "status": response.statusCode, "message": response.statusMessage},
                        statusCode: statusCode,
                        statusMessage: response.statusMessage
                    });
                }
            }
        });
      return response;
    });
    req.end();
};

/*
* Handles the POST requests.
*/
var putRequest = function (event, callback) {
    var dataJsonObj = "";
    var qs = querystring.stringify(event.params.querystring);
    var paths = querystring.stringify(event.params.path);
    
    var options = {
      hostname: 'transit-safe-software-inc-a8d03342-aba0-4088-8a6d-30cff3e2e2da.fmecloud.com',
      port: 443,
      path: path + event.workspace + '?' + qs + '&' + paths,
      method: 'PUT'
    };

    var req = http.request(options, function(response){
        //Trigger an error response if the ajax request fails
        
        response.on('error', function(d) {
            console.log("error");
            if (callback) {
                callback({
                    statusCode: response.statusCode
                });
            }
        });
        
        //Populate the JSON object as data comes in.
        response.on('data', function(d) {
            if (response.headers['content-type'] === 'application/json') {
                dataJsonObj += d;
            }
        });
        
        //Populate the callback object with the json response and status code.
        response.on('end', function(d) {

            //Check to see if there is any data returned from the request
            if(typeof dataJsonObj != 'undefined'){
                var parsed = JSON.parse(dataJsonObj);
                
                //FME can return a 200 HTTP status but send a warning error back, this
                //overrides the status code on the request object with the status code
                //in the JSON from FME.
                var statusCode;
            
                if(parsed.status){
                    statusCode = parsed.status;
                }else{
                    statusCode = response.statusCode;
                }
                
                if (callback) {
                    callback({
                        body: parsed,
                        statusCode: statusCode,
                        statusMessage: response.statusMessage
                    });
                }
            }else{//Error with request

                if (callback) {
                    callback({
                        body: { "status": response.statusCode, "message": response.statusMessage},
                        statusCode: statusCode,
                        statusMessage: response.statusMessage
                    });
                }
            }
        });
      return response;
    });
    req.end();
};

var triggerResponseToAPI = function (response, context) {
    return context.fail(JSON.stringify(response.body));
}

/*
* Triage if it is a GET, POST, PUT and DELETE.
*/
var processEvent = function (event, context) {
    
    if(event.context["http-method"] === "GET"){
        getRequest(event, function (response) {

            if (response.statusCode < 400) {
                //Success, just send raw data back through.
                context.succeed(response.body);
                
            } else if (response.statusCode < 500) {
                //Error with request. Either params are bad or their was an internal error.
                return context.fail('Bad Request: You submitted invalid input.');
                
            } else {
                // Catch all error request
                return context.fail('Invalid Request: Unexpected condition was encountered.');
            }           
        });
    }else if (event.context["http-method"] === "POST"){
        postRequest(event, function (response) {
            triggerResponseToAPI(response,context);
        });
    }else if (event.context["http-method"] === "PUT"){
        putRequest(event, function (response) {
            triggerResponseToAPI(response,context);
        });
    }
};

/*
* Handler that gets called by the API gateway.
*/
exports.handler = function(event, context) {
    try {
        processEvent(event, context);
    } catch (e) {
        context.fail(e);
    }
};