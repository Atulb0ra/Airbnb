const express = require('express');
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require('../utils/wrapAsync');
const passport = require("passport");
const { savedRedirectUrl } = require('../middleware.js');
const userController = require("../controllers/users.js");

router.route("/signup")
    //  new route
    .get(userController.renderSignupForm)
    // create route
    .post(wrapAsync(userController.signup));

router.route("/login")
    // new route
    .get(userController.renderLoginForm)
    // create route
    .post(savedRedirectUrl, passport.authenticate("local",
        { failureRedirect: "/login", failureFlash: true }),
        userController.login
    );

router.get("/logout", userController.logout);

module.exports = router;