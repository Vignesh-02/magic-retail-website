var express=require("express");
var router=express.Router();
var Deck=require("../models/deck");
var middleware=require("../middleware");

//INDEX-show all Decks
router.get("/",function(req,res){
    //Get all Decks from DB
 Deck.find({},function(err,allDecks){
    if(err){
     console.log(err);
    }else{
     res.render("decks/index",{decks:allDecks,currentUser:req.user});
    } 
 });
});

//CREATE-add new Deck to db 
router.post("/",middleware.isLoggedIn,function(req,res){
 //get data from the campgrounsd array
  var name=req.body.name;
  var mobile=req.body.mobile;
  var email=req.body.email;
  var address=req.body.address;
  var price=req.body.price;
  var image=req.body.image;
  var stock=req.body.stock;
  var desc=req.body.description;
  var author={
      id: req.user._id,
      username: req.user.username
  }; 
  var newDeck={name:name,mobile:mobile,email:email,address:address,price:price,image:image,description:desc,author:author,stock:stock};
  //Create a new Deck and save to db
  Deck.create(newDeck,function(err,newlyCreated){
      if(err){
          console.log(err);
      }else{
          res.redirect("/decks");
      }
  });
});

//NEW- display form to create new Deck
router.get("/new",middleware.isLoggedIn,function(req, res) {
   res.render("decks/new.ejs"); 
});

//SHOW- shows some more info about one Deck
router.get("/:id",function(req,res){
    //find the Deck with provided ID
    Deck.findById(req.params.id).populate("comments").exec(function(err,foundDeck){
        if(err){
            console.log(err);
        }else{
            // console.log(foundDeck);
            //render show template with Deck
            res.render("decks/show",{deck:foundDeck,currentUser:req.user});
        }
    });
});

//EDIT Deck ROUTE
router.get("/:id/edit",middleware.checkDeckOwnership,function(req, res) {
    
    Deck.findById(req.params.id,function(err,foundDeck){
        res.render("decks/edit",{deck:foundDeck});
    });
});
 
 
router.put("/:id",middleware.checkDeckOwnership,function(req,res){
    //find and update the correct Deck
    Deck.findByIdAndUpdate(req.params.id,req.body.group,function(err,updatedDeck){
        if(err){
            res.redirect("/decks");
        }else{
    //redirect somewhere(show page)
            res.redirect("/decks/"+req.params.id);
        }
    });
}); 


//DESTROY CAMPGORUND ROUTE
router.delete("/:id",middleware.checkDeckOwnership,function(req,res){
    Deck.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/decks");
        }else{
            res.redirect("/decks");
        }
    });
});


module.exports=router;