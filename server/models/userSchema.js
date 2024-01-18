import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        unique: true,
        required: true,
    },
    password:{
        type: String,
        required: true,
    },
    phone:{
        type:Number,
        required: true,
        unique: true,
    },
    role:{
        type: String,
        default: 'user',
    },
    cart:{
        type: Array,
        ref:"restaurant"
    },
    pastOrders:{
        type: Array,
        ref:"order"
    }
});

const User = mongoose.model("user", userSchema);
export default User;