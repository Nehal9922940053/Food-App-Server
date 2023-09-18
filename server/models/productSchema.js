import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true,
    },
    productImg: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    price: {
        type: Array,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default:0
    },
    adminID:{ type:mongoose.Schema.Types.ObjectId, required:true, ref:"restaurant" }
})

const Product = mongoose.model("product", productSchema)
export default Product;
