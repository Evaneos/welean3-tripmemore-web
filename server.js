// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
var apiResponse   = require('./lib/apiResponse');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port


mongoose.connect('mongodb://node:node@localhost:27017');

var Schema       = mongoose.Schema;

var PinSchema   = new Schema({
    origin: String
});

module.exports = mongoose.model('Pin', PinSchema);



// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router


router.route('/pins')
    // create a bear (accessed at POST http://localhost:8080/api/bears)
    .post(function(req, res) {
        var response = new apiResponse();
        var pin = new Pin();
        // set data
        console.log (req.body);
        pin.origin = req.body.origin;

        pin.save(function(err) {
            if (err){
                response.setFailure (err);
            }
            else {
                response.setSuccess ({ message: 'Pin created!' });
            }

            res.json(response.getJson());
        });
    })
    .get(function(req, res) {
        Pin.find(function(err, pins) {
            if (err)
                res.send(err);

            res.json(pins);
        });
    });

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    var result = { message: 'hooray! welcome to our api!' };
    var response = new apiResponse();
    response.setSuccess (result);

    res.json(response.getJson());
});

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);