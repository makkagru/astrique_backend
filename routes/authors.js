var express = require('express');
var Author = require('../models/authors')
var router = express.Router();

router.post('/', function(req, res, next) {
  if (!req.body.author) {
    return res.status(400).json({
      success: false,
      message: 'Author must be sent in request body'
    });
  }
  Author.create({name: req.body.author.name}, function(err, author) {
    if (err) {
       res.status(400).json({
        success: false,
        error: 'Could not create author'
      });
    };
    res.status(200).json({
     success: true,
     name: author
    });
  });
});

router.get('/', function(req, res, next) {
  Author.find({}, function (err, author) {
    if (err) {
      res.status(400).json({
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
  Author.remove({id: req.body.author.id}, function(err) {
    if (err) {
      return res.status(400).json({
        sucess: false,
        error: 'Could not delete Author'
      })
    }
    res.status(200).json({
      success: true
    })
  })
})

router.put('/', function(req, res, next) {
  Author.findOne({id: req.body.author.id}, function(err, author) {
    if (err) {
      res.status(400).json({
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

module.exports = router;