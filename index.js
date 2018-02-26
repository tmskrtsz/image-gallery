//-- Modules and packages
//
const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');
const logger = require('morgan');
const multer = require('multer');
const sharp = require('sharp');

//-- App configuration
//
const port = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());
app.use(logger('dev'));
app.use('/images', express.static('uploads'));
app.use('/images', express.static('uploads/thumbnails'));

//-- Set up the image store
//
const store = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, './uploads');
	},
	filename: (req, file, cb) => {
		cb(null, `${Date.now()}_${file.originalname}`);
	}
});

const upload = multer({
	storage: store
}).single('image');

//-- Save the incoming image to the store
//-- and transform it into a smaller version
//
app.post('/api/upload', upload, (req, res) => {
	if (!req.file) {
		return res.send({ status: 'No file saved' });
	} else {
		fs.readFile(`./uploads/${req.file.filename}`, (err, image) => {
			if (err) {
				throw err;
				res.send({ status: 'Error Uploading image' })
			} else {
				sharp(image)
					.resize(400, 400)
					.max()
					.toFile(`./uploads/thumbnails/thumb_${req.file.filename}`)
					.then((data) => res.sendStatus(200))
					.catch((err) => console.log(err))
			}
		});
		console.log(`${req.file.originalname} received!`);
	}
});

//-- Route that returns all images inside the uploads folder
//-- hardcoding the url of the thumbnails for now
//
app.get('/api/images', (req, res) => {
	const allImages = [];

	fs.readdir('./uploads', (err, images) => {
		if (!err) {
			images.filter((image) => {
				if (image.match( /(.png|.jpg|.jpeg)/ )) return image;
			}).map((image, index) => {
			  allImages.push({
					image: image,
					path: image,
					pathThumb: `thumb_${image}`
				});
			});
		}

		if (typeof allImages == undefined || allImages.length === 0) {
			res.sendStatus(404);
			return;
		} else {
			res.json(allImages);
		}
	});

});

//-- Whenever a post delete request comes in
//-- search the image and delete it.
//
app.delete('/api/delete/:id', (req, res) => {

	let filesToDelete = [
		`uploads/${req.params.id}`,
		`uploads/thumbnails/thumb_${req.params.id}`
	];

	function deleteImages(images, cb) {
		var i = images.length;

		images.forEach(function(imagepath){
			fs.unlink(imagepath, function(err) {
				i--;
				if (err) {
					cb(err);
					return;
				} else if (i <= 0) {
					cb(null);
				}
			});
		});
	}

	deleteImages(filesToDelete, (err) => {
			if (err) {
				throw err
			} else {
				res.sendStatus(200);
			}
			console.log(`The images have been deleted`);
		})
});

app.listen(port, () => console.log(`Listening on port ${port}`));
