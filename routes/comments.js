var express = require("express");
var router  = express.Router({mergeParams: true});
var Deck = require("../models/deck");
var Comment = require("../models/comment");
var middleware=require("../middleware");

//Comments New
router.get("/new",middleware.isLoggedIn, function(req, res){
    // find deck by id
    // console.log(req.params.id);
    Deck.findById(req.params.id, function(err, deck){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {deck: deck});
        } 
    });
});

//Comments Create
router.post("/",middleware.isLoggedIn,function(req, res){
   //lookup deck using ID
   Deck.findById(req.params.id, function(err, deck){
       if(err){
           console.log(err);
           res.redirect("/decks");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               req.flash("error","Something went wrong");               console.log(err);
           } else {
               //add username and id to comment
               comment.author.id = req.user._id;
               comment.author.username = req.user.username;
               //save comment
               comment.save();
               deck.comments.push(comment);
               deck.save();
               console.log(comment);
               res.redirect('/decks/' + deck._id);
           }
        });
       }
   });
});

//COMMENT EDIT ROUTE
router.get("/:comment_id/edit",middleware.checkCommentOwnership,function(req,res){
    Comment.findById(req.params.comment_id,function(err, foundComment) {
        if(err){
            res.redirect("back");
        }else{
            res.render("comments/edit",{deck_id:req.params.id, comment: foundComment});        
        }
    });
});

//COMMENT UPDATE
router.put("/:comment_id",middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/decks/"+req.params.id);
        }        
    });
});

//COMMENT DESTROY ROUTE
router.delete("/:comment_id",middleware.checkCommentOwnership,function(req,res){
    //findByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id,req.body.comment,function(err,updatedComment){
        if(err){
            res.redirect("back");
        }else{
            req.flash("success","Your Comment has been deleted");
            res.redirect("/decks/"+req.params.id);
        }        
    });
});

module.exports = router;