import { Router } from 'express';
import { orders, verify } from '../controllers/paymentController.js';


const router = Router();

router.post("/orders", orders);
router.post("/verify", verify);

export default router
