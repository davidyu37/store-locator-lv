var express = require('express')
var app = express()

app.use("/", express.static(__dirname + '/build'));

// app.get('/', function (req, res) {
  // res.send('Hello World')
// })

console.log('Listening on http://0.0.0.0:3000');
app.listen(3000, '0.0.0.0')
