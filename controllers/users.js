const db = require("../models"),
	  passport = require("passport"),
	  jwt = require("jsonwebtoken");
	  //middleware = require("./middleware");

const { getToken, COOKIE_OPTIONS, getRefreshToken, verifyUser, } = require("../middleware")

//Consider taking the below code to the users controller
// Route to fetch user Details
module.exports.getMyInfo = (req, res, next) => {
  res.send(req.user)
}

//Login Route
module.exports.login =  (req, res, next) => {
  const token = getToken({ _id: req.user._id })
  const refreshToken = getRefreshToken({ _id: req.user._id })
  db.User.findById(req.user._id).then(
    user => {
      user.refreshToken.push({ refreshToken })
      user.save((err, user) => {
        if (err) {
          res.statusCode = 500
          res.send(err)
        } else {
          res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS)
          res.send({ success: true, token, user: user }) //Uppdated to add the options
        }
      })
    },
    err => next(err)
  )
}

//Logout Route

module.exports.logout = (req, res, next) => {
  const { signedCookies = {} } = req
  const { refreshToken } = signedCookies
  db.User.findById(req.user._id).then(
    user => {
      const tokenIndex = user.refreshToken.findIndex(
        item => item.refreshToken === refreshToken
      )

      if (tokenIndex !== -1) {
        user.refreshToken.id(user.refreshToken[tokenIndex]._id).remove()
      }

      user.save((err, user) => {
        if (err) {
          res.statusCode = 500
          res.send(err)
        } else {
          res.clearCookie("refreshToken", COOKIE_OPTIONS)
          res.send({ success: true })
        }
      })
    },
    err => next(err)
  )
}

//Refresh Token Route
module.exports.refreshToken =  (req, res, next) => {
  const { signedCookies = {} } = req
  const { refreshToken } = signedCookies
  
  //logs
  console.log('The req on refresh token: ' + req);
	//console.log('The signedCookies: ' + signedCookies);
	console.log('The refresh token' + refreshToken);	

  if (refreshToken) {
    try {
      const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
	  console.log('Do we even have a payload??' + payload);
      const userId = payload._id
      db.User.findOne({ _id: userId }).then(
        user => {
          if (user) {
            // Find the refresh token against the user record in database
            const tokenIndex = user.refreshToken.findIndex(
              item => item.refreshToken === refreshToken
            )

            if (tokenIndex === -1) {
			  console.log('Tokenindex was -1')	
              res.statusCode = 401
              res.send("Unauthorized")
            } else {
              const token = getToken({ _id: userId })
              // If the refresh token exists, then create new one and replace it.
              const newRefreshToken = getRefreshToken({ _id: userId })
              user.refreshToken[tokenIndex] = { refreshToken: newRefreshToken }
              user.save((err, user) => {
                if (err) {
                  res.statusCode = 500
                  res.send(err)
                } else {
                  res.cookie("refreshToken", newRefreshToken, COOKIE_OPTIONS)
                  res.send({ success: true, token })
                }
              })
            }
          } else {
			console.log('Didnt find a user')	  
            res.statusCode = 401
            res.send("Unauthorized")
          }
        },
        err => next(err)
      )
    } catch (err) {
		console.log('On the actual catch block')	
      res.statusCode = 401
      res.send("Unauthorized")
    }
  } else {
	  console.log('On the else block, so not even refresh token found')	
    res.statusCode = 401
    res.send("Unauthorized")
  }
}


//Signup Route for users
module.exports.signup = (req, res, next) => {
  // Verify that first name is not empty
  if (!req.body.firstName) {
    res.statusCode = 500
    res.send({
      name: "FirstNameError",
      message: "The first name is required",
    })
  } else {
    db.User.register(
      new db.User({ username: req.body.username }),
      req.body.password,
      (err, user) => {
        if (err) {
          res.statusCode = 500
          res.send(err)
        } else {
          user.firstName = req.body.firstName
          user.lastName = req.body.lastName || ""
          user.email = req.body.email || ""
		  if(req.file){
			user.image.filename = req.file.filename;
			user.image.url = req.file.path;
			}	
          const token = getToken({ _id: user._id })
          const refreshToken = getRefreshToken({ _id: user._id })
          user.refreshToken.push({ refreshToken })
          user.save((err, user) => {
            if (err) {
              res.statusCode = 500
              res.send(err)
            } else {
              res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS)
              res.send({ success: true, token })
            }
          })
        }
      }
    )
  }
}
