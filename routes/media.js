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
		sharp(path)
		    .resize({height: 'auto', width: '200px'})
		    .toFile(path)
		    .toBuffer()
		    .then(function(err, data ) {
		    	if (err) {
		    		return res.status(400).json({
		    			success: false,
		    			error: 'error with sharp'
		    		});
		    	}
		    	res.status(200).json({
		    		success: true,
		    		data
		    	})
		    }
		    })
		    .catch( err => {
		        console.log(err);
		    });			
		
	});
});

router.get('/:objectId', function(req, res, next) {
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
		res.sendFile(media.path);
	});
});

module.exports = router;