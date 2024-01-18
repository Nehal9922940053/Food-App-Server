import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    address:{
        type: String,
        required: true,
    },
     openingandclosingTime:{
        type: String,
        required: true,
    },
    phone:{
        type:Number,
        required: true,
        unique: true,
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
    role:{
        type: String,
        default:"admin"
    },
    products:{
        type: Array,
        ref:"product"
    },
    orders:{
        type: Array,
        ref:"order"
    }

});

const Restaurant = mongoose.model("restaurant", restaurantSchema);
export default Restaurant;