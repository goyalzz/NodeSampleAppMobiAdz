var express = require('express');
var path= require('path');
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

module.exports = router;
