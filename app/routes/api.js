'use strict';

var Pin = require('../models/pin');
var apiResponse = require('../../lib/apiResponse');

module.exports = function(app) {

    app.post('/api/pins', function(req, res) {
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
    });

    app.get ('/api/pins', function(req, res) {
        var response = new apiResponse();
        var conditions = {};

        if (req.query.pin_id){ // jshint ignore:line
            conditions._id = req.query.pin_id; // jshint ignore:line
        }
        if (req.query.user_id){ // jshint ignore:line
            conditions.user_id = user_id; // jshint ignore:line
        }
        if (req.query.keyword){
            conditions['place.address_components.long_name'] = new RegExp(req.query.keyword,'i');
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
        );
    });

    app.get ('/api/pins/:pin_id',
        function(req, res) {
            var response = new apiResponse();
            Pin.findById(req.params.pin_id, function(err, pin) { // jshint ignore:line
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
    app.get('/api', function(req, res) {
        var result = { message: 'hooray! welcome to our api!' };
        var response = new apiResponse();
        response.setSuccess (result);

        res.json(response.getJson());
    });
};