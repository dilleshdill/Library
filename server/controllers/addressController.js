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

    }catch{
        return res.status(400).json({message:"error"})
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

export {addAddress,getAddress,removeAddress}