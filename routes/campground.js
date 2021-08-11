const express=require('express');
const router=express.Router();
const Campground=require('../models/campground');
var methodOverride=require('method-override');
const isLoggedIn=require("../middleware");

router.get("/",async function(req,res){
  const campgrounds=await Campground.find({});
  res.render("campgrounds/index",{campgrounds});
})

router.get("/new",isLoggedIn,function(req,res){
  res.render("campgrounds/new");
})


router.post("/",isLoggedIn,async function(req,res){
  console.log(req.body);
  const newcamp=new Campground(req.body);
  newcamp.author=req.user._id;
  await newcamp.save();
  console.log(newcamp);
  res.redirect("/campgrounds/"+newcamp._id);
})

router.get("/:id",async function(req,res){
  const {id}=req.params;
  const campground = await Campground.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
  console.log(campground);
  res.render("campgrounds/show",{campground,});
})

router.get("/:id/edit",isLoggedIn,async function(req,res){
  const {id}=req.params;
  const campground=await Campground.findById(id);
  if(!campground.author.equals(req.user._id)){
     res.redirect("/campgrounds/"+id);
  }
  const camp=await Campground.findById(id);
  res.render("campgrounds/edit",{camp});
})

router.put("/:id",isLoggedIn,async function(req,res){
  const {id}=req.params;
  const campground=await Campground.findById(id);
  if(!campground.author.equals(req.user._id)){
     res.redirect("/campgrounds/"+id);
  }
  const camp=await Campground.findByIdAndUpdate(id,req.body,{runValidators:true});
  console.log(req.body);
  res.redirect("/campgrounds/"+camp._id);
})


router.delete("/:id",isLoggedIn,async function(req,res){
   const {id}=req.params;
   const campground=await Campground.findById(id);
   if(!campground.author.equals(req.user._id)){
      res.redirect("/campgrounds/"+id);
   }
   const camp=await Campground.findByIdAndDelete(id);
   res.redirect("/campgrounds/");
})

module.exports=router;
