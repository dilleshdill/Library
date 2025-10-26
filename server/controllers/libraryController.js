import Library from "../models/libraryModel.js";
import BooksModel from "../models/BooksModel.js";
const addLibrary = async (req, res) => {
    try {
        const { name, address, contact, location,admin,timings } = req.body;

        // Check if the library already exists (based on name & address)
        const existingLibrary = await Library.findOne({ name, address });
        if (existingLibrary) {
            return res.status(400).json({ message: "Library already exists" });
        }

        // Create new library
        const newLibrary = await Library.create({ name, address, contact, location,admin,timings });

        res.status(201).json({ message: "Library registered successfully", newLibrary });
    } catch (error) {
        res.status(500).json({ message: "Error registering Library", error: error.message });
    }
};

const getLibraryDetails = async (req, res) => {
    try {
        
        const { id } = req.params;
        console.log(id)

        if (!id) {
            return res.status(400).json({ message: "Library ID is required" });
        }

        const library = await Library.findById(id)
            .populate('admin', 'username email') // Example of populating admin details
            .lean();

        if (!library) {
            return res.status(400).json({ message: "Library not found" });
        }

        res.status(200).json(library); // Return just the library object directly
    } catch (error) {
        console.error("Error fetching library details:", error);
        res.status(500).json({ 
            message: "Server error fetching library details", 
            error: error.message 
        });
    }
};

const searchBooks = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({ message: "Search query is required" });
        }

        const books = await BooksModel.find({
            book_name: { $regex: query, $options: "i" } // Case-insensitive search
        }).populate("libraryId", "name"); // Populate library name

        res.status(200).json({ books });
    } catch (error) {
        res.status(500).json({ message: "Error fetching books", error: error.message });
    }
};

const getLibraryId = async (req,res)=>{
    try{
        const library = await Library.find()
        res.status(200).json({ library });
    }catch (error) {
        res.status(500).json({ message: "Error fetching books", error: error.message });
    }
}

const getTimings = async (req,res)=>{
    try{
        const {libraryId} = req.body
    
        const user = await Library.findById(libraryId)
        
        const data = user.timings
        console.log(data)
        res.status(200).json({message:"done",data})
    }catch (error) {
        res.status(500).json({ message: "Error fetching books", error: error.message });
    }
}
export {addLibrary,getLibraryDetails,searchBooks,getLibraryId,getTimings};
