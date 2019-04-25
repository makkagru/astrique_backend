var express = require('express');
const bcrypt = require('bcrypt');
var User = require('../../models/users'); 

var router = express.Router();

router.post('/', function(req, res, next) {
    User.findOne({userName: req.body.user.userName}, function(err, user) {
        if (err) {
            return res.status(400).json({
                success: false,
                error: 'Something went wrong',
            });
        }

        bcrypt.compare(req.body.user.password, user.password, function(err, result) {
          if (err) {
            return res.status(400).json({
              success: false,
              error: 'Something went wrong'
            });
          }

          if (!result) {
            return res.status(400).json({
              error: 'Wrong login or password',
              success: false
            })
          }
          res.status(200).json({
            success: true
          });
        });
    });
});

module.exports = router;