'use strict';

const http            = require('http');
const express         = require('express');
const bodyParser      = require('body-parser');
const methodOverride  = require('method-override');
const fedHolidays     = require('@18f/us-federal-holidays');

const app = express();
const router = express.Router();

app.set('port', process.env.PORT || 5000);

app.use(router);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride());

router.all('*', function(req, res, next){
  if (!req.get('Origin')) {
    return next();
  }
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET');
  res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
  if ('OPTIONS' == req.method) {
    return res.send(200);
  }
  next();
});

// API routes
router.get('/', function (req, res) {
  let now = new Date;
  let year = now.getFullYear()
  let holidays = fedHolidays.allForYear(year);
  res.status(200).json({data: holidays});
});

app.use(function(req, res, next){  // if route not found, respond with 404
  const jsonData = {
    status: 'ERROR',
    message: 'Sorry, we cannot find the requested URI'
  };
  res.status(404).json(jsonData);  // set status as 404 and respond with data
});

const createExpressServer = function () {
  http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
  });
};

createExpressServer();
