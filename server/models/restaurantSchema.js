import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema({
    name:{
        type: 'string',
        required: true,
    },
    address:{
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
    openingandclosingtime:{
        type: 'string',
        required: true,
    },
    role:{
        type: 'string',
        default: 'admin',
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