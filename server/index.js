import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import Connection from './database/db.js';
import UserRoutes from './routes/userRoutes.js'
import RestaurantRoutes from './routes/restaurantRoutes.js'
import RestaurantProductRoutes from './routes/restProductRoutes.js'


const PORT = 8000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true , limit: "10mb"}));
app.use(cors({
    origin:['http://localhost:3000'],
    credentials:true,
    methods:['GET','PUT', 'POST','DELETE']
}));
app.use(cookieParser());

app.use("/user",UserRoutes);
app.use("/restaurant",RestaurantRoutes);
app.use("/restaurant/products",RestaurantProductRoutes);


Connection();



app.listen(PORT,() => console.log(`server running on port ${PORT}`));