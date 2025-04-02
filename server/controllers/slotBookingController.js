import SlotBookingModel from "../models/slotBookingModel.js"
import userRegisterModel from "../models/registerModel.js"
const slotBooking = async (req,res)=>{


    try{
        const {libraryId,dimension,selected}=req.body
    
        const user = await SlotBookingModel.findOne({libraryId})

        if (!user){
            const data = await SlotBookingModel.create({
                libraryId,
                dimension,
                selected
            })
            await data.save()
            return res.status(200).json({ message: "Slot booking created successfully", data: user });
        }
        else{
            user.dimension=dimension,
            user.selected=selected,
            
            await user.save()
            return res.status(201).json({ message: "Slot booking created successfully", data: user });
        }
    }catch(error){
        console.error("Error in slotBooking:", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

const getSlot = async(req,res)=>{
    const {selectedLibrary} = req.body
    const user = await SlotBookingModel.findOne({libraryId:selectedLibrary})

    if (user){
        res.status(200).json({message:"successfully",user})
    }
}

const getBookingSlot = async (req, res) => {
    try {
        const { libraryId } = req.body;
        console.log("Library ID:", libraryId);
        
        // Find all users who have reserved books in the given library
        const users = await userRegisterModel.find({
            "reservedBooks.libraryId": libraryId
        });

        // console.log("Users with reservations:", users);

        // Extract only the reservations that match the given libraryId
        const filteredReservations = users.map(user => ({
            username: user.username,
            email: user.email,
            reservations: user.reservedBooks.filter(book => 
                book.libraryId.toString() === libraryId.toString()
            )
        })).filter(user => user.reservations.length > 0);

        res.status(200).json({ data: filteredReservations });
    } catch (e) {
        console.error("Error:", e);
        res.status(400).json({ message: "error" });
    }
};


export {slotBooking,getSlot,getBookingSlot};