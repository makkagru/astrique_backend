var mongoose = require('mongoose');
var shortId = require('shortid');

var UserSchema = new mongoose.Schema({
    id: {
        type: String,
        default: shortId.generate()
    },
    userName: String,
    email: String,
    password: String
});

var UserModel = mongoose.model('UserModel', UserSchema);

module.exports = UserModel;