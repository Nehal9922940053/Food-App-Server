import { Router } from 'express';
import { addToCart, buy, changeUserPassword, clearCart, deleteItemFromCart, getPastOrders, getUserCart, loginUser, pastOrders, signupUser, verifyUser } from '../controllers/userController.js';
import { userVerification } from '../auth/verify.js';

const router = Router();

router.post("/signup", signupUser)
router.post("/login", loginUser)
router.put("/changePassword", changeUserPassword);
router.get("/verifyUser", userVerification, verifyUser)
router.post("/addToCart", addToCart)
router.get("/cart/:id", getUserCart)
router.put('/deleteItem', deleteItemFromCart)
router.post("/buyProduct", buy)
router.put("/clearCart/:id", clearCart)
router.post("/pastOrders", pastOrders)
router.get("/pastOrders/:id", getPastOrders)

export default router;
