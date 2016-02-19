'use strict';

var express = require('express'),
    mongo = require('mongodb').MongoClient,
    app = express(),
    urls = {};
        
mongo.connect('mongodb://localhost:27017/urls', function(err, db) {
    if(err) {
        console.log("Can't connect to DB!");
    } else {
        console.log("Connected to DB!");
        
   
        app.use('/*', function(req, res) {
          
        db.collection('userCreated').find({ "original url": req.params['0'] }).toArray(function(err, result) {
        if (err) {
            throw err;
            }
        res.send(result);
        });
        /*
        urls = {
        	"original url": req.url.substr(1),
            "short url": "",
            "db": db.collection('userCreated').findOne({"original url" : "http://testurl.com"})
        };
        
        res.send(urls);
        */
        });

        var port = process.env.PORT || 8080;
        app.listen(port,  function () {
        	console.log('Node.js listening on port ' + port + '...');
        });
    }
});
        
    
        
        



