import mongoose from "mongoose";

const SearchSchema = new mongoose.Schema({
    email:String,
    search:[
        {
            value:String
        }
    ]
})

const SearchModel = mongoose.model("Search",SearchSchema)

export default SearchModel