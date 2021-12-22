const mongoose = require('mongoose');
const { Schema } = mongoose;
const passportLocalMongoose = require('passport-local-mongoose');

const Session = new Schema({
  refreshToken: {
    type: String,
    default: "",
  },
})

const UserSchema = new Schema({
	firstName: {
		type: String,
		default: "",
  	},
	lastName: {
		type: String,
		default: "",
	 },
    email: {
        type: String,
        unique: true
    },
	authStrategy: {
		type: String,
		default: "local",
  },
	refreshToken: {
    	type: [Session],
  },
	image: {
		url: String,
		filename: String
	},
});

//Remove refreshToken from the response
UserSchema.set("toJSON", {
  transform: function (doc, ret, options) {
    delete ret.refreshToken
    return ret
  },
})

UserSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', UserSchema);
module.exports = User;