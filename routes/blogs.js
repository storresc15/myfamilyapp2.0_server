const express = require('express'),
	  router = express.Router(),
	  blogs = require('../controllers/blogs');
const { getToken, COOKIE_OPTIONS, getRefreshToken, verifyUser,isAuthor } = require("../middleware");
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.route('/all')
	.get(blogs.getAllBlogs)

router.route('/')
	.get(verifyUser, blogs.index)
	.post(verifyUser,upload.single('file'), blogs.createBlog)

router.route('/:id')
	.get(verifyUser, blogs.getBlog)
	.post(verifyUser, isAuthor, upload.single('file'), blogs.updateBlog)
	.delete(verifyUser, isAuthor, blogs.deleteBlog)

//Check if this route is actually required
/*app.get("/new",middleware.isLoggedIn, (req, res) => {
    res.send("new");
});*/

//This section should be at some point refactored with the functions from the controllers folder
/*
//CREATE ROUTE
app.post("/",middleware.isLoggedIn, (req, res) => {
    //create blog
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render("new");
        } else {
            //redirect to index
            res.redirect("/blogs");
        }
    });
});
//SHOW ROUTE
app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("show", {blog: foundBlog});
        }
    });
});

//EDIT ROUTE
app.get("/blogs/:id/edit",middleware.isLoggedIn, function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err) {
            res.redirect("/blogs");
        } else{
            res.render("edit", {blog: foundBlog});
        }
    });
});

//UPDATE ROUTE
app.put("/blogs/:id",middleware.isLoggedIn, function(req, res) {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            res.redirect("/blogs");
        }else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

//DELETE ROUTE
app.delete("/blogs/:id",middleware.isLoggedIn, function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err) {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    });
});
*/
module.exports = router;