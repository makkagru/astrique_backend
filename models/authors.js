var mongoose = require('mongoose');
var shortId = require('shortid');

var authorSchema = new mongoose.Schema({
    id: {
        type: String,
        default: shortId.generate()
    },
    name: String
});

var authorModel = mongoose.model('authorModel', authorSchema);

module.exports = authorModel;