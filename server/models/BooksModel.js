import mongoose from "mongoose";

const BooksSchema = new mongoose.Schema({
    book_url:{ type:String,required:true },
    book_name:{ type:String,required:true },
    discription:{ type:String,required:true },
    date:{ type:String,required:true },
    catogory:{type:String,required:true},
    author:{ type:String,required:true },
    rating:{ type:String,required:true },
    price:{ type:String,required:true },
},{timestamps:true})

const BooksModel = mongoose.models.BooksModel || mongoose.model("Books",BooksSchema)

export default BooksModel;