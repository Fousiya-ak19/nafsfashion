const mongoose=require("mongoose");
const {Schema}=mongoose;

const categorySchema= new mongoose.schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
      description:{
        type:String,
        required:true,
    },
    isListed:{
        type:Boolean,
        default:true
    },
    categoryOffer:{
        type:NUmber,
        default:0,
    },
    createdAt:{
        type:Date,
        default:Date.now;
    }
})

const Category=mongoose.model("Category",categoryShema);
module.exports=Category;

