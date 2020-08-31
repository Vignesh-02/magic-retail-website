var Deck=require("../models/deck");
var Comment=require("../models/comment");


// all the middleware goes here
var middlewareObj=[];

middlewareObj.checkDeckOwnership=function(req,res,next){
    //is user logged in
    if(req.isAuthenticated()){
        
        Deck.findById(req.params.id,function(err,foundDeck){
            if(err){
                req.flash("error","Deck not found");
                res.redirect("back");
            }
            else{
            //does user own the Deck?
            if(foundDeck.author.id.equals(req.user._id)){
                next();
            }else{
                req.flash("error","You do not have permmission to do that");
                res.redirect("back");
            }
            
            }   
        });
        
    }else{
        req.flash("error","You need to be logged in to do that");
        res.redirect("back");
    }
}


middlewareObj.checkCommentOwnership=function(req,res,next){
    //is user logged in
    if(req.isAuthenticated()){
        
        Comment.findById(req.params.comment_id,function(err,foundComment){
            if(err){
                res.redirect("back");
            }
            else{
            //does user own the comment?
            if(foundComment.author.id.equals(req.user._id)){
                next();
            }else{
                req.flash("You don't have permmission to do that");
                res.redirect("back");
            }
            
            }   
        });
        
    }else{
        req.flash("error","You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","You need to be logged in to post data");
    res.redirect("/login");
}

module.exports=middlewareObj;
