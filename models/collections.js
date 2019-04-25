var mongoose = require('mongoose');
var shortId = require('shortid'); 

var collectionSchema = new mongoose.Schema({
    id: {
        type: String,
        default: shortId.generate()
    },
    name: String
});

var collectionModel = mongoose.model('collectionModel', collectionSchema);

module.exports = collectionModel;