'use strict';

var express = require('express'),
    mongo = require('mongodb').MongoClient,
    app = express(),
    regex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
    urls = {};
    
// Connect to db 'urls'        
mongo.connect('mongodb://localhost:27017/urls', function(err, db) {
    if(err) {
        console.log("Can't connect to DB!");
    } else {
        console.log("Connected to DB!");
        var userCreated = db.collection('userCreated');
        
        app.use('/*', function(req, res) {
// Filter out favicon            
            if(req.params['0'] !== "favicon.ico") {
// Determine if passed url is in db for forwarding
            var passedUrl = req.protocol + "s://" + req.get('host') + "/" + req.params['0'];
            
            userCreated.find({ "short url": passedUrl }, { "_id": 0, "original url": 1, "short url": 1 }).toArray(function(err,result) {
                if(err) { throw err; }
                console.log(req.params['0']);
// If passed url is found in db, redirect to it and return                
                if(result.length > 0) {
                return res.redirect(result[0]['original url']);
                } else {
// If passed url is not in db, check if it's the root, and if so, display instructions                    
                    if(req.params['0'] === "") {
                       var instructions = {
                           "Welcome": "Say hello to the Callback Hell URL Shortener!",
                           "Use": "Add the URL to be shortened as a param",
                           "Example": "https://url-shortener-microservice-timrizzo.c9users.io/http://callbackhell.com",
                           "Thank you": "No, thank YOU"
                       };
                     res.send(instructions);  
// If it's not in db or root, check submitted param for correct format, then search for it in db                             
                    } else if(req.params['0'].match(regex)) {
                       userCreated.find({ "original url": req.params['0'] },
                                        { "_id":0, "original url": 1, "short url": 1 }).toArray(function(err, result) {
                        if (err) { throw err; }
// If url submitted as param is not found in db, create new short url based on current # of entries in db
                        if(result.length === 0) {
                            userCreated.find({},{"_id":0}).toArray(function(err, result) {
                                if(err) { throw err; }
                                console.log(result.length);
//Compose db entry and response                                    
                                urls = {
                            	"original url": req.params['0'],
                                "short url": "https://url-shortener-microservice-timrizzo.c9users.io/" + result.length
                                };
                                userCreated.insert(urls);
                                res.send(urls);
                            });
                        } else {
// If the url passed as param was found in the db, show it                            
                        res.send(result);
                        }
                      });
                    } else {
                        var errorMsg = {
                            "Error": "G'dang y'all!",
                            "Details": "Not proper URL",
                            "Instructions": "https://url-shortener-microservice-timrizzo.c9users.io"
                        };
                        res.send(errorMsg);
                    }
                }
            });
          }
      });
    }
});
        
var port = process.env.PORT || 8080;
app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});
        
        



