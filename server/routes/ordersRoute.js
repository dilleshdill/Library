import express from "express";
import { viewOrders, removeOrder,addOrder,addAdminOrders, removeAdminOrder} from "../controllers/ordersController.js";

const OrdersRoute = express.Router();

OrdersRoute.get("/", viewOrders); // Fetch orders using GET method
OrdersRoute.post("/remove", removeOrder); // Route to remove an order
OrdersRoute.post("/add", addOrder); // Route to add an order
OrdersRoute.post("/admin-orders/add",addAdminOrders)
OrdersRoute.post("/admin-orders/remove",removeAdminOrder)
export default OrdersRoute;
