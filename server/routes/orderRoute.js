import express from 'express'
import {authUser} from '../middlewares/authUser.js'
import { getAllOrders, getUserOrders, placeOrderCOD, placeOrderRazorpay, placeOrderStripe, razorpayWebhook, verifyRazorpay } from '../controllers/orderController.js';
import authSeller from '../middlewares/authSeller.js';
const orderRouter = express.Router();

orderRouter.post('/cod',authUser,placeOrderCOD);
orderRouter.post('/stripe',authUser,placeOrderRazorpay);
orderRouter.post('/verify-razorpay',verifyRazorpay);
orderRouter.get('/user',authUser,getUserOrders);
orderRouter.get('/seller',authSeller,getAllOrders);
orderRouter.post("/webhook", razorpayWebhook);

export default orderRouter