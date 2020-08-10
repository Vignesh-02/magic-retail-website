var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    flash       =  require("connect-flash"),
    passport    = require("passport"),
    methodOverride=require("method-override"),
    LocalStrategy = require("passport-local"),
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment"),
    User        = require("./models/user"),
    seedDB      = require("./seeds")
    
//requring routes
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index")
    
    
var url=process.env.DATABASEURL || "mongodb://localhost/yelp_camp"
mongoose.connect(url);

// mongoose.connect("mongodb://vigu:<vigu>@vigu.at1ag.mongodb.net/<Vigu>?retryWrites=true&w=majority");

// //pkFAezQ9ulg33Yj1
// const mongo_url="mongodb+srv://hope:pkFAezQ9ulg33Yj1@cluster0.2pjhn.mongodb.net/test?retryWrites=true&w=majority";

// mongoose.connect(mongo_url, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// });


// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://vigu:<vigu>@vigu.at1ag.mongodb.net/<Vigu>?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride('_method'));
app.use(flash());
// seedDB();


// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false ,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error=req.flash("error");
   res.locals.success=req.flash("success");
   next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The YelpCamp Server Has Started!");
});