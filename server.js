'use strict';

var express = require('express'),
    mongo = require('mongodb').MongoClient,
    app = express(),
    regex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
    urls = {};
        
mongo.connect('mongodb://localhost:27017/urls', function(err, db) {
    if(err) {
        console.log("Can't connect to DB!");
    } else {
        console.log("Connected to DB!");
   
        app.use('/*', function(req, res) {
            if(req.params['0'].match(regex)) {
                db.collection('userCreated').find({ "original url": req.params['0'] }).limit(1).toArray(function(err, result) {
                if (err) {
                    throw err;
                    }
                if(result.length === 0) {
                    db.collection('userCreated').insert(
                        {
                            "original url": req.params['0'],
                            "short url": "http://url-shortener-microservice-timrizzo.c9users.io/short"
                        });
                    urls = {
                    	"original url": req.params['0'],
                        "short url": "",
                        "db": "Not in DB!"
                    };
                } else {
                    urls = {
                    	"original url": req.params['0'],
                        "short url": "",
                        "db": result,
                        "typeof result": typeof result
                    };
                }
                res.send(urls);
                });
            } else {
                res.send("Not proper URL!");
            }
        });
    }
});
        
var port = process.env.PORT || 8080;
app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});
        
        



