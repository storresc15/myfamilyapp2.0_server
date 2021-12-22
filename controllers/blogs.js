const  db = require("../models");

module.exports.index = (req, res) => {
	res.send('Welcome to the blog route');
}

//TEST Create blog route to test middleware and error handling to be updated in the future if does not meet the requirements for creating blogs
module.exports.createBlog = async (req, res, next) => {
    //const blog = new db.FamilyBlog(req.body);
	const blog = new db.FamilyBlog();
	if(req.file){
	blog.image.filename = req.file.filename;
	blog.image.url = req.file.path;
	}
	blog.title = req.body.title;
	blog.body = req.body.body;
	blog.author = req.user._id; //req.body.author;
	//console.log('Req.files: ' + req.files);
	console.log(req.body.title);
	//console.log('Req.body title' + req.body.title);
	console.log(req.file);

	
    //campground.geometry = geoData.body.features[0].geometry;
    //campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    //blog.author = req.user._id;
    await blog.save();
    console.log(blog);
    res.send(`This Blog was succesfully added: ${blog._id}`)
}

//Adding the get all blogs route to test the development on the front end
module.exports.getAllBlogs = async (req, res, next) => {
	const allBlogs = await db.FamilyBlog.find({});
	res.send(allBlogs);
}

module.exports.getBlog = async (req, res, next) => {
	const { id } = req.params;
	const blog = await db.FamilyBlog.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
	res.send(blog);
}

//Update route
module.exports.updateBlog = async (req, res) => {
	const id  = req.params.id;
    console.log(req.body);
    const blog = await db.FamilyBlog.findByIdAndUpdate(id);
    
	if(req.file){
	blog.image.filename = req.file.filename;
	blog.image.url = req.file.path;
	}
	blog.title = req.body.title;
	blog.body = req.body.body;
	blog.author = req.user._id; //req.body.author;
	//console.log('Req.files: ' + req.files);
	console.log(req.body.title);
	//console.log('Req.body title' + req.body.title);
	console.log(req.file);
	
    await blog.save();
	/*
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }*/
    res.send(`This Blog was succesfully updated: ${blog._id}`)
}

module.exports.deleteBlog = async (req, res) => {
    const { id } = req.params;
    await db.FamilyBlog.findByIdAndDelete(id);
    res.send('Succesfully Deleted the Blog')
}