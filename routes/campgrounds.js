const express = require('express')
const router = express.Router();
const ViewAsync = require('../utils/ViewAsync');
const campgrounds = require('../controllers/campgrounds');
const {isLoggedIn, isAuthor, validateCampground} = require('../middleware');
const Campground = require('../models/campground');
const Review = require('../models/review');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

//mostra a página de campgrounds
router.get('/', ViewAsync(campgrounds.index));

//mostra o formulário new e cria um novo campground  ---------------------------------------------------------------------------------------------------------------------
router.get('/new', isLoggedIn, campgrounds.renderNewForm);
router.post('/', isLoggedIn, upload.array('image'), validateCampground, ViewAsync(campgrounds.createCampground));

//mostra um campground específico---------------------------------------------------------------------------------------------------------------------
router.get('/:id', ViewAsync(campgrounds.showCampground));

//mosta o fomulário de edição e edita o campground---------------------------------------------------------------------------------------------------------------------
router.get('/:id/edit', isLoggedIn, isAuthor, ViewAsync(campgrounds.renderEditForm));
router.put('/:id', isLoggedIn, upload.array('image'), validateCampground,ViewAsync(campgrounds.updateCampground));

//deleta o campground ---------------------------------------------------------------------------------------------------------------------
router.delete('/:id', isLoggedIn, isAuthor,ViewAsync(campgrounds.deleteCampground));

module.exports = router;