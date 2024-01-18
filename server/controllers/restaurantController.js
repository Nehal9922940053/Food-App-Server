import Restaurant from "../models/restaurantSchema.js";
import jwt from 'jsonwebtoken';
import { SECRET_KEY, compPass, hashPass } from "../passwordSecurity/pass.js";



export const signupRestaurant = async (req, res) => {
    try { 
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
        const { name, email, address, password, openingandclosingTime, phone } = req.body;

        if (!name || name.length < 1) {
            return res.json({ error: "Restaurant name required" })
        } else if (!email || email.length < 1) {
            return res.json({ error: "Email required" })
        } else if (!emailRegex.test(email)) {
            return res.json({ error: "Invalid email format" })
        } else if (!address || address.length < 1) {
            return res.json({ error: "Address required" })
        } else if (!password || password.length < 8) {
            return res.json({ error: "Password must be more than 8 characters" })
        } else if (!openingandclosingTime ||!phone) {
            return res.json({ error: "Opening and closing time required" })
        }


        const restaurant = await Restaurant.findOne({ email })
        if (restaurant) {
            return res.json({ error: "Restaurant already exist" })
        } else {
            const hashedPassword = await hashPass(password);
            const newRestaurant = new Restaurant({
                password: hashedPassword, name, address, email, openingandclosingTime, phone
            });
            await newRestaurant.save();
            return res.json({ success: "Restaurant registered successfully" })
        }
    } catch (error) {
        res.json(error, "error while signing up the restaurant");
    }
}


export const loginRestaurant = async (req, res) => {
    try {
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
        const { email, password } = req.body;
        
        if (!email || email.length < 1) {
            return res.json({error : "Email is required"})
        }  else if (!emailRegex.test(email)) {
            return res.json({ error: "Invalid email format" })
        } else if (!password || password.length < 8) {
            return res.json({ error: "Password must be more than 8 characters" })
        } else {
            const restaurant = await Restaurant.findOne({ email });

            if (!restaurant) {
                return res.json({ error: "Restaurant not found" });
            } else {
                const isValid = await compPass(password, restaurant.password);
                if (!isValid) {
                    return res.json({ error: "Incorrect password" });
                }else{
                    const token = jwt.sign({ email: restaurant.email, id: restaurant._id, role: restaurant.role }, SECRET_KEY, { expiresIn: "2d" });
                    return res.json({ success: "Logged in successfully", email: restaurant.email, token, role: restaurant.role, restaurantID: restaurant._id })
                }
            }
        }
    } 
    catch (error) {
        res.json(error, "error while logging in the restaurant");
    }
}

export const changePassword = async (req, res) => {
    try {
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
        const { email, password, confirmPassword } = req.body;
        
        if (!email || email.length < 1) {
            return res.json({ error: "Email required" })
        } else if (!emailRegex.test(email)) {
            return res.json({ error: "Invalid email format" })
        } else if (!password || password.length < 8) {
            return res.json({ error: "Password must be more than 8 characters" })
        } else if (password !== confirmPassword) {
            return res.json({ error: "Password doesn't match please enter correct password" })
        }

        const restaurant = await Restaurant.findOne({ email });
        if (!restaurant) {
            return res.json({ error: "Restaurant not found" });
        } else {
            const hashedPassword = await hashPass(password);

            await Restaurant.findByIdAndUpdate(restaurant._id, { password: hashedPassword });
            return res.json({ success: "Password changed successfully" })
        }
    } catch (error) {
        res.json(error, "error while changing the restaurant's password");
    }
}

 
export const verifyRestaurant = async (req, res) => {
    try {
        res.status(200).json({ message: "Verified admin" })
    } catch (error) {
        res.status(500).json(error, "error while verifying the admin")
    }
}

