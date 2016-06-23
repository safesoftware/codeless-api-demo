console.log('Loading function');
var https = require('https');
var querystring = require('querystring');
var host = 'transit-safe-software-inc-a8d03342-aba0-4088-8a6d-30cff3e2e2da.fmecloud.com';
var path = '/fmedatastreaming/Webinar/';
   
/*
* Handles the HTTP requests to FME Cloud.
*/
var makeHttpRequest = function (httpMethod, event, callback) {
    var dataJsonObj = '';
    var qs = querystring.stringify(event.params.querystring)
    var paths = querystring.stringify(event.params.path);
    
    var options = {
      hostname: 'transit-safe-software-inc-a8d03342-aba0-4088-8a6d-30cff3e2e2da.fmecloud.com',
      port: 443,
      path: path + event.workspace + '?' + qs + '&' + paths,
      method: httpMethod
    };

    var req = https.request(options, function(response){
        
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
            if(dataJsonObj === ""){
                if (callback) {
                    callback({
                        body: { "status": response.statusCode, "message": response.statusMessage},
                        statusCode: response.statusCode,
                        statusMessage: response.statusMessage
                    });
                }
            }else{
                
                //JSON was returned in the request, process.
                var parsed = JSON.parse(dataJsonObj);
                
                //FME can return a 200 HTTP status but send a warning error back, this
                //overrides the status code on the request object with the status code
                //in the JSON from FME.
                var statusCode;
                
                if(parsed.status){
                    //Use status code defined in JSON
                    statusCode = parsed.status;
                }else{
                    //Default to HTTP status code returned by request    
                    statusCode = response.statusCode;
                }
                
                if (callback) {
                    callback({
                        body: parsed,
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
* Handler that gets called by the API gateway.
*/
exports.handler = function(event, context) {
    try {
        var httpMethod = event.context["http-method"];
        makeHttpRequest(httpMethod, event, function (response) {
            return context.fail(JSON.stringify(response.body));
        });
    } catch (e) {
        context.fail(e);
    }
};