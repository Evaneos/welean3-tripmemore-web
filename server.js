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

mongoose.connect('mongodb://localhost/tripmemore:27017');

var Schema       = mongoose.Schema;

var PinSchema   = new Schema({
    origin: String,
    date : { type : Date, default : Date.now },
    place: Schema.Types.Mixed,
    media: Schema.Types.Mixed
});

var Pin = mongoose.model('Pin', PinSchema);

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router


router.route('/pins')
    // create a bear (accessed at POST http://localhost:8080/api/bears)
    .post(function(req, res) {
        var response = new apiResponse();
        var pin = new Pin(req.body);
        // console.log (req.body);

        pin.save(function(err) {
            if (err){
                response.setFail(err);
            }
            else{
                response.setSuccess (pin);
            }

            res.json(response.getJson());
        });
    })
    .get(function(req, res) {
        var response = new apiResponse();
        var conditions = {};

        if (req.query.pin_id){
            conditions._id = req.query.pin_id;
        }
        if (req.query.user_id){
            conditions.user_id = user_id;
        }
        if (req.query.keyword){
            conditions['place.address_components.long_name'] = new RegExp(req.query.keyword,"i");
        }

        Pin.find(
            conditions,
            function(err, pins) {
                if (err){
                    response.setFail(err);
                }
                else{
                    response.setSuccess (pins);
                }

                res.json(response.getJson());
            }
        )    
    });

router.route('/pins/:pin_id')

    // get the bear with that id (accessed at GET http://localhost:8080/api/bears/:bear_id)
    .get(function(req, res) {
        var response = new apiResponse();
        Pin.findById(req.params.pin_id, function(err, pin) {
            if (err){
                response.setFail(err);
            }
            else{
                response.setSuccess (pin);
            }

            res.json(response.getJson());
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