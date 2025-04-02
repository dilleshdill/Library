import mongoose from "mongoose";

const FavoriteSchema = new mongoose.Schema({
    email: { type: String, required: true },
    favorites: [
        {
            book_url: { type: String, required: true },
            bookId: { type: mongoose.Schema.Types.ObjectId, ref: "book", required: true },
            book_name: { type: String, required: true },
            price: { type: String, required: true },
            count: { type: Number },
            libraryId: { type: mongoose.Schema.Types.ObjectId, ref: "Library", required: true },
        }
    ]
});

const FavoriteModel = mongoose.model("Favorite", FavoriteSchema);

export default FavoriteModel;
