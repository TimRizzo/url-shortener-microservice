'use strict';

var express = require('express'),
    http = require('http'),
    mongo = require('mongodb').MongoClient,
    app = express(),
    regex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
    urls = {};
        
mongo.connect('mongodb://localhost:27017/urls', function(err, db) {
    if(err) {
        console.log("Can't connect to DB!");
    } else {
        console.log("Connected to DB!");
        var userCreated = db.collection('userCreated');
        app.use('/*', function (req, res) {
            // Determine if passed url is in database for forwarding
           var passedUrl = { "short url": req.protocol + "s://" + req.get('host') + "/" + req.params['0'] };
            
            userCreated.find(passedUrl).toArray(function(err,result) {
                if(err) { throw err; }
                console.log(passedUrl);
                if(result.length > 0) {
                res.redirect("http://www.google.com" );
                res.end();
                }
            });
        });
        
        /*
        
        
        app.use('/*', function(req, res) {
            
// If url submitted as param is in correct format, search in database           
            if(req.params['0'].match(regex)) {
               userCreated.find({ "original url": req.params['0'] }).limit(1).toArray(function(err, result) {
                if (err) {
                    throw err;
                    }
// If url submitted as param is not found in database, create new short url
                if(result.length === 0) {
                    var shortUrl = "https://url-shortener-microservice-timrizzo.c9users.io/" + Math.floor(Math.random() * 100 + 1);
// If new short url is not found in database, insert both urls in a new document
                   if(userCreated.find({ "short url" : shortUrl }).toArray().length === undefined) {
                       userCreated.insert(
                        {
                            "original url": req.params['0'],
                            "short url": shortUrl
                        }); 
                    } else {
                        console.log("Duplicate!" + userCreated.find({ "short url" : shortUrl }).toArray().length);
                    }
                    
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
                        "url": req.protocol + "//:" + req.get('host')
                    };
                }
                res.send(urls);
                });
            } else {
                res.send("Not proper URL!");
            }
        });
        
        */
    }
});
        
var port = process.env.PORT || 8080;
app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});
        
        



