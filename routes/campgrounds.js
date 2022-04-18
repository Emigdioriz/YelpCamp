const express = require('express')
const router = express.Router();
const catchAsync = require('../utils/CatchAsync');
const campgrounds = require('../controllers/campgrounds');
const {isLoggedIn, isAuthor, validateCampground} = require('../middleware');
const Campground = require('../models/campground');
const Review = require('../models/review');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

//mostra a página de campgrounds
router.get('/', catchAsync(campgrounds.index));

//mostra o formulário new e cria um novo campground  ---------------------------------------------------------------------------------------------------------------------
router.get('/new', isLoggedIn, campgrounds.renderNewForm);
router.post('/', isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground));

//mostra um campground específico---------------------------------------------------------------------------------------------------------------------
router.get('/:id', catchAsync(campgrounds.showCampground));

//mosta o fomulário de edição e edita o campground---------------------------------------------------------------------------------------------------------------------
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));
router.put('/:id', isLoggedIn, upload.array('image'), validateCampground,catchAsync(campgrounds.updateCampground));

//deleta o campground ---------------------------------------------------------------------------------------------------------------------
router.delete('/:id', isLoggedIn, isAuthor,catchAsync(campgrounds.deleteCampground));

module.exports = router;