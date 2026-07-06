import jwt from 'jsonwebtoken'
import { configDotenv } from 'dotenv'
import User from '../models/user.js';

const authSeller = async (req, res, next) => {
    try {

        const { sellerToken } = req.cookies;
        if (!sellerToken) {
            return res.json({ success: false, message: 'Not Authorized' });
        }
        const tokenDecode = jwt.verify(sellerToken, process.env.JWT_SECRET);
        if (!tokenDecode.email || tokenDecode.email != process.env.SELLER_EMAIL) {
            return res.json({ success: false, message: "Not Authorized" });
        }


        next();

    } catch (error) {
        return res.json({
            success: false,
            message: error.message,
        })
    }
}

export default authSeller;