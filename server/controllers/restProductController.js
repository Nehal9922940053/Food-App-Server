import Restaurant from "../models/restaurantSchema.js";
import Product from '../models/productSchema.js'
import { BSON } from 'bson'
import User from "../models/userSchema.js";




export const getAllRestaurantProducts = async (req, res) => {
    try {
        
        const productData = [];

       
        const restaurants = await Restaurant.find();

        
        restaurants.map((restaurant) => {
            const data = {
                restaurantName: restaurant.name,
                products: restaurant.products,
                id: restaurant._id
            }
            productData.push(data)
        })
        return res.json({ info: "Products found", productData })
    } catch (error) {
        res.json(error, "error while getting all restaurants products")
    }
}



export const addProduct = async (req, res) => {
    try {
        const { restaurantID } = req.params;
        const data = req.body;

        if (data.productImg.length < 1 || data.productName.length < 1 || data.desc.length < 1 || data.category.length < 1 || data.price.length < 1 || data.quantity.length < 1) {
            return res.json({ info: "Fields cannot be empty" })
        }

        const restaurant = await Restaurant.findById(restaurantID);
        const restaurantProduct = restaurant.products
        if (!restaurant) {
            return res.json({ error: "Not admin, you cannot create an item" });
        } else {
            const product = new Product(data)
            restaurantProduct.push(product);
            await restaurant.save();
            return res.json({ success: "Product created successfully", product: restaurant.products })
        }

    } catch (error) {
        console.log(error, "error while adding products");
    }
}

export const getSingleRestaurantProducts = async (req, res) => {
    try {
        const { id } = req.params;
        const restaurant = await Restaurant.findById(id);
        if (!restaurant) {
            return res.json({ error: "Restaurant not found" });
        } else {
            return res.json({ message: "items found", product: { name: restaurant.name, data: restaurant.products, id: restaurant._id, address: restaurant.address, opening: restaurant.openingTime, closing: restaurant.closingTime } })
        }
    } catch (error) {
        res.json(error, 'error while getting single restaurant products');
    }
}

export const getSingleProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const restaurants = await Restaurant.find();
        let product = [];

        restaurants.map((rest) => {
            const foundProduct = rest.products.find((item) => item._id.toString() === id.toString());
            if (foundProduct) {
                product.push(foundProduct);
            }
        });

        if (product.length === 0) {
            res.json({ message: "Product not found" });
        } else {
            res.json({ message: "Product found", product });
        }
    } catch (error) {
        res.status(500).json({ message: "Error while getting the single product", error });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const { productID, restaurantID } = req.body;
        const restaurant = await Restaurant.findById(restaurantID);
        if (!restaurant) {
            return res.json({ error: "Restaurant not found" });
        } else {
            const products = restaurant.products;
            const itemIndex = products.findIndex((item) => item._id.toString() === productID.toString())

            if (itemIndex >= 0) {
                products.splice(itemIndex, 1)
                restaurant.products = products;
                await restaurant.save();
                return res.json({ success: "Item removed successfully", items: restaurant.products })
            } else {
                return res.json({ error: "Item not found" })
            }
        }

    } catch (error) {
        res.json(error, "Error while deleting the product");
    }
}

export const updateProduct = async (req, res) => {
    try {
        const { restaurantID, data } = req.body;
        const restaurant = await Restaurant.findOneAndUpdate({ "_id": restaurantID, "products._id": { "$in": [new BSON.ObjectId(data._id)] } },
            {
                $set: {
                    "products.$.productName": data.productName,
                    "products.$.productImg": data.productImg,
                    "products.$.desc": data.desc,
                    "products.$.quantity": data.quantity,
                    "products.$.price": data.price,
                    "products.$.category": data.category,
                },
            }
        )

        res.json({ success: "Product updated successfully" })
    } catch (error) {
        res.json(error, "error while updating the product");
    }
}

export const getOrderedProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const restaurant = await Restaurant.findById(id);

        if (!restaurant) {
            return res.json({ error: "Restaurant not found" })
        } else {
            const orders = restaurant.orders;
            return res.json({ message: "Orders found", orders })
        }
    } catch (error) {
        res.json(error, "Error while getting the ordered products");
    }
}

export const changeStatus = async (req, res) => {
    try {
        const { orderID, restaurantID } = req.body;

        const restaurant = await Restaurant.findById(restaurantID);

        if (!restaurant) {
            return res.json({ error: "Restaurant not found" })
        } else {
            await Restaurant.findOneAndUpdate({ "_id": restaurant._id, "orders._id": { $in: [new BSON.ObjectId(orderID)] } },

                {
                    $set: {
                        "orders.$.status": true
                    }
                })

            return res.json({ success: "Preparing to deliver" })
        }

    } catch (error) {
        res.json(error, "error while changing the status");
    }
}
