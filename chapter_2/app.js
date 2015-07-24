var express = require('express');
var app = express();
var port = 3030;

app.get('/name/:username', function(req,res){
	res.status(200);
	res.set('Content-type', 'text/html');
	res.send('<html><body><h1> Hello ' + req.params.username + '</h1></body></html>');
})


app.get('/*', function(req, res) {
    res.end('hello world');
})
app.listen(port, function() {
    console.log('http://localhost:%s', port)
})