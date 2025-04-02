import FavoriteModel from "../models/favoriteModel.js";

const addFavorite = async (req, res) => {
    const { book_name, book_url, price, email, libraryId, bookId } = req.body;
    try {
        const user = await FavoriteModel.findOne({ email });
        
        if (!user) {
            // Create a new user document with the book added to favorites
            await FavoriteModel.create({
                email,
                favorites: [
                    {
                        book_name,
                        book_url,
                        price,
                        count: 1,
                        libraryId,
                        bookId,
                    }
                ]
            });
            return res.status(200).json({ message: "Book added to favorites" });
        }

        // Use toString() to compare IDs
        const exist = user.favorites.find(eachItem => eachItem.bookId.toString() === bookId.toString());
        if (exist) {
            // Book already exists, remove it from favorites
            user.favorites = user.favorites.filter(eachItem => eachItem.bookId.toString() !== bookId.toString());
            await user.save();
            return res.status(201).json({ message: "Book removed from favorites" });
        } else {
            // Book does not exist, add it to favorites
            user.favorites.push({ book_name, book_url, price, count: 1, libraryId, bookId });
            await user.save();
            return res.status(200).json({ message: "Book added to favorites" });
        }
    } catch (error) {
        console.error("Error adding to favorites:", error);
        return res.status(500).json({ message: "Server error" });
    }
};


const setLike = async (req, res) => {
    const { email } = req.query;

    try {
        if (email) {
            const user = await FavoriteModel.findOne({ email });
            if (user) {
                return res.status(200).json(user.favorites);
            }
            return res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
};

const removeFavorite = async (req, res) => {
    const { email, bookId } = req.body;

    try {
        const user = await FavoriteModel.findOne({ email });
        if (!user) {
            return res.status(500).json({ message: "User not found" });
        }

        // Convert both sides to string before comparing
        user.favorites = user.favorites.filter(
            eachItem => eachItem.bookId.toString() !== bookId.toString()
        );
        await user.save();
        return res.status(200).json({ message: "Book removed successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Error removing book" });
    }
};


const setIncrement = async (req, res) => {
    const { email, book_name, count } = req.body;
    if (count<1){
        return 
    }
    try {
        const user = await FavoriteModel.findOne({ email });

        if (!user) {
            return res.status(500).json({ message: "User not found" });
        }

        const exist = user.favorites.find(eachItem => eachItem.book_name === book_name);
        if (exist) {
            exist.count = count;
            await user.save();
            return res.status(200).json({ favorites: user.favorites });
        }
        return res.status(404).json({ message: "Book not found in favorites" });
    } catch (error) {
        return res.status(500).json({ message: "Error updating favorite" });
    }
};

const clearFavorites=async (req, res) => {
    const { email } = req.body;
    try {
      if (!email) throw new Error("Email is required");
  
      const updated = await FavoriteModel.findOneAndUpdate(
        { email },
        { $set: { favorites: [] } },
        { new: true }
      );
  
      if (!updated) throw new Error("User not found");
      res.status(200).send("Favorites cleared successfully");
    } catch (error) {
      console.error("Error clearing favorites:", error.message);
      res.status(500).send(`Internal server error: ${error.message}`);
    }
  };

export { addFavorite, setLike, removeFavorite, setIncrement,clearFavorites };
