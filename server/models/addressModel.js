import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema({
    email:{type:String,required:true},
    address:[
        {
            name:{ type:String,required:true },
            phone_no:{ type:String,required:true },
            street:{ type:String,required:true },
            district:{ type:String,required:true },
            state:{ type:String,required:true },
            pincode:{ type:String,required:true },
            village:{ type:String,required:true },
        }
    ]
})

const AddressModel = mongoose.model("address",AddressSchema)

export default AddressModel;