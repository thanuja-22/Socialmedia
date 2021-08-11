const express=require('express');
const router=express.Router({mergeParams:true});
const User=require("../models/user");
const passport=require('passport');

router.get("/register",function(req,res){
  res.render("users/register");
})

router.post("/register",async function(req,res){
  const {username,email,password}=req.body;
  const newUser=await new User({email,username});
  const registeredUser=await User.register(newUser,password);
  console.log(registeredUser);
  res.redirect("/campgrounds");
})

router.get("/login",async function(req,res){
  res.render("users/login");
})

router.post("/login",passport.authenticate('local',{failureFlash:true,failureRedirect:"/login"}),function(req,res){
  const redirectUrl = req.session.returnTo || '/campgrounds';
  res.redirect(redirectUrl);
})

router.get("/logout",function(req,res){
  req.logout();
  res.redirect("/campgrounds");
})
module.exports=router;
