# TripMeMore server

Server exposing the API for the tripmemore applications

Uses nodeJS with expressJS and mongoDB

Based on a lot of information found on http://scotch.io/tutorials/javascript/build-a-restful-api-using-node-and-express-4

## Installation

Simply run

    npm install

The package.json file contains everything you need

## Available routes

Opens a server on port 8080

The available routes are


### GET /api/pins/ 

Return the list of pins.
todo: implement possibility to filter the result by user_id and/or by keyword

### POST /api/pins/

Save a pin

### GET /api/pins/:pin_id

Fetches and return a pin


## Pin schema

Data are stored like this inside mongoDb :

var PinSchema   = new Schema({
   origin: String,
   date : { type : Date, default : Date.now },
   place: Schema.Types.Mixed,
   media: Schema.Types.Mixed
});

with media being something like this : { type: String, content: String }
and place being the result of a query from google place autocomple, as seen in the demo/search.html file link to the project


