var express = require('express')
var bodyParser = require('body-parser');
var app = express()

app.set('port', (process.env.PORT || 5000))
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get('/', function(request, response) {
  response.send('Web service simple application, please send a POST request with the list of property data in the request payload.');
})

app.post('/', function(request, response) {
  var responseObj = '';
  var requestPayload = request.body.payload;
  var responsePropertyArray = [];

  // check if request.body is JSON object or not by using try and catch - possibly convert it to string and parse back
  // console.log(typeof request.body);
  // console.log(requestPayload);

  for(var i in requestPayload)
  {
    if (requestPayload[i].type == 'htv' && requestPayload[i].workflow == 'completed') {
      var responsePropertyObj = {
        "concataddress": requestPayload[i].address.buildingNumber + " " + requestPayload[i].address.street + " " +
          requestPayload[i].address.suburb + " " + requestPayload[i].address.state + " " + requestPayload[i].address.postcode,
        "type": requestPayload[i].type,
        "workflow": requestPayload[i].workflow
      };
      responsePropertyArray.push(responsePropertyObj);
      
    }
  }

  responseObj = {"payload": responsePropertyArray };
  
  response.setHeader('Content-Type', 'application/json');
  response.send(JSON.stringify(responseObj));
})

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
