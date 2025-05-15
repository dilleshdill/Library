import userRegisterModel from "../models/registerModel.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import generateUserToken from "../utils/user.util.js";

dotenv.config();



// Register New User
const addUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user exists
        const existingUser = await userRegisterModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create New User
        const newUser = await userRegisterModel.create({
            username,
            email,
            password: hashedPassword,
            reservedBooks: [] // Initialize as empty array
        });

        // Generate JWT Token
        const token = generateUserToken(res, newUser);
        res.status(201).json({ message: "User registered successfully", token, user: newUser });
    } catch (error) {
        res.status(500).json({ message: "Error registering user", error });
    }
};

const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        
        const existingUser = await userRegisterModel.findOne({ email });
        if (!existingUser) {
            return res.status(400).json({ message: "User not found" });
        }

        const match = await bcrypt.compare(password, existingUser.password);
        if (!match) return res.status(401).json({ message: "Incorrect password" });

        // Generate JWT token
        const token = generateUserToken(res, existingUser);
        res.json({ message: "Login successful", token, user: existingUser });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Login error", error });
    }
};

const getUserDetails = async (req, res) => {
    try {
        const userId = req.params._id; // Extract user ID from route params
        const user = await userRegisterModel.findById(userId).populate("reservedBooks.bookId").populate("reservedBooks.libraryId"); // Fetch user with populated reservedBooks
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Error fetching user", error });
    }
};

const getUserId = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await userRegisterModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ id: user._id });
    } catch (error) {
        console.error("Error fetching user ID:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const RegisterSlot = async (req, res) => {
    try {
        const { data, email } = req.body;
        console.log(data)

        const { bookingDetails, bookId, selectedDate, startTime, endTime, libraryId } = data;

        // Find the user by email
        const user = await userRegisterModel.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "User not found. Please log in." });
        }

        // Find the library in reservedBooks
        const libraryIndex = user.reservedBooks.findIndex(eachItem => eachItem.libraryId.toString() === libraryId);
        console.log(libraryIndex)

        if (libraryIndex === -1) {
            // Library doesn't exist, add a new entry
            const newReservation = {
                libraryId,
                reservedAt: [{
                    bookId,
                    position: bookingDetails,
                    date: selectedDate,
                    startTime,
                    endTime,
                    
                }]
            };

            user.reservedBooks.push(newReservation);
        } else {

            // Library exists, check if the user already has a booking at the same time and date
            const existingBookingIndex = user.reservedBooks[libraryIndex].reservedAt.findIndex(eachItem =>
                eachItem.date === selectedDate &&
                (eachItem.startTime === startTime)&&
                ( eachItem.endTime === endTime )
                
            );
            console.log(existingBookingIndex)
            if (existingBookingIndex !== -1) {
                // Update the previous booking with the new seat (position) and bookId
                if (user.reservedBooks[libraryIndex].reservedAt[existingBookingIndex].status === "Rejected") {
                    console.log("Rebooking a previously rejected seat...");

                    user.reservedBooks[libraryIndex].reservedAt[existingBookingIndex].bookId = bookId;
                    user.reservedBooks[libraryIndex].reservedAt[existingBookingIndex].status = "Approved"; // ✅ Change status
                }
                else{
                    if (user.reservedBooks[libraryIndex].reservedAt[existingBookingIndex])
                        user.reservedBooks[libraryIndex].reservedAt[existingBookingIndex].bookId = bookId,
                        user.reservedBooks[libraryIndex].reservedAt[existingBookingIndex].position = bookingDetails;
                }
                    
                    await user.save();
                    console.log(user.reservedBooks[libraryIndex].reservedAt[existingBookingIndex])
                
            } else {

                const data = user.reservedBooks[libraryIndex].reservedAt.some(eachItem=>(
                    eachItem.startTime >=endTime || 
                    eachItem.endTime <=startTime
                ))
                
                // Otherwise, add a new booking
                if(data){
                    user.reservedBooks[libraryIndex].reservedAt.push({
                        bookId,
                        position: bookingDetails,
                        date: selectedDate,
                        startTime,
                        endTime
                    });
                }
            }
        }

        await user.save();
        return res.status(200).json({ message: "Slot booked/updated successfully" });

    } catch (error) {
        console.error("Error in RegisterSlot:", error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};

// const RemoveList = async (req, res) => {
//     const { email } = req.body;
//     const currentDate = new Date().toISOString().split("T")[0]; // Get today's date in "YYYY-MM-DD" format
//     const currentTime = new Date().toLocaleTimeString(); // Get current time in HH:MM:SS format
  
//     try {
//       const user = await userRegisterModel.findOne({ email });
  
//       if (user) {
//         // Iterate through the reservedBooks to find and remove expired slots
//         user.reservedBooks.forEach(library => {
//           library.reservedAt = library.reservedAt.filter(slot => {
//             // Check if the booking is today and if the slot is expired based on the end time
//             if (slot.date === currentDate) {
//               const [endHour, endMinute] = slot.endTime.split(":").map(Number); // Parse end time
  
//               const currentHour = new Date().getHours(); // Get current hour
//               const currentMinute = new Date().getMinutes(); // Get current minute
  
//               // If the current time is later than the end time, remove the slot
//               if (currentHour > endHour || (currentHour === endHour && currentMinute > endMinute)) {
//                 return false; // Remove the slot
//               }
//             }
  
//             return true; // Keep the slot if it is not expired
//           });
//         });
  
//         // Save the updated user document
//         await user.save();
//         return res.status(200).json({ message: "Expired slots removed successfully." });
//       } else {
//         return res.status(400).json({ message: "User not found." });
//       }
//     } catch (error) {
//       console.error("Error in RemoveList:", error);
//       return res.status(500).json({ message: "Something went wrong." });
//     }
//   };
  
const getUserDetailsByEmail = async (req, res) => {
    try {
        const { email } = req.params;  // Accessing email from params
        
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const user = await userRegisterModel.findOne({ email });
        console.log(user)

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User details found", user });
    } catch (error) {
        console.error("Error finding the details:", error);
        res.status(500).json({ message: "Server error", error });
    }
}

const getUserDetailsById = async (req, res) => {
    try {
        const { id } = req.params;  // Accessing email from params
        console.log(id)
        
        if (!id) {
            return res.status(400).json({ message: "id is required" });
        }

        const user = await userRegisterModel.findOne({ _id: id });

        console.log(user)

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User details found", user });
    } catch (error) {
        console.error("Error finding the details:", error);
        res.status(500).json({ message: "Server error", error });
    }
}





export { addUser, userLogin, getUserDetails, getUserId,RegisterSlot,getUserDetailsByEmail,getUserDetailsById};