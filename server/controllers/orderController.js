import Order from "../models/order.js";
import { Product } from "../models/product.js";
import stripe from 'stripe'
import { configDotenv } from "dotenv";
import Razorpay from "razorpay";
import crypto from 'crypto';
import User from "../models/user.js";
import { mailSender } from "../utils/mailsender.js";
//place order COD : /api/order/cod

export const placeOrderCOD = async (req, res) => {
    try {
        const { userId, items, address } = req.body;
        if (!address || items.length === 0) {
            return res.json({ success: false, message: 'Invalid data' })
        }
        //calculate amount using items
        let amount = await items.reduce(async (acc, item) => {
            const product = await Product.findById(item.product);
            return (await acc) + product.offerPrice * item.quantity;
        }, 0)

        // Add Tax Charge (2%)
        amount += Math.floor(amount * 0.02);

        const  order = await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: 'COD',
        });
        
        
        const user = await User.findById(userId);
        
        const mailOption = {
           toEmail : user.email,
           customerName : user.name,
           orderId : order._id,
           items : items,
           totalPrice : amount ,
        }
        const mailres = await mailSender(mailOption);
   
        return res.json({ success: true, message: 'order placed successfully ' })
    } catch (error) {
        return res.json({
            success: false,
            message: error.message,
        })
    }
}
//Get Order by User ID : /api/order/user

export const getUserOrders = async (req, res) => {
    try {
        const { userId } = req;
        const orders = await Order.find({
            userId,
            $or: [{ paymentType: 'COD' }, { isPaid: true }]
        }).populate('items.product address').sort({ createdAt: -1 });

        return res.json({
            success: true,
            orders,
        })

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

//Get All Order : /api/order

export const getAllOrders = async (req, res) => {
    try {

        const orders = await Order.find({
            $or: [{ paymentType: 'COD' }, { isPaid: true }]
        }).populate('items.product address').sort({ createdAt: -1 });

        return res.json({
            success: true,
            orders,
        })


    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}



export const placeOrderStripe = async (req, res) => {
    try {
        const { userId, items, address } = req.body;
        const { origin } = req.headers;

        if (!address || items.length === 0) {
            return res.json({
                success: false,
                message: "Invalid data",
            });
        }

        let productData = [];

        // Calculate total amount
        let amount = await items.reduce(async (acc, item) => {
            const product = await Product.findById(item.product);

            productData.push({
                name: product.name,
                price: product.offerPrice,
                quantity: item.quantity, // Corrected
            });

            return (await acc) + product.offerPrice * item.quantity;
        }, Promise.resolve(0));

        // Add 2% tax
        amount += Math.floor(amount * 0.02);

        // Create order
        const order = await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "Online",
        });

        // Initialize Stripe
        const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

        // Create line items
        const line_items = productData.map((item) => ({
            price_data: {
                currency: "inr", // Change to "usd" if your prices are in USD
                product_data: {
                    name: item.name,
                },
                unit_amount: Math.floor((item.price + item.price * 0.02) * 100),
            },
            quantity: item.quantity,
        }));

        // Create checkout session
        const session = await stripeInstance.checkout.sessions.create({
            line_items,
            mode: "payment",
            success_url: `${origin}/loader?next=my-orders`,
            cancel_url: `${origin}/cart`,
            metadata: {
                orderId: order._id.toString(),
                userId,
            },
        });

        return res.json({
            success: true,
            url: session.url,
        });

    } catch (error) {
        return res.json({
            success: false,
            message: error.message,
        });
    }
};


/// place orderd api/order/razorpay
export const placeOrderRazorpay = async (req, res) => {
    try {
        const { userId, items, address } = req.body;
        console.log(userId, "  ", items, "  ", address);
        if (!address || items.length === 0) {
            return res.json({
                success: false,
                message: "Invalid data",
            });
        }

        let productData = [];

        // Calculate total amount
        let amount = await items.reduce(async (accPromise, item) => {
            const acc = await accPromise;
            const product = await Product.findById(item.product);

            if (!product) {
                throw new Error(`Product not found: ${item.product}`);
            }

            productData.push({
                name: product.name,
                price: product.offerPrice,
                quantity: item.quantity,
            });

            return acc + product.offerPrice * item.quantity;
        }, Promise.resolve(0));

        // Add 2% tax
        amount += Math.floor(amount * 0.02);

        // Create the order in your DB FIRST (status: unpaid)
        const order = await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "Online",
            isPaid: false,
        });

        // Initialize Razorpay
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const options = {
            amount: Math.round(amount * 100), // paise
            currency: 'INR',
            receipt: order._id.toString(), // use your own order id as receipt — makes lookup easy
        };

        const razorpayOrder = await razorpay.orders.create(options);

        // Link the Razorpay order id back to your DB order
        order.razorpayOrderId = razorpayOrder.id;
        await order.save();
         
        return res.json({
            success: true,
            razorpayOrder,
            orderId: order._id,
        });

    } catch (error) {
        console.log(error)
        return res.json({
            success: false,
            message: error.message,
        });
    }
};

export const verifyRazorpay = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest("hex");

        const isValid = expectedSignature === razorpay_signature;

        if (!isValid) {
            await Order.findOneAndUpdate(
                { razorpayOrderId: razorpay_order_id },
                { isPaid: false }
            );
            return res.json({ success: false, message: "Invalid signature" });
        }
        const order = await Order.findOneAndUpdate(
            { razorpayOrderId: razorpay_order_id },
            {
                isPaid: true,
                razorpayPaymentId: razorpay_payment_id,
            },
            { returnDocument: "after" }
        );
        if (!order) {
            return res.json({ success: false, message: "Order not found" });
        }
        const user = await User.findById(order.userId);

        if (user) {
            const mailOption = {
                toEmail: user.email,
                customerName: user.name,
                orderId: order._id,
                totalPrice: order.amount,
            };
            try {
                await mailSender(mailOption);
            } catch (mailErr) {
                console.log("Order verified but email failed:", mailErr);
            }
        }
       
        // const mailOption = {
        //    toEmail : user.email,
        //    customerName : user.name,
        //    orderId : order._id,
        //    totalPrice : order.amount 
        // }
        // const mailres = await mailSender(mailOption);
       
        return res.json({ success: true, message: "Payment verified", order });

    } catch (error) {
        return res.json({ success: false, message: error.message });

    }
}

//razorpay webhook

export const razorpayWebhook = async (req, res) => {
    try {
        const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
        const signature = req.headers["x-razorpay-signature"];

        const expectedSignature = crypto
            .createHmac("sha256", secret)
            .update(req.rawBody) // raw buffer, not parsed JSON
            .digest("hex");

        if (expectedSignature !== signature) {
            return res.status(400).json({ success: false, message: "Invalid signature" });
        }

        // Only parse to JS object AFTER verification succeeds
        const payload = JSON.parse(req.rawBody);
        const event = payload.event;
        const paymentEntity = payload.payload.payment.entity;

        if (event === "payment.captured") {
            await Order.findOneAndUpdate(
                { razorpayOrderId: paymentEntity.order_id },
                { isPaid: true, razorpayPaymentId: paymentEntity.id }

            );
            await User.findByIdAndUpdate(Order.userId, { cartItems: {} })
        } else if (event === "payment.failed") {
            await Order.findOneAndUpdate(
                { razorpayOrderId: paymentEntity.order_id },
                { isPaid: false }
            );
        }

        // Always respond 200 quickly so Razorpay doesn't retry unnecessarily
        return res.status(200).json({ success: true });

    } catch (error) {
        console.error("Webhook error:", error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
};