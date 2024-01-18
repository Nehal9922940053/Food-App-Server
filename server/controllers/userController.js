import  User from '../models/userSchema.js';
import Restaurant from '../models/restaurantSchema.js';
import jwt from 'jsonwebtoken'
import {SECRET_KEY , compPass , hashPass} from '../passwordSecurity/pass.js';
import  Order from '../models/orderSchema.js';



export const signupUser = async (req, res) => {
    try {
        
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/ 

        const {name, email, phone, password} = req.body;

         if (name.length < 1 || email.length < 1 || phone.length < 1 || password.length) {
            return res.json({info : "Fields cannot be empty"})
        } else
         if (!email) {
            return res.json({error : "Email is required"})
        } else if (!emailRegex.test(email)) {
            return res.json({error : "Invalid email format"})
        } else if (!password || password.length < 8) {
            return res.json({error : "Password must be at least more than 8 characters"})
        }


        const user = await User.findOne({email});
        if (user) {
            return res.json({error : "User already exists"})
        } else {
            const hashedPassword = await hashPass(password);
            const newUser  = new User({
                password: hashedPassword, name, email, phone
            });
            await newUser.save();
            return res.status(200).json({ success : "Registered successfully"})
        }

    } catch (error) {
        return res.status(500).json({ error : "error while signing up the user"})
    }
};


export const loginUser = async (req, res) => {
    try {
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/ 

        const {email, password} = req.body;

        if (email.length < 1 || password.length < 1) {
            return res.json({info : "Fields cannot be empty"})
        } else if (!email) {
            return res.json({error : "Email is required"})
        } else if (!emailRegex.test(email)) {
            return res.json({error : "Invalid email format"})
        } else if (!password || password.length < 8) {
            return res.json({error : "Password must be at least more than 8 characters"})
        } 

        const user = await User.findOne({email});
        if (!user) {
            return res.json({error : "User dosen't exists"})
        } else {
            if(user.email !== email) {
                return res.json({ error : "Invalid credentials"})
            }
            const isValid = await compPass(password, user.password);
            if(!isValid){
                return res.json({error :"Incorrect password"});
            }else{
                const token = jwt.sign({email: user.email, id: user._id, role: user.role}, SECRET_KEY , {expiresIn: "2d"} )
                return res.status(200).json({ success : "Logged in successfully", token, userID :user._id, email: user.email, role:user.role })
            }
        }




    } catch (error) {
        res.status(500).json(error, "error while logging in the user");
    }
}

export const changeUserPassword = async(res,req) =>{
    try {
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/ 

        const {email, password, confirmPassword} = req.body;

        if (!email || email.length < 1) {
            return res.json({error : "Email is required"})
        } else if (!emailRegex.test(email)) {
            return res.json({error : "Invalid email format"})
        } else if (!password || password.length < 8) {
            return res.json({error : "Password must be at least more than 8 characters"})
        } else if (password !== confirmPassword) {
            return res.json({error : "Password  dose not match Please enter correct password"})
        } 

        const restaurant = await User.findOne({email});
        if (!restaurant) {
            return res.json({error : "User not found"});
        } else {
            const hashedPassword = await hashPass(password);

            await User.findByIdAndUpdate(restaurant._id, {password : hashedPassword});
            return res.status(200).json({ success : "Password changed successfully"})
        }
        
    } catch (error) {
        return res.status(500).json({ error : "Error updating password"});
    }
}


export const verifyUser = async(req,res) => {
    try {
         res.status(200).json({ message : "Verified user"});
    } catch (error) {
         res.status(500).json({ error : "Error while verifying the user"});
    }
}



export const addToCart = async (req, res) => {
    try {
        const { userID, productID, productName, productImg, quantity, total, restaurantID } = req.body;

        const user = await User.findById(userID);
        if (!user) {
            return res.json({ info: "Login to add products" })
        } else {
            const cartItem = {
                productID, productName, productImg, quantity, total, productID, restaurantID
            }
            user.cart.push(cartItem);
            await user.save()
            return res.status(200).json({ success: "Order added successfully" })
        }
    } catch (error) {
        res.status(500).json(error, "error while adding product to cart")
    }
}
// add to cart end


