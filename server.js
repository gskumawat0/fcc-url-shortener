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
mongoose.connect(process.env.MONGO_URI,{ useNewUrlParser: true })
  .then(()=>console.log('database connected'))
  .catch((err)=>console.log(err.message));

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use('/public', express.static(process.cwd() + '/public'));

let urlSchema  = mongoose.Schema({
  original_url: String,
  short_url_id: String
});

let Url = mongoose.model('Url', urlSchema);

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

  
// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

app.post('/api/shorturl/new', async function(req, res){
  try{
    let {host} = new URL(req.body.url);
    dns.lookup(host, function(err, family, address){
      if(err){
        return res.json({
          error: 'Invalid Url'
        })
      };
    });
    let url = await Url.create({original_url : req.body.url});
    url.short_url_id = url._id.toString().slice(-6);
    url.save()
    
    return res.json({
      "original_url":url.original_url,
      "short_url":`host/shorturl/${url.short_url_id}`
    })
  }
  catch(err){
    return res.json({
      error: err.message
    })
  }
})

app.get('/shorturl/:shortUrlId', async function(req, res){
  try{
    let url = await Url.findOne({short_url_id: req.params.shortUrlId});
    res.redirect(url.original_url);    
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