var express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
var User = require('../../models/users'); 

var router = express.Router();

router.post('/', function(req, res, next) {
    User.findOne({userName: req.body.user.userName}, function(err, user) {
      console.log(user);
        if (err) {
            return res.status(400).json({
                success: false,
                error: 'Something went wrong'
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
          jwt.sign({user}, 'cHrgAh4565$58|@56!aAhjAbnbWrT454Hw3rr55f4aG#%()4a1g5Ha', {expiresIn: '300d'}, function(err, token) {
            if (err) {
              return res.status(400).json({
                success: false,
                error: 'Something went wrong'
              });
            }
            res.status(200).json({
              success: true,
              token
            });
          });
    });
  });
});

module.exports = router; 