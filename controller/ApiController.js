// https://scotch.io/tutorials/build-a-restful-api-using-node-and-express-4
// http://www.tutorialspoint.com/nodejs/nodejs_response_object.htm
// http://lollyrock.com/articles/nodejs-encryption/
// https://scotch.io/tutorials/creating-a-single-page-todo-app-with-node-and-angular
// https://expressjs.com/en/starter/static-files.html

var express = require('express');
var bodyParser = require('body-parser');
var Constants = require('../utils/Constants.js');
var Utils = require('../utils/Utils.js');
var MobileService = require('../utils/mongoUtils/MobileService.js');
var morgan = require('morgan'); // log requests to the console (express4)

var app = express();

app.use(express.static('./public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(morgan('dev')); // log every request to the console

app.listen(Constants.PORT);
console.log("App listening on port " + Constants.PORT);

// Server frontpage
app.get('/', function (req, res) {
    res.status(400);
    // res.send('Invalid Request');
    res.json({ status: false, message: 'Invalid Request' }); 
});

// Server Admin
app.get('/admin', function (req, res) {
    res.sendfile('./public/admin/index.html');
});

// ROUTES FOR OUR API
// =============================================================================

// create our router
var router = express.Router();

// REGISTER OUR ROUTES -------------------------------
app.use('/api', router);

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    // console.log('Headers', JSON.stringify(req.headers));
    // console.log('Content-Type', req.headers['content-type']);
    if(req.headers['content-type'].indexOf('application/json') > -1 ) {
        next(); // make sure we go to the next routes and don't stop here
    } else {
        res.status(400);
        res.json({ status: false, message: 'Invalid Request Content-Type' });
        // res.send('Invalid Request Content-Type');
    }
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.status(200).json({ status: true, message: 'Hooray! welcome to our api!' });
});

// on routes that end in /mobileData
// ----------------------------------------------------
router.route('/newMobileData')

    // create a mobileData (accessed at POST http://localhost:8080/mobileData)
    .post(function(req, res) {
        if(Utils.jsonHasProperty(req.headers, 'authtoken')) {
            MobileService.findOne({id: Utils.decrypt(req.headers['authtoken']).id},
                function(err, dataOld) {
                if(err) res.status(400).json({ status: false, message: err.errors.data.message});
                Object.keys(req.body.data).forEach(function(k) {
                    dataOld.data[k] = req.body.data[k];
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
            MobileService.save(req.body.data, function(err, data) {
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

    // get all the mobileData (accessed at GET http://localhost:8080/api/mobileData)
    // .get(function(req, res) {
    //     res.status(200);
    //     res.send(req.query);
    // });

// on routes that end in /mobileData
// ----------------------------------------------------
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