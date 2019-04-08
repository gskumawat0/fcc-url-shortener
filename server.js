'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cors = require('cors');
const dns = require('dns');
var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
// mongoose.connect(process.env.MONGOLAB_URI);

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

  
// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

app.post('/api/shorturl/new', async function(req, res){
  try{
    let {host} = await new URL(req.body.url);
    dns.lookup(host, function(err, family, address){
      if(err){
        throw  Error('Invalid Url');
      };
    });
    res.redirect('/');
  }
  catch(err){
    return res.json({
      error: err.message
    })
  }
})


app.listen(port, function () {
  console.log('Node.js listening ...');
});