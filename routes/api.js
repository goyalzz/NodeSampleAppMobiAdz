var express = require('express');
var router = express.Router();

var Utils = require('../utils/Utils.js');
var UrlShortern = require('../utils/UrlShortern.js');
var MobileService = require('../mongoose/MobileService.js');
var Url = require('../mongoose/UrlSchema.js');

router.use(function(req, res, next) {
    // do logging
    // console.log('Headers', JSON.stringify(req.headers));
    // console.log('Content-Type', req.headers['content-type']);
    if(Utils.checkNotUndefined(req.headers['content-type'])
    	&& req.headers['content-type'].indexOf('application/json') > -1 ) {
        next(); // make sure we go to the next routes and don't stop here
    } else {
        res.status(400);
        res.json({ status: false, message: 'Invalid Request Content-Type' });
        // res.send('Invalid Request Content-Type');
    }
});

/* GET users listing. */
router.get('/', function(req, res, next) {
	res.status(200).json({ status: true, message: 'Hooray! welcome to our api!' });
});

router.route('/newMobileData')

    // create a mobileData (accessed at POST http://localhost:8080/mobileData)
    .post(function(req, res) {
        if(Utils.jsonHasProperty(req.headers, 'authtoken')) {
            MobileService.findOne({id: Utils.decrypt(req.headers['authtoken']).id},
                function(err, dataOld) {
                if(err) res.status(400).json({ status: false, message: err.errors.data.message});
                var requestData = Utils.isJsonString(req.body.data) ? JSON.parse(req.body.data) : req.body.data;
                Object.keys(requestData).forEach(function(k) {
                    dataOld.data[k] = requestData[k];
                });
                dataOld.markModified('data');
                MobileService.update(dataOld, function(errNew, dataNew) {
                    if(errNew) res.status(400).json({ status: false, message: errNew.errors.data.message});
                    var returnData = {
                        id: dataNew.id,
                        data: dataNew.data,
                        created: dataNew.created,
                        AuthToken: req.headers['authtoken']
                    };
                    res.status(200).json({ status: true, message: "Successfully Updated", data: returnData });
                });
            });
        } else {
            MobileService.save(Utils.isJsonString(req.body.data) ? JSON.parse(req.body.data) : req.body.data,
             function(err, data) {
                if(err) res.status(400).json({ status: false, message: err.errors.data.message});
                var returnData = {
                    id: data.id,
                    data: data.data,
                    created: data.created,
                    AuthToken: Utils.encrypt(JSON.stringify({id: data.id, timeStamp: new Date().getTime()}))
                };
                res.status(200).json({ status: true, message: "Successfully Inserted", data: returnData });
            });
        }
    });

router.route('/mobileData/:id')

    // create a mobileData (accessed at POST http://localhost:8080/mobileData)
    .post(function(req, res) {
        res.status(200);
        res.send(req.body);
    })

    // get all the mobileData (accessed at GET http://localhost:8080/api/mobileData)
    .get(function(req, res) {
        res.status(200);
        res.send(req.params);
    });

router.post('/urlshorten', function(req, res) {
    var requestData = Utils.isJsonString(req.body) ? JSON.parse(req.body) : req.body;
    var longUrl = requestData.url;
    var shortUrl = '';

    // check if url already exists in database
    Url.findOne({long_url: longUrl}, function (err, doc){
        if (doc){
            // URL has already been shortened
            // base58 encode the unique _id of that document and construct the short URL
            shortUrl = "mobiadzapi.herokuapp.com/" + UrlShortern.encode(doc._id);
            res.status(200).json({
                status: true,
                message: "Successfully Shortern",
                data: shortUrl
            });
            // since the document exists, we return it without creating a new entry
        } else {
            // The long URL was not found in the long_url field in our urls
            // collection, so we need to create a new entry
            var newUrl = Url({
                long_url: longUrl
            });

            // save the new link
            newUrl.save(function(err) {
                if (err) res.status(400).json({ status: false, message: err.errors.data.message});
                // construct the short URL
                shortUrl = "mobiadzapi.herokuapp.com/" + UrlShortern.encode(newUrl._id);
                res.status(200).json({
                    status: true,
                    message: "Successfully Shortern",
                    data: shortUrl
                });
            });
        }
    });
});

module.exports = router;