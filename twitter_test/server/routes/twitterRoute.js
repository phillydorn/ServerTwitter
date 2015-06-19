var twit = require('../models/twitter.js');

module.exports = function (app) {

  app.get('/tweets', twit.getTweets);

};



