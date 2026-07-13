import cookieParser from 'cookie-parser';
import express from 'express'
import cors from 'cors'
import { connnectTODB } from './config/db.js'; 
import dotenv from 'dotenv'
import userRouter from './routes/userRoutes.js';
import sellerRouter from './routes/sellerRoutes.js';
import { connectCloudinary } from './config/cloudinary.js';
import productRouter from './routes/productRoutes.js';
import cartRouter from './routes/cartRoutes.js';
import addressRouter from './routes/addressRoutes.js';
import orderRouter from './routes/orderRoute.js';
import resetPasswordRoute from './routes/userResetPassword.js';
dotenv.config();


const app = express();
const port= process.env.PORT || 4000;
//Allow Origins
const allowedOrigins =['http://localhost:5173','https://daily-basket-theta.vercel.app']


//middleware
app.use(
    "/api/order/webhook",
    express.raw({ type: "application/json" }),
    (req, res, next) => {
        req.rawBody = req.body; // Buffer, needed for signature check
        next();
    }
);



app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/user',userRouter);
app.use('/api/seller',sellerRouter);
app.use('/api/product',productRouter);
app.use('/api/cart',cartRouter);
app.use('/api/address',addressRouter)
app.use('/api/order',orderRouter)
app.use('/api/reset/',resetPasswordRoute)
//connect to db
await connnectTODB();
connectCloudinary();

app.get('/',(req,res)=>res.send("API  is Working"));


app.listen(port,()=>{
    console.log('server is running on port 4000');
})
