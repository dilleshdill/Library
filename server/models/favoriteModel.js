import mongoose from "mongoose";

const FavoriteSchema = new mongoose.Schema({
    email:{type:String,required:true},
    favorites:[
        {
            book_url:{ type:String,required:true },
            book_name:{ type:String,required:true },
            price:{ type:String,required:true },
            count:{type:Number}
        }
    ]
})

const FavoriteModel = mongoose.model("Favorite",FavoriteSchema)

export default FavoriteModel;