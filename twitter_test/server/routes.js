var express = require('express'),
    bodyParser  = require('body-parser');

module.exports = function (app) {
  var twitRouter = express.Router();

  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());

  app.use('/api', twitRouter);

  require('./routes/twitterRoute.js')(twitRouter);
};

