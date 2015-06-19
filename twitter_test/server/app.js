
var express = require('express');
    app = express(),
    bodyParser = require ('body-parser'),
    keys = require ('../keys.js');

  app.use(express.static('./client'));
  require('./routes')(app);



  app.set('port', 3000);
  app.listen(app.get('port'), function() { console.log('Node app running on port', app.get('port')) });

