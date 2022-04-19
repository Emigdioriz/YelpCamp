const express = require('express');
const user = require('../models/user');
const router = express.Router();
const passport = require('passport');
const ViewAsync = require('../utils/ViewAsync');
const User = require('../models/user');
const users = require('../controllers/users');
const { route } = require('./campgrounds');
const { NativeError } = require('mongoose');



//REGISTERING
router.route('/register')
    .get(users.renderRegister)
    .post(ViewAsync(users.register))

//LOGIN
router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }) , users.login)


//LOGOUT
router.get('/logout', users.logout);

module.exports = router;

