if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}


const express = require("express"),
	  cors = require("cors"),
	  bodyParser = require("body-parser"),
	  cookieParser = require("cookie-parser"),
	  passport = require("passport"),
	  methodOverride = require("method-override"),
	  expressSanitizer = require("express-sanitizer"),
	  morgan = require("morgan"),
	  path = require('path'),
	  session = require('express-session'),
	  db = require("./models"),
	  ExpressError = require('./utils/ExpressError'),
	  PORT = process.env.PORT || 3001;
/* ROUTES TO BE INCLUDED IN THE PROJECT LATER
	  setRoutes = require('./routes/sets'),
	  db = require("./models");
*/

require("./strategies/JwtStrategy")
require("./strategies/LocalStrategy")
require("./middleware")

const userRoutes = require('./routes/users'),
	  blogRoutes = require('./routes/blogs'),
	  reviewRoutes = require('./routes/reviews');

//App config
const app = express();
app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser(process.env.COOKIE_SECRET)); // Added the cookieParser secret here

//Add the client URL to the CORS policy

const whitelist = process.env.WHITELISTED_DOMAINS
  ? process.env.WHITELISTED_DOMAINS.split(",")
  : []

/*const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },

  credentials: true,
}
*/
//app.use(cors(corsOptions));
/*app.use(cors({
	methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
	origin: 'http://localhost:3000', //To be removed later
	credentials: true, // allow session cookie from browser to pass through
}));*/
app.use(cors());

app.use(passport.initialize());


//RESTFULL ROUTES
app.use('/users', userRoutes);
app.use('/blogs', blogRoutes);
app.use('/reviews', reviewRoutes);
app.get("/", function(req, res){
    res.json({ message: "Hello from server! This is the family app 2" });
});

//Error Handling route
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!';
	console.log('the error: ' + err);
	console.log('the message:' + err.message);
    //res.status(statusCode).json('error', { err })
	res.status(statusCode).send(err.toString());
})

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`)
})