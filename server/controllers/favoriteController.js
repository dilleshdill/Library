import FavoriteModel from "../models/favoriteModel.js";

const addFavorite = async (req, res) => {
    const { book_name, book_url, price, email } = req.body;

    try {
        const user = await FavoriteModel.findOne({ email });
        
        if (!user) {
            // Create a new user with the book added to favorites
            const newFavorite = await FavoriteModel.create({
                email,
                favorites: [
                    {
                        book_name,
                        book_url,
                        price,
                        count: 1
                    }
                ]
            });
            return res.status(200).json({ message: "Book added to favorites" });
        }

        const exist = user.favorites.find(eachItem => eachItem.book_name === book_name);
        if (exist) {
            // Book already exists, remove it from the favorites
            user.favorites = user.favorites.filter(eachItem => eachItem.book_name !== book_name);
            await user.save();
            return res.status(201).json({ message: "Book removed from favorites" });
        } else {
            // Book does not exist, add it to the favorites
            user.favorites.push({ book_name, book_url, price, count: 1 });
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
    const { email, book_name } = req.body;

    try {
        const user = await FavoriteModel.findOne({ email });
        if (!user) {
            return res.status(500).json({ message: "User not found" });
        }

        user.favorites = user.favorites.filter(eachItem => eachItem.book_name !== book_name);
        await user.save();
        return res.status(200).json({ message: "Book removed successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Error removing book" });
    }
};

const setIncrement = async (req, res) => {
    const { email, book_name, count } = req.body;

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

export { addFavorite, setLike, removeFavorite, setIncrement };
