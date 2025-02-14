import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const MONGO_URL = "mongodb://localhost:27017/"
        await mongoose.connect(MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB Connected");
    } catch (error) {
        console.error("MongoDB Connection Failed:", error);
        process.exit(1);
    }
};
