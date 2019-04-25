var express = require('express');
var User = require('../../models/users');
var router = express.Router();

router.post('/', function(req, res, next) {
    User.findOne({userName: req.body.user.userName}, function(err, user) {
        if (err) {
            res.status(400).json({
                success: false,
                error: 'Something went wrong',
            });
        }

        if (req.body.user.password == user.password) {
            return res.status(200).json({
                success: true,
            });
        }

        res.status(400).json({
            success: false,
            error: 'Wrong username or password'
        });
    });
});

module.exports = router;