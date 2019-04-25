var mongoose = require('mongoose');
var shortId = require('shortid');

var ListingSchema = new mongoose.Schema({
    
    id: {
        type: String,
        default: shortId.generate()
    },
    name: String,
    authorId: String,
    photo: String,
    collectionId: String
});

var ListingModel = mongoose.model('ListingModel', ListingSchema);

module.exports = ListingModel;