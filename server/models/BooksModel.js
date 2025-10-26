import mongoose from "mongoose";

const BooksSchema = new mongoose.Schema({
    book_url:{ type:String,required:true },
    book_name:{ type:String,required:true },
    description:{ type:String,required:true },
    date:{ type:String,required:true },
    category:{type:String,required:true},
    author:{ type:String,required:true },
    rating:{ type:String,required:true },
    count:{ type:Number,required:true },
    price:{ type:String,required:true },
    available: { type: Boolean, default: true },
    libraryId: { type: mongoose.Schema.Types.ObjectId, ref: "Library", required: true },
},{timestamps:true})

const BooksModel = mongoose.models.BooksModel || mongoose.model("Books",BooksSchema)

export default BooksModel;