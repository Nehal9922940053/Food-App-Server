import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import Connection from './database/db.js';
import bodyParser from 'body-parser';
import UserRoutes from './routes/userRoutes.js'
import RestaurantRoutes from './routes/restaurantRoutes.js'
import RestaurantProductRoutes from './routes/restProductRoutes.js'
import paymentRoutes from './routes/paymentRoutes.js'
import fs from 'fs'


const PORT = 8000;

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true, limit: "50mb" }))
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, }))
app.use(cors({
    origin:['http://localhost:3000'],
    credentials:true,
    methods:['GET','PUT', 'POST','DELETE']
}));
app.use(cookieParser());

app.use("/user",UserRoutes);
app.use("/restaurant",RestaurantRoutes);
app.use("/restaurant/products",RestaurantProductRoutes);
app.use("/payment", paymentRoutes);

Connection();



app.listen(PORT,() => console.log(`server running on port ${PORT}`));