'use strict';

var express = require('express'),
    app = express();

app.get('/*', function(req, res) {
    var response = {
        "ip": req.headers['x-forwarded-for'],
        "language": req.headers['accept-language'].split(',').splice(0,1).join(''),
        "OS": req.headers['user-agent'].split('(').splice(1,1).join('').split(';').splice(0,1).join('')
    };
    res.send(response);
});

app.listen(8080, function() {
    console.log("Node is listening on port 8080");
});
