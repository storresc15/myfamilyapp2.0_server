const mongoose = require("mongoose");
const { Schema } = mongoose;

const blogSchema = new Schema({
    title: String,
    image: {
		url: String,
		filename: String
	},
    body: String,
	likes: Number,
	reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
	author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    created: {type: Date, default: Date.now}
});

const FamilyBlog = mongoose.model("FamilyBlog", blogSchema);
module.exports = FamilyBlog;