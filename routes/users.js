const express = require('express'),
	  router = express.Router(),
	  passport = require("passport"),
	  jwt = require("jsonwebtoken"),
	  users = require("../controllers/users");

const { getToken, COOKIE_OPTIONS, getRefreshToken, verifyUser, } = require("../middleware")
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

//Consider taking the below code to the users controller
// Route to fetch user Details
router.get("/me", verifyUser, users.getMyInfo)

//Login Route
router.post("/login", passport.authenticate("local"), users.login)

//Logout Route

router.get("/logout", verifyUser, users.logout)

//Refresh Token Route
router.post("/refreshToken", users.refreshToken)


//Signup Route for users
router.post("/signup",upload.single('file'), users.signup)

module.exports = router