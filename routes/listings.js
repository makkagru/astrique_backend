var express = require('express');

var Listings = require('../models/listings')
var Collection = require('../models/collections');
const jwt = require('jsonwebtoken')
var Author = require('../models/authors');

var router = express.Router();

router.post('/', function(req, res, next) {
  if (!req.body.listing) {
    return res.status(400).json({
      success: false,
      message: 'Listing must be sent in request body'
    });
  }
  Collection.findOne({id: req.body.listing.collection.id}, function(collectionErr, col) {
    Author.findOne({id: req.body.listing.author.id}, function(authorErr, author) {
      if (collectionErr || !col) {
        return res.status(400).json({
          success: false,
          error: 'Could not find collection'
        });
      }

      if (authorErr || !author) {
        return res.status(400).json({
          success: false,
          error: 'Could not find Author'
        });
      }

      Listings.create({
        name: req.body.listing.name,
        photo: req.body.listing.photo,
        author,
        col
      }, function (err, listing) {
          if (err) {
            return res.status(400).json({
              success: false,
              error: 'Could not create Listing'
            });
          }
        return res.status(201).json({
          data: listing,
          success: true
        });
      });
    });
  });
});

router.get('/', function(req, res, next) {
  const searchObj = {};
  if (req.query.collection) {
    searchObj.collection = {
      id: req.query.collectionId,
    };
  }
  if (req.query.author) {
    searchObj.author = {
      id: req.query.authorId,
    };
  }
  Listings.find(searchObj, function(err, listings) {
    console.log(listings);
    if (err) {
      return res.status(400).json({
        success: false,
        error: 'Could not get Listing'
      });
    }

    return res.status(200).json({
      data: listings,
      success: true
    });
  });
});

router.delete('/:listingId', function(req, res , next) {
  Listings.remove({id: req.params.listingId}, function(err) {
    if (err) {
      return res.status(400).json({
        sucess: false,
        error: 'Could not delete Listing'
      });
    }
    return res.status(200).json({
      success: true
    });
  });
});

router.patch('/:listingId', function(req, res, next) {
  Listings.findOne({id: req.params.listingId}, function(listingErr, listing) {
   if (listingErr || !listing) {
    return res.status(404).json({
      success: false,
      error: 'Could not find Listing'
    });
   }
   Collection.findOne({id: req.body.collection.id}, function(colErr, collection) {
    if(!collection || colErr) {
      return res.status(400).json({
        success: false,
        error: 'collection must be sent in request'
      });
    }
    listing.col = collection;
   
    listing.save(function(err, addedListing) {
      if (err) {
        return res.status(400).json({
          success: false,
          error: 'Something goes wrong'
        });
      }
       res.status(200).json({
         data: addedListing,
         success: true
       });
     });
   });
  });
});

router.put('/', function(req, res, next) {
  Listings.findOne({id: req.body.listing.id}, function(err, listing) {
    if (err || !listing) {
      return res.status(400).json({
        success: false,
        error: 'Could not edit Listing'
      });
    }

    if (req.body.listing.name) {
      listing.name = req.body.listing.name;
    }

    if (req.body.listing.authorId) {
      listing.authorId = req.body.listing.authorId
    }

    if (req.body.listing.photo) {
      listing.photo = req.body.listing.photo;
    }

    if (req.body.listing.collectionId) {
      listing.collectionId = req.body.listing.collectionId;
    }

    listing.save(function(err) {
      if (err) {
        return res.status(400).json({
          success: false,
          error: 'Could not save'
        });
      }
      res.status(200).json({
        data: listing,
        success: true
      });
    });
  });
});
module.exports = router;