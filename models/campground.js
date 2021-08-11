const mongoose=require('mongoose');
const Review=require("./review");

const CampgroundSchema=new mongoose.Schema({
  title:String,
  image:String,
  price:Number,
  description:String,
  location:String,
  author:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'user'
  },
  reviews:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:'Review'
    }
  ]
});

CampgroundSchema.post('findOneAndDelete',async function(doc){
   if(doc){
     await Review.remove({
       _id:{
         $in:doc.reviews
       }
     })
   }
})

const Campground=mongoose.model('Campground',CampgroundSchema);
module.exports=Campground;
