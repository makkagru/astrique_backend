var express = require('express');
var Collection = require('../models/collections');
const jwt = require('jsonwebtoken')
var router = express.Router();

router.post('/', function(req, res, next) {
  if (!req.body.collection) {
    return res.status(400).json({
      success: false,
      message: 'Collection must be sent in request body'
    });
  }

  Collection.create({
    name: req.body.collection.name
  }, function(err, collection) {
    if (err) {
      return res.status(400).json({
        success: false,
        error: 'Could not create collection'
      });
    }
    res.status(201).json({
      success: true,
      data: collection
    });
  });
});

router.get('/', function(req, res, next) {
  Collection.find({}, function(err, collections) {
    if (err) {
      return res.status(400).json({
        success: false,
        error: 'Could not get collection'
      });
    };
    res.status(200).json({
      success: true,
      data: collections
    });
  });
});

router.delete('/', function(req, res, next) {
  Collection.remove({id: req.body.collection.id}, function(err) {
    if(err) {
     return res.status(400).json({
        success: false,
        error: 'Could not delete Collection'
      });
    }
    res.status(200).json({
      success: true,
    });
  });
});

router.put('/', function(req, res, next) {
  Collection.findOne({id: req.body.collection.id}, function(err, collection) {
    if (err) {
      return res.status(400).json({
        success: false,
        error: 'Could not edit collection'
      });
    }

    if (req.body.collection.name) {
      collection.name = req.body.collection.name
    }
    
    collection.save(function(err) {
      if (err) {
        return res.status(400).json({
          success: false,
          error: 'Could not save'
        });
      }
       res.status(200).json({
         success: true,
       });
    });
  });
});


module.exports = router;