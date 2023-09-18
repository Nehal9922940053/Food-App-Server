import { Router } from 'express';
import { addProduct, changeStatus, deleteProduct, getAllRestaurantProducts, getOrderedProduct, getSingleProduct, getSingleRestaurantProducts, updateProduct } from '../controllers/restProductController.js';

const router = Router();

router.post("/addProduct/:restaurantID", addProduct);
router.get("/all", getAllRestaurantProducts);
router.get("/singleRestaurant/:id", getSingleRestaurantProducts)
router.get("/singleProduct/:id", getSingleProduct)
router.put("/delete", deleteProduct)
router.put("/update", updateProduct)
router.get("/orderedProducts/:id", getOrderedProduct)
router.post('/status', changeStatus)

export default router;
