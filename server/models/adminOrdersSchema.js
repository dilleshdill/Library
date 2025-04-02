import mongoose from "mongoose";

const adminOrdersSchema = new mongoose.Schema({
    libraryId: { type: mongoose.Schema.Types.ObjectId, ref: "Library", required: true },
    orders: [
        {
            email: { type: String, required: true }, // User who placed the order
            book_url: { type: String, required: true },
            book_name: { type: String, required: true },
            price: { type: String, required: true },
            count: { type: Number, required: true },
            status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" }, // Order status
            bookId:{ type: mongoose.Schema.Types.ObjectId, ref: "book", required: true },
            orderedAt: { type: Date, default: Date.now },
        }
    ]
});

const AdminOrdersModel = mongoose.model("AdminOrder", adminOrdersSchema);

export default AdminOrdersModel;
