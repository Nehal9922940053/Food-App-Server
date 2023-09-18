import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name:{
        type: 'string',
        required: true,
    },
    email:{
        type: 'string',
        unique: true,
        required: true,
    },
    password:{
        type: 'string',
        required: true,
    },
    // profileImg:{
    //     type: 'string'
    // },
    phone:{
        type:Number,
        required: true,
        unique: true,
    },
    role:{
        type: 'string',
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