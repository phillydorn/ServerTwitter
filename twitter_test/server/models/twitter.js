var Twitter = require('twitter');

var keys = require ('../../keys')
var stopWords = require('./stopWords')

var client = new Twitter({
  consumer_key: keys.consumerKey,
  consumer_secret: keys.consumerSecret,
  access_token_key: keys.accessToken,
  access_token_secret: keys.accessSecret
});


var topTen = {},
    allWords = {},
    total = 0;


function addToTotal (text) {
  text.forEach(function(word) {
    if (!allWords[word]) {
      allWords[word] = 0;
    }
    allWords[word]++;
    total++;
  });
}

function updateTopTen (text) {
  var min = Infinity,
      numberTen = '';
  for (var word in topTen) {
    if (topTen[word] < min) {
      numberTen = word;
      min = topTen[word];
    }
  }
  text.forEach (function (word) {
    if (topTen[word]) {
      topTen[word] = allWords[word];
    } else {
      if (Object.keys(topTen).length===11) {
        delete topTen[numberTen]
      }
      if (Object.keys(topTen).length === 10 && allWords[word] > min) {
        console.log('numberten', topTen[numberTen])
        delete topTen[numberTen];
        topTen[word] = allWords[word];
      } else if (Object.keys(topTen).length <10) {
        topTen[word] = allWords[word];
      }
    }
  })
  // console.log('tweet', text)
  // console.log('all', allWords)
  console.log('top', topTen)
  console.log('total', total)
}


module.exports = {
  getTweets: function(req, res) {
    var now = new Date();
    var nowUTC = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),  now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
    // var now = new Date().getTime();
    client.stream('statuses/sample.json', {language:'en'}, function(stream) {
      stream.on('data', function(tweet) {
        var tweetTime = Date.parse(tweet.created_at);
        var tweetDate = new Date(tweetTime);
        var tweetUTC = Date.UTC(tweetDate.getUTCFullYear(), tweetDate.getUTCMonth(), tweetDate.getUTCDate(),  tweetDate.getUTCHours(), tweetDate.getUTCMinutes(), tweetDate.getUTCSeconds());
        // console.log('now', nowUTC);
        // console.log('tweet', tweetUTC);
        // console.log('diff', nowUTC-tweetUTC);

        if (Math.abs(nowUTC-tweetTime) < 300000) {
          var text = tweet.text.toLowerCase().split(' ');
          text = text.filter(function(word) {
            var re = /^[a-z]+$/
            return re.test(word) && !stopWords[word];
          })
          addToTotal(text);
          updateTopTen(text);
        }
      });

      stream.on('end', function() {
        console.log('Total Words: ', total)
        res.send(topTen)
      })

      stream.on('error', function(error) {
        throw error;
      });
    });
  }
}