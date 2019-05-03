var mongoose = require('mongoose');
var shortId = require('shortid');

var mediaSchema = new mongoose.Schema({
    id: {
        type: String,
        default: shortId.generate()
    },
    path: String
});

var mediaModel = mongoose.model('mediaModel', mediaSchema);

module.exports = mediaModel;