// getUserCart start 
export const getUserCart = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) {
            return res.json({ error: "User not found" });
        } else {
            if (user?.cart?.length === 0) {
                return res.json({ message: "Cart is empty", items: ["Cart is empty"] })
            } else {
                const arr = [];
                arr.push("Cart is empty")
                user.cart.map((item) => {
                    arr.push(item)
                })
                return res.status(200).json({ success: "cart items found", items: arr })
            }
        }
    } catch (error) {
        res.status(500).json(error, "error while getting user cart products");
    }
}
// getUserCart end


// deleteItemFromCart start 
export const deleteItemFromCart = async (req, res) => {
    try {
        const { userID, productID } = req.body;
        const user = await User.findById(userID);
        if (!user) {
            return res.json({ error: "User not found" })
        } else {
            const { cart } = user;
            const itemIndex = cart.findIndex((item) => item._id === productID);

            if (itemIndex >= 0) {
                cart.splice(itemIndex, 1)
                user.cart = cart;
                await user.save()
                return res.status(200).json({ success: "Removed from cart" })
            } else {
                return res.json({ error: "Item not found in the cart" })
            }
        }
    } catch (error) {
        res.status(500).json(error, "error while deleting the item from cart")
    }
}
// deleteItemFromCart end


// buy start 
export const buy = async (req, res) => {
    try {
        const { userID, productDetails } = req.body;
        const user = await User.findById(userID);

        if (!user) {
            return res.json({ error: "User not found" });
        } else {
            for (const item of productDetails) {
                const restaurant = await Restaurant.findById(item.restaurantID);

                if (!restaurant) {
                    return res.json({ error: "Restaurant not found" });
                } else {
                    const productIndex = restaurant.products.findIndex(product => product._id.toString() === item.productID);
                    if (productIndex === -1) {
                        return res.json({ error: "Product not found in the restaurant" });
                    } else {
                        const name = restaurant.products[productIndex].productName;

                        const newOrder = new Order({
                            userID: item.userID,
                            productID: item.productID,
                            restaurantID: item.restaurantID,
                            quantity: item.quantity,
                            price: item.price,
                            productName: name
                        })
                        restaurant.orders.push(newOrder);
                        restaurant.products[productIndex].quantity -= item.quantity;

                        await restaurant.save();
                        return res.status(200).json({ success: 'Ordered successfully' });
                    }
                }
            }
        }
    } catch (error) {
        res.status(500).json(error, "Error while buying the product");
    }
}
// buy end

// clearCart start 
export const clearCart = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);

        if (!user) {
            return res.json({ error: "User not found" })
        } else {
            await User.findByIdAndUpdate(user._id, { cart: [] })
            return res.status(200).json({ success: "cart cleared successfully", cart: user.cart })
        }
    } catch (error) {
        res.status(500).json(error, "Error while clearing the cart");
    }
}
// clearCart end

// past orders start 
export const pastOrders = async (req, res) => {
    try {
        const { userID, productDetails } = req.body;

        const user = await User.findById(userID);
        if (!user) {
            return res.json({ error: "User not found" });
        } else {
            productDetails.map((item) => {
                user.pastOrders.push(item)
            })
            await user.save()
            return res.status(200).json({ success: "Past orders" })
        }
    } catch (error) {
        res.status(500).json(error, "error while posting the past products");
    }
}
// past orders end


// getPastOrders start 
export const getPastOrders = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) {
            return res.json({ error: "User not found" })
        } else {
            const details = [];
            const pastOrders = user.pastOrders;

            for (const item of pastOrders) {
                if (item.restaurantID) {
                    const restaurant = await Restaurant.findById(item?.restaurantID)
                    const product = restaurant?.products?.find((itm) => itm._id.toString() === item.productID)
                    const data = {
                        restaurantName: restaurant.name,
                        productImg: product.productImg,
                        productName: product.productName,
                        productID: item.productID,
                        quantity: item.quantity,
                        restaurantID: item.restaurantID,
                        price: item.price
                    }
                    details.push(data);
                } else {
                    return res.json({ message: "no products ordered yet" })
                }
            }
            return res.json({ details })
        }
    } catch (error) {
        res.status(500).json(error, "error while getting the past orders")
    }
}
