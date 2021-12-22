const db = require("../models");

module.exports.createReview = async (req, res) => {
    const blog = await db.FamilyBlog.findById(req.params.id);
    const review = new db.Review();
	console.log('The review body' + req.body.body)
	review.body = req.body.body;
    review.author = req.user._id;
    blog.reviews.push(review);
    await review.save();
    await blog.save();
	
	res.send(`This Review was succesfully added: ${review._id}`)
}

module.exports.editReview = async (req, res) => {
	
    const { id, reviewId } = req.params;
    //await db.FamilyBlog.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    const review = await db.Review.findByIdAndUpdate(reviewId);
	review.body = req.body.body;
    await review.save();
	res.send(`This Review was succesfully updated: ${review._id}`)
	
}

module.exports.deleteReview = async (req, res) => {
	
    const { id, reviewId } = req.params;
    await db.FamilyBlog.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await db.Review.findByIdAndDelete(reviewId);
	res.send(`This Review was succesfully deleted`)
}