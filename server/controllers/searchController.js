import SearchModel from "../models/Search.js";


const searchItem=async(req,res)=>{
    const {email,searchTerm}=req.body
    console.log(email,searchTerm)
    const user = await SearchModel.findOne({email})
    if(!user){
        const data = await SearchModel.create({
            email,
            search:[
                {
                    value:searchTerm
                }
            ]
        })
        res.status(200).json({message:"success"})
    }
    else{
        user.search.push({
            value:searchTerm
        })
        await user.save()
        return res.status(201).json({message:"success"})
    }
    
    
}

const getSearchItem = async (req, res) => {
    const { email } = req.query;

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    try {
        const user = await SearchModel.findOne({ email });

        if (!user || !user.search.length) {
            return res.status(404).json({ message: "No search history found" });
        }

        const lastSearchItem = user.search[user.search.length - 1];

        return res.status(200).json(lastSearchItem);
    } catch (error) {
        console.error("Error fetching search item:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};



export {searchItem,getSearchItem}