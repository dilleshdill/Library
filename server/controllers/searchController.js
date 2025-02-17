import SearchModel from "../models/Search.js";


const searchItem=async(req,res)=>{
    const {email,searchTerm}=req.body
    const user = await SearchModel.findOne({email})
    if(!user){
        const data = await SearchModel.create({
            email,
            value:searchTerm
        })
        return res.status(200).json({message:"success"})
    }
    else{
        user.value=searchTerm
        await user.save()
        return res.status(200).json({message:"success"})
    }
    
    
}

const getSearchItem = async (req, res) => {
    const { email } = req.query;

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    try {
        const user = await SearchModel.findOne({ email });

        if (!user || !user.value) {
            return res.status(200).json({ value:"" });
        }

        return res.status(200).json({ value: user.value });
    } catch (error) {
        console.error("Error fetching search item:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};



export {searchItem,getSearchItem}