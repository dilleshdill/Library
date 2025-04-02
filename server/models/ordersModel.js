import mongoose from "mongoose";

const ordersSchema = new mongoose.Schema({
    email:{type:String,required:true},
    orders:[
        {
            book_url:{ type:String,required:true },
            book_name:{ type:String,required:true },
            price:{ type:String,required:true },
            count:{type:Number},
            libraryId: { type: mongoose.Schema.Types.ObjectId, ref: "Library", required: true },
            bookId:{ type: mongoose.Schema.Types.ObjectId, ref: "book", required: true },
        }
    ]
})

const OrdersModel = mongoose.model("Order",ordersSchema)

export default OrdersModel;