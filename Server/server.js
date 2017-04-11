var app = require('express')(),
    server = require('http').createServer(app);

var board = require('./root.js');
app.use('/', board);

app.listen(8080);