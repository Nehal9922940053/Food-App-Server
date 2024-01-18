import { Router } from 'express';
import { changePassword, loginRestaurant, signupRestaurant, verifyRestaurant } from '../controllers/restaurantController.js';
import { restaurantVerification } from '../auth/verify.js'

const router = Router();

router.post("/signup", signupRestaurant)
router.post("/login", loginRestaurant)
router.put("/changePassword", changePassword);
router.get("/verifyRestaurant", restaurantVerification, verifyRestaurant);



export default router;
