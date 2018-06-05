var app = require('express')();
var nunjucks = require('nunjucks');
var bodyParser = require('body-parser');
var axios = require('axios');
var apicache = require('apicache');
var cache = apicache.middleware;

var hidden = require('./config.js');

var api_url;

nunjucks.configure('views', {
  autoescape: true,
  express: app,
  noCache: true
});

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.get('/', function (req, res) {
  res.render('index.html');
});

//Grabs the coordinates from front end AJAX
app.post('/api', function (req, res) {
  var data = req.body;
  var latitude = data.latitude;
  var longitude = data.longitude;
  api_url = hidden._api_url + `${latitude},${longitude}`;
});

app.get('/api', cache('5 minutes'), function (req, res) {
  var config = {};

  axios.get(api_url, config)
    .then(function (response) {
      var summary = response.data.currently;
      console.log(summary);
      res.json(summary);
    })
    .catch(function (error) {
      console.error(error);
    });
});

app.listen(8000, function () {
  console.log('Listening on port 8000');
});
