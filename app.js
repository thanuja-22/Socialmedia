
//basic setup
const express=require('express');
const mongoose=require('mongoose');
const ejsMate=require('ejs-mate');
var methodOverride=require('method-override');
var morgan=require('morgan');
const session=require('express-session');
const falsh=require('connect-flash');

const Campground=require('./models/campground');
const Review=require('./models/review');
const User=require("./models/user");

const campgroundsRoutes=require('./routes/campground');
const reviewsRoutes=require('./routes/reviews');
const usersRoutes=require('./routes/users');

const passport=require('passport');
const LocalStrategy=require('passport-local');

const app=express();

//middleware
app.engine('ejs',ejsMate);
app.set('view engine','ejs');
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static('public'));

//session part
const sessionConfig={
  secret:'thishouldbeabettersecret',
  resave:false,
  saveUninitialized:true,
  cookie:{
    httpOnly:true,
    expires:Date.now()+1000*60*60*24*7,
    maxAge:1000*60*60*24*7
  }
}

app.use(session(sessionConfig));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//mongoose connection
mongoose.connect('mongodb://localhost:27017/yelp-camp', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(function(){
      console.log("DATABASE CONNECTED");
    })
    .catch(function(err){
      console.log("Error came out of bounds happy",err)
    })

app.use((req,res,next)=>{
  res.locals.currentUser=req.user;
  next();
})

//routes
app.use("/campgrounds",campgroundsRoutes);
app.use("/campgrounds/:id/reviews",reviewsRoutes);
app.use("/",usersRoutes);

//passport uses pbkdf2
app.get("/fake",async function(req,res){
  const user=new User({email:'tanujakollipara9849@gmail.com',username:'Thanuja'});
  const newuser=await User.register(user,'Thanuja');
  res.send(newuser);
})
app.get("/",function(req,res){
  res.send("Started YelpCamp");
})




//Server port
app.listen(3000,function(req,res){
  console.log("Server is listening....");
})
