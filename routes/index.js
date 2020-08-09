var express=require("express");
var router=express.Router();
var passport=require("passport");
var User=require("../models/user");

//root route
router.get("/",function(req,res){
    res.render("landing",{currentUser:req.user});
   // res.send("This will be a landing page soon");
}); 

//show register form
router.get("/register",function(req,res){
    res.render("register",{currentUser:req.user});
}); 


//handling user sign up
router.post("/register",function(req,res){
    req.body.username;
    req.body.password;
    User.register(new User({username: req.body.username}),req.body.password,function(err,user){
        if(err){
            console.log(err);
            req.flash("error",err.message);
            return res.render("register",{currentUser:req.user}); 
        }
        passport.authenticate("local")(req,res,function(){
            req.flash("success","Welcome to Yelpcamp "+user.username);
            res.redirect("/campgrounds");
        });
    
    });
});

//show login form
router.get("/login",function(req, res) {
    res.render("login",{currentUser:req.user});
});

//handling login logic
router.post("/login",passport.authenticate("local",{
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}),function(req,res){
});

//logout route
router.get("/logout",function(req, res) {
    req.logout();
    req.flash("success","Logged you out!");
    res.redirect("/campgrounds");
});


module.exports=router;