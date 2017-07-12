var express = require('express')
var app = express()

app.set('port', (process.env.PORT || 5000))
app.use(function(request, response, next){
  // manually parse request body
  var data = "";
  request.on('data', function(chunk){ data += chunk})
  request.on('end', function(){
  request.rawBody = data;
    try {
      request.body = JSON.parse(data);
    } catch (e) {
      // set the request.body to empty string if request body is not JSON
      // this check will ignore Content-Type header for this code test purpose
      request.body = "";
    }
    next();
   })
})

app.get('/', function(request, response) {
  response.send('Web service simple application, please send a POST request with the list of property data in the request payload.');
})

app.post('/', function(request, response) {
  response.setHeader('Content-Type', 'application/json');

  if (request.body === '') {
    // return 400 Bad Request containing the following JSON data for failed JSON parsing
    // this check can be further improved by validating against JSON schema (can be implemented if required)
    response.status(400);
    response.end('{"error": "Could not decode request: JSON parsing failed"}');
    console.log("Could not decode request: JSON parsing failed");
    return;
  }

  var responseObj = '';
  var requestPayload = request.body.payload;
  var responsePropertyArray = [];

  // loop through the property object array and filter those with type htv 
  // and workflow completed
  for (var i=0; i<requestPayload.length; i++) {

    if (requestPayload[i].type == 'htv' && requestPayload[i].workflow == 'completed') {
      var responsePropertyObj = {
        "concataddress": requestPayload[i].address.buildingNumber + " " + 
                        requestPayload[i].address.street + " " +
                        requestPayload[i].address.suburb + " " + 
                        requestPayload[i].address.state + " " + 
                        requestPayload[i].address.postcode,
        "type": requestPayload[i].type,
        "workflow": requestPayload[i].workflow
      };
      responsePropertyArray.push(responsePropertyObj);
      
    }
  }

  responseObj = {"response": responsePropertyArray};
  response.end(JSON.stringify(responseObj));
})

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
