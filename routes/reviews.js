const express=require('express');
const router=express.Router({mergeParams:true});
const Review=require('../models/review');
const Campground=require('../models/campground');
const isLoggedIn=require('../middleware');

router.post("/",isLoggedIn,async function(req,res){
 const campground=await Campground.findById(req.params.id);
 const review=new Review(req.body);
 review.author=req.user._id;
 campground.reviews.push(review);
 await campground.save();
 await review.save();
 res.redirect("/campgrounds/"+campground._id);
});

router.delete("/:reviewId",isLoggedIn,async function(req,res){
   const {id,reviewId}=req.params;
   const review=await Review.findById(reviewId);
   if(!review.author.equals(req.user._id)){
      res.redirect("/campgrounds/"+id);
   }
   await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
   await Review.findByIdAndDelete(reviewId);
   res.redirect("/campgrounds/"+id);
})

module.exports=router;
