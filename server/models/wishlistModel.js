import mongoose from "mongoose";

const WishlistSchema = new mongoose.Schema({
    email:{type:String,required:true},
    wishlist:[
        {
            book_url:{ type:String,required:true },
            book_name:{ type:String,required:true },
            date:{ type:String,required:true },
            author:{ type:String,required:true },
            rating:{ type:String,required:true },
            price:{ type:String,required:true },
        }
    ]
})

const WishlistModel = mongoose.model("Wishlist",WishlistSchema)

export default WishlistModel;