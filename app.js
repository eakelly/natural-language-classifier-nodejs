/**
 * Copyright 2015 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

var express    = require('express'), //require = import
  app          = express(),
  watson       = require('watson-developer-cloud');

// Bootstrap application settings
require('./config/express')(app);

// Create the service wrapper
var nlClassifier = watson.natural_language_classifier({ //NLC object
  url : 'https://gateway.watsonplatform.net/natural-language-classifier/api',
  username : '63e125ea-cc04-4130-91c5-c2d94cdeee5d',
  password : 'Z2vXRDDUlt6I',
  version  : 'v1'

});

// render index page
//routes, specifies function
//this is what will happen to the response that is received
app.get('/', function(req, res) { //get info to be displayed
  console.log('CUNY TECH');
  res.render('index', {
    ct: req._csrfToken,
    ga: process.env.GOOGLE_ANALYTICS
  });
});

// Call the pre-trained classifier with body.text
// Responses are json
app.post('/api/classify', function(req, res, next) { //sends data to backend
  //creates a new (key,value) in hashmap
  var params = {
    classifier: process.env.CLASSIFIER_ID || '3a84cfx63-nlc-374', // pre-trained classifier
    text: req.body.text //what we are trying to classify
  };

  //console.log(params);
  //the NLC object takes in json obj.
  //once classify executes, then function will -> asynchronous
  nlClassifier.classify(params, function(err, results) {
    if (err)
      return next(err);
    else
      res.json(results);
  });
});

require('./config/error-handler')(app);

module.exports = app;
