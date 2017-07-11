var express = require('express')
var bodyParser = require('body-parser');
var app = express()

app.set('port', (process.env.PORT || 5000))
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get('/', function(request, response) {
  response.send('Hometrack Test Application, please send a POST request');
})

app.post('/', function(request, response) {
  var responseString = '';
  var requestPayload = request.body.payload;
  responseString = request.body;

  // check if request.body is JSON object or not by using try and catch - possibly convert it to string and parse back
  //console.log(typeof request.body);
  //console.log(requestPayload);
  for(var i in requestPayload)
  {
    var type = requestPayload[i].type;
    var status = requestPayload[i].status;
    console.log(" I:" + i + " Type:" + type + " Status:" + status);
  }

  response.send(responseString);
})

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
