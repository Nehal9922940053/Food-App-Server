import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    userID: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    restaurantID: { type: mongoose.Schema.Types.ObjectId, ref: "restaurant" },
    productID: { type: mongoose.Schema.Types.ObjectId, ref: "restaurant.products" },
    productName: { type: mongoose.Schema.Types.String, ref: "restaurant.products" },
    price: { type: String },
    quantity: { type: String },
    status: { type: Boolean, default: false, required: true }

})


const Order = mongoose.model("order", orderSchema);

export default Order;

