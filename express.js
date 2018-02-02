var express = require('express');
var compression = require('compression');
var app = express();

app.use(compression());
app.use("/", express.static(__dirname + '/build'));

var port = process.env.PORT || 3000;

console.log('Listening on http://0.0.0.0:' + port);
app.listen(port, '0.0.0.0');
