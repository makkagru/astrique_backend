var mongoose = require('mongoose');
var shortId = require('shortid');

var ListingSchema = new mongoose.Schema({
    
    id: {
        type: String,
        default: shortId.generate()
    },
    name: String,
    author: Object,
    photo: String,
    col: Object,
    value: Number
});

var ListingModel = mongoose.model('ListingModel', ListingSchema);

module.exports = ListingModel;