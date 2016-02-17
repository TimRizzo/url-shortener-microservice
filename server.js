'use strict';

var express = require('express'),
    app = express(),
    mongoClient = require('mongodb').MongoClient;
    
    
mongoClient.connect("mongodb://localhost:27017/clementinejs", function(err, db) {
    if(err) {
        console.error("Could not connect to DB!");
    } else { 
        console.log("Connected to DB!"); 
        
        app.get('/*', function(req, res) {
            var response = {
            	"original url": req.url.substr(1),
                "short url": "",
                "db": db.collection('users').findOne({}),
                "headers": req.headers
            };
            res.send(response);
        });
    }
});


var port = process.env.PORT || 8080;
app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});