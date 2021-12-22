const passport = require("passport")
const jwt = require("jsonwebtoken")
const dev = process.env.NODE_ENV !== "production"
const  db = require("./models");
const ExpressError = require('./utils/ExpressError');

exports.COOKIE_OPTIONS = {
  httpOnly: true, //originally true
  // Since localhost is not having https protocol,
  // secure cookies do not work correctly (in postman)
  secure: !dev,
  signed: true,
  maxAge: eval(process.env.REFRESH_TOKEN_EXPIRY) * 1000,
  sameSite: "none",
}

exports.getToken = user => {
  return jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: eval(process.env.SESSION_EXPIRY),
  })
}

exports.getRefreshToken = user => {
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: eval(process.env.REFRESH_TOKEN_EXPIRY),
  })
  return refreshToken
}

exports.verifyUser = passport.authenticate("jwt", { session: false })

//Other validations of Middleware
exports.validateBlog = (req, res, next) => {
    /*const { error } = campgroundSchema.validate(req.body);
    console.log(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }*/
}

exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const blog = await db.FamilyBlog.findById(id);
    if (!blog.author.equals(req.user._id)) {
        /*req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);*/
		throw new ExpressError('You do not have the required permission to do this', 400);
    }
    next();
}

//To be implemented in the future as we implement reviews
/*
exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}
*/
/* Check this function in the future as some idea for validation of JOI
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}
*/