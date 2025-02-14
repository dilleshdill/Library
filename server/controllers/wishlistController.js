import WishlistModel from "../models/wishlistModel.js";

const addWishlist = async (req, res) => {
    const { email, book_name, book_url, rating, price, author, date } = req.body;

    try {
        const user = await WishlistModel.findOne({ email });

        if (!user) {
            const newWishlist = await WishlistModel.create({
                email,
                wishlist: [
                    {
                        book_name,
                        book_url,
                        price,
                        rating,
                        author,
                        date
                    }
                ]
            });
            return res.status(200).json({ message: "Book added to wishlist" });
        }

        const exist = user.wishlist.find(eachItem => eachItem.book_name === book_name);
        if (exist) {
            user.wishlist = user.wishlist.filter(eachItem => eachItem.book_name !== book_name);
            await user.save();
            return res.status(201).json({ message: "Book removed from wishlist" });
        } else {
            user.wishlist.push({ book_name, book_url, price, date, author, rating });
            await user.save();
            return res.status(200).json({ message: "Book added to wishlist" });
        }
    } catch (error) {
        console.error("Error adding to wishlist:", error);
        return res.status(500).json({ message: "Server error" });
    }
};
const setLike = async (req, res) => {
    const { email } = req.query;

    try {
        if (email) {
            const user = await WishlistModel.findOne({ email });
            if (user) {
                return res.status(200).json(user.wishlist);
            }
            return res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
};

const removeBook = async (req,res)=>{
    const {email,book_name} = req.body;

    try{
        const user = await WishlistModel.findOne({email})

        if (!user) {
            return res.status(500).json({ message: "User not found" });
        }

        user.wishlist = user.wishlist.filter(eachItem => eachItem.book_name !== book_name);
        await user.save();
        return res.status(200).json({ message: "Book removed successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Error removing book" });
    }
    
}
export {addWishlist,setLike,removeBook};
