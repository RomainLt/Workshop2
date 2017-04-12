var express = require('express');

var app = express();

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res, next) {
    res.render('./public/index.html');
});

var port = (process.env.PORT || '8080');

app.listen(port);