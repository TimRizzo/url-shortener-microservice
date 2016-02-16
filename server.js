'use strict';

var express = require('express'),
    app = express();

app.get('/*', function(req, res) {
    var response = {
        
    }
    res.send(req.url);
});


var port = process.env.PORT || 8080;
app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});