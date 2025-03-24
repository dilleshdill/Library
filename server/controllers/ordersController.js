import OrdersModel from "../models/ordersModel.js";

// Fetch user orders
export const viewOrders = async (req, res) => {
    const { email } = req.query;

    try {
        if (!email) return res.status(400).json({ message: "Email is required" });

        const user = await OrdersModel.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        return res.status(200).json(user.orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

// Remove a book from user's orders
export const removeOrder = async (req, res) => {
    const { email, book_name } = req.body;

    try {
        if (!email || !book_name) {
            return res.status(400).json({ message: "Email and book name are required" });
        }

        const updatedUser = await OrdersModel.findOneAndUpdate(
            { email },
            { $pull: { orders: { book_name } } },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ message: "Order removed successfully", orders: updatedUser.orders });
    } catch (error) {
        console.error("Error removing order:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

export const addOrder = async (req, res) => {
    const { email, orders } = req.body;
    try {
      if (!email || !orders || !orders.length) {
        throw new Error("Invalid email or empty orders");
      }
  
      const updatedOrder = await OrdersModel.findOneAndUpdate(
        { email },
        { $push: { orders: { $each: orders } } },
        { upsert: true, new: true }
      );
  
      if (!updatedOrder) throw new Error("Order update failed");
      res.status(200).send("Orders added successfully");
    } catch (error) {
      console.error("Error adding orders:", error.message);
      res.status(500).send(`Internal server error: ${error.message}`);
    }
  };

