import OrdersModel from "../models/ordersModel.js";
import AdminOrdersModel from "../models/adminOrdersSchema.js";

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
    const { email, bookId } = req.body;

    try {
        if (!email || !bookId) {
            return res.status(400).json({ message: "Email and book name are required" });
        }

        const updatedUser = await OrdersModel.findOneAndUpdate(
            { email },
            { $pull: { orders: { bookId } } },
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

  export const addAdminOrders = async (req, res) => {
    try {
        const { libraryId, orders } = req.body;

        // Validate request body
        if (!libraryId || !orders || !Array.isArray(orders) || orders.length === 0) {
            return res.status(400).json({ message: "Invalid order data" });
        }

        // Find existing admin order record for this library
        let adminOrders = await AdminOrdersModel.findOne({ libraryId });

        if (!adminOrders) {
            // If no record exists, create a new one
            adminOrders = new AdminOrdersModel({ libraryId, orders });
        } else {
            // Avoid duplicate entries by checking existing orders
            const existingOrderIds = new Set(adminOrders.orders.map(order => order._id.toString()));
            const newOrders = orders.filter(order => !existingOrderIds.has(order._id));

            if (newOrders.length > 0) {
                adminOrders.orders.push(...newOrders);
            }
        }

        await adminOrders.save();
        res.status(200).json({ message: "Orders added to admin panel", adminOrders });
    } catch (error) {
        console.error("Error adding admin orders:", error);
        res.status(500).json({ message: error.message });
    }
};
import mongoose from "mongoose";

export const removeAdminOrder = async (req, res) => {
    try {
        const { bookId } = req.body;
        console.log(bookId);

        if (!bookId) {
            return res.status(400).json({ message: "Book ID is required" });
        }

        // Use $pull to remove bookId from all orders in AdminOrdersModel
        const result = await AdminOrdersModel.updateMany(
            { "orders.bookId": bookId },  // Find orders containing bookId
            { $pull: { orders: { bookId } } } // Remove the book from orders array
        );

        console.log("Update Result:", result);

        res.status(200).json({ message: "Order removed successfully" });

    } catch (error) {
        console.error("Error removing admin order:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};





