import { json } from "express";
import AddressModel from "../models/addressModel.js";

const addAddress = async (req,res)=>{
    const {email,name,phone_no,street,district,state,pincode,village} = req.body

    try{
        const user = await AddressModel.findOne({email});
        if(!user){
            const newAddress = await AddressModel.create({
                email,
                address:[
                    {
                        name,
                        phone_no,
                        street,
                        district,
                        state,
                        pincode,
                        village 
                    }
                ]
            })
            return res.status(200).json({message:"address added successfully"})
        }
        else{
            user.address.push({name,phone_no,street,district,state,pincode,village});
            await user.save();
            return res.status(200).json({ message: "Address added successfully" });
        }

    }catch(e){
        return res.status(400).json({message:e})
    }
}

const getAddress = async (req,res)=>{
    const {email} = req.query

    try{
        if(!email){
            return res.status(400).json({message:"no email not found"})
        }
        const user = await AddressModel.findOne({email})
        if (!user){
            return res.status(400).json({message:"no email not found"})
        }
        return res.status(200).json(user.address)
    }catch{
        return res.status(400).json({message:"server error"})
    }
}

const editAddress = async (req, res) => {
    const { _id, email, name, phone_no, street, district, state, pincode, village } = req.body;

    if (!_id || !email) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        const user = await AddressModel.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // Find the specific address within the user's address array
        const addressIndex = user.address.findIndex(addr => addr._id.toString() === _id);

        if (addressIndex === -1) {
            return res.status(400).json({ message: "Address not found" });
        }

        user.address[addressIndex] = {
            _id,
            name,
            phone_no,
            street,
            district,
            state,
            pincode,
            village
        };

        await user.save();
        return res.status(200).json({ message: "Address updated successfully" });

    } catch (error) {
        console.error("Error updating address:", error);
        return res.status(500).json({ message: "Server error" });
    }
};


const removeAddress = async (req,res)=>{
    const {email,_id} = req.body

    try{
        const user = await AddressModel.findOne({email})

        if(!user){
            return res.status(400).json({ message: "User not found" });
        }
        user.address = user.address.filter(eachItem => eachItem._id.toString()!== _id);
        await user.save();
        return res.status(200).json({message:"removed successfully"})
    }catch{
        return res.status(400).json({ message: "error deleting the book" });
    }
}

export {addAddress,getAddress,removeAddress,editAddress}