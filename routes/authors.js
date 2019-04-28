var express = require('express');
var Author = require('../models/authors')
const jwt = require('jsonwebtoken')
var router = express.Router();

router.post('/', function(req, res, next) {
  jwt.verify(req.body.author.token, 'cHrgAh4565$58|@56!aAhjAbnbWrT454Hw3rr55f4aG#%()4a1g5Ha', function(verifyErr) {
    if (verifyErr) {
      return res.status(403).json({
        success: false,
        error: 'You don\'t have access'
      });
    }

    if (!req.body.author) {
      return res.status(400).json({
        success: false,
        message: 'Author must be sent in request body'
      });
    }
    Author.create({name: req.body.author.name}, function(err, author) {
      if (err) {
         return res.status(400).json({
          success: false,
          error: 'Could not create author'
        });
      };
      res.status(201).json({
        success: true,
        data: author
      });
    });
  });
});


router.get('/', function(req, res, next) {
  Author.find({}, function (err, author) {
    if (err) {
      return res.status(400).json({
        success: false,
        error: 'Could not get author'
      })
    };
    res.status(200).json({
      data: author,
      success: true
    });
  });
});

router.delete('/', function(req, res, next) {
  jwt.verify(req.collection.token, 'cHrgAh4565$58|@56!aAhjAbnbWrT454Hw3rr55f4aG#%()4a1g5Ha', function(verifyErr) {
    if (verifyErr) {
      return res.status(400).json({
        success: false,          
        error: 'You don\'t have access'
      });
    }
    Author.remove({id: req.body.author.id}, function(err) {
      if (err) {
        return res.status(400).json({
          sucess: false,
          error: 'Could not delete Author'
        });
      }
      res.status(200).json({
        success: true
      });
    });
  });
});

router.put('/', function(req, res, next) {
  jwt.verify(req.collection.token, 'cHrgAh4565$58|@56!aAhjAbnbWrT454Hw3rr55f4aG#%()4a1g5Ha', function(verifyErr) {
    if (verifyErr) {
      res.status(403).json({
        success: false,
        error: 'You don\'t have access'
      });
    }
    Author.findOne({id: req.body.author.id}, function(err, author) {
      if (err) {
        return res.status(400).json({
          success: false,
          error: 'Could not edit author'
        });
      }
        if (req.body.author.name) {
          author.name = req.body.author.name;
        }

        author.save(function(err) {
          if (err) {
            return res.status(400).json({
              success: false,
              error: 'Could not save'
            });
          }
           res.status(200).json({
            data: author,
            success: true
          });
        });
      });
  });
});

module.exports = router;