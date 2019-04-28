var express = require('express');
const bcrypt = require('bcrypt');
var User = require('../../models/users');
var router = express.Router();



router.post('/', function(req, res, next) {
    if (!req.body.user) {
        res.status(400).json({
            success: false,
            error: 'User must be sent in request'
        });
    }

   bcrypt.hash(req.body.user.password, 10, function(err, hash) {
      if (err) {
        res.status(400).json({
          success: false,
          error: 'Something went wrong'
        });
      }
      User.create({
          userName: req.body.user.userName,
          email: req.body.user.email,
          password: hash,
      }, function(err, user) {
          if(err) {
              res.status(400).json({
                  success: false,
                  error: 'Could not create user'
              });
          }
          res.status(200).json({
              success: true,
              data: user
          });
      });
    });
});

router.put('/', function(req, res, next) {
    User.findOne({userName: req.body.user.userName}, function(err, user) {
        if (err) {
            res.status(400).json({
                success: false,
                error: 'Could not edit account'
            });
        }

        if (req.body.user.userName) {
            user.userName = req.body.user.userName;
        }

        if(req.body.user.Email) {
            user.Email = req.body.user.Email;
        }

        if(req.body.user.password) {
            user.password = req.body.user.password;
        }

        User.save(function(err) {
            if (err) {
                res.status(400).json({
                    success: false,
                    error: 'Could not save changes'
                });
            }

            res.status(200).json({
                success: true,
                data: user
            });
        });
    });
});

module.exports = router;