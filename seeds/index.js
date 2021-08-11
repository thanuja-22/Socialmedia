const mongoose=require('mongoose');
const cities=require('./cities');
const Campground=require('../models/campground');
const { places, descriptors } = require('./seedsHelpers');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(function(){
      console.log("CONNECTED");
    })
    .catch(function(err){
      console.log("Error",err)
    })


const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB=async function(req,res){
  await Campground.deleteMany({});
  for(var i=0;i<50;i++){
    const random1000=Math.floor(Math.random()*1000);
    const price=Math.floor(Math.random()*30)+10;
    const camp = new Campground({
            author:'608bd2fbd042ec0d580faa96',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image:'https://source.unsplash.com/collection/483251',
            description:'Have spent the last 3 summers at this amazing and peaceful site. The hosts both human and four legged are welcoming and friendly and take that extra time to ensure your holiday is just perfect. The food in the bar is delicious (as is the wine and beer!) the amenities on the site are clean and tidy, the pool is just the right size to do a couple of lengths ',
            price:price
    })
    await camp.save();
  }
};

seedDB().then(function(){
  mongoose.connection.close();
});
