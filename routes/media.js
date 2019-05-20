var express = require('express');
var multer = require('multer');
var router = express.Router();
var path = require('path');
var sharp = require('sharp');
var fs = require('fs');
var Media = require('../models/media');
var appDir = path.dirname(require.main.filename);

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './upload')
    },
    filename: function(req, file, cb) {
        const extensionRaw = file.originalname.split('.');
        const extension = extensionRaw[extensionRaw.length-1];
        cb(null, file.fieldname + '-' + Date.now() + '.' + extension)
    }
});
var upload = multer({ storage: storage });

router.post('/upload', upload.single('image'), function(req, res, next) {
    const path = `${req.rootPath}/${req.file.path}`;
    Media.create({
        path
    }, function(err, media) {
        if (err) {
            return res.status(400).json({
                success: false,
                error: 'Could not create media'
            });
        }
        res.status(200).json({
          success: true,
          data: media
        })
    });
});

router.get('/:objectId', function(req, res, next) {
  //req.query.width / height
    Media.findOne({id: req.params.objectId}, function(err, media) {
        if (err) {
            return res.status(400).json({
                error: "error"
            });
        }
        if (!media) {
            return res.status(404).json({
                error: "not found"
            });
        }
          if (req.query.height && req.query.width) {
            if (isNaN(+req.query.height) || isNaN(+req.query.width)) {
              return res.status(400).json({
                success: false,
                error: 'Height and width must be a number'
              });
            } else {
                const newPathRaw = `${media.path}`.split('0');
                const newPath = newPathRaw[0] + `-h${req.query.height}-w${req.query.width}` + '.' + newPathRaw[1] 
            // !fs.existsSync???isNone
                sharp(media.path)
                  .resize({width: +req.query.width, height: +req.query.height})
                  .toFile(newPath)
                  .then(function() {
                    res.sendFile(newPath);
                  });
            }
          }
          if (req.query.height) {
            if(isNaN(+req.query.height)) {
              res.status(400).json({
                success: false,
                error: 'Height must be a number'
              });
            } else {
                const newPathRow = `${media.path}`.split('.');
                const newPath = newPathRow[0] + `-h${req.query.height}` + '.' + newPathRow[1];
                sharp(media.path)
                  .resize({height: +req.query.height})
                  .toFile(newPath)
                  .then(function() {
                    res.sendFile(newPath);
                  });
              }
          }

          if (req.query.width) {
            if (isNaN(+req.query.width)) {
              res.status(400).json({
                success: false,
                error: 'Width must be a number'
              });
            } else {              
              const newPathRaw = `${media.path}`.split('.')
              const newPath = newPathRaw[0] + `-w${req.query.width}`+ '.' + newPathRaw[1];
              sharp(media.path)
                .resize({width: +req.query.width})
                .toFormat('jpeg')
                .toFile(newPath)
                .then(function() {
                  res.sendFile(newPath);
                });
              }
            }
        if (!req.query.width && !req.query.height) {
          res.sendFile(media.path);
        }
    });
});

module.exports = router;