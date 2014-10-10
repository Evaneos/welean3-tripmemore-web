
var mongoose = require('mongoose');

var Schema       = mongoose.Schema;

var PinSchema   = new Schema({
    origin: String,
    date : { type : Date, default : Date.now },
    place: Schema.Types.Mixed,
    media: Schema.Types.Mixed
});

module.exports = mongoose.model('Pin', PinSchema);