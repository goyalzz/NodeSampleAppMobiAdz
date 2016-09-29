var express = require('express');
var path= require('path');
var UrlShortern = require('../utils/UrlShortern.js');
var Url = require('../mongoose/UrlSchema.js');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });
  res.sendFile(path.resolve('views') + '/home.html');
});

router.get('/ad.html', function(req, res, next) {
  // res.render('index', { title: 'Express' });
  res.sendFile(path.resolve('views') + '/ad.html');
});

router.get('/adserve.html', function(req, res, next) {
  // res.render('index', { title: 'Express' });
  res.sendFile(path.resolve('views') + '/adserve.html');
});

router.get('/blinktextad.html', function(req, res, next) {
  // res.render('index', { title: 'Express' });
  res.sendFile(path.resolve('views') + '/blinktextad.html');
});

router.get(['/tinyurl', '/tinyurl.html'], function(req, res, next) {
  // res.render('index', { title: 'Express' });
  res.sendFile(path.resolve('views') + '/tinyurl.html');
});

router.get(['/install', '/install.html'], function(req, res, next) {
  // res.render('index', { title: 'Express' });
  res.sendFile(path.resolve('views') + '/installad.html');
});

// ALWAYS AT LAST POSITION
router.get('/:encoded_id', function(req, res, next) {
  // check if url already exists in database
  Url.findOne({_id: UrlShortern.decode(req.params.encoded_id)}, function (err, doc){
    if (doc) {
      // found an entry in the DB, redirect the user to their destination
      res.redirect(doc.long_url);
    } else {
      // nothing found, take 'em home
      res.redirect(config.webhost);
    }
  });
});

module.exports = router;