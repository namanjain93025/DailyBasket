import jwt from 'jsonwebtoken'
import { configDotenv } from 'dotenv';

//seller login : /api/seller/login
// ,..
export const sellerLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (email === process.env.SELLER_EMAIL && password === process.env.SELLER_PASSWORD) {
            //create sellerToken
            const sellerToken = jwt.sign({ email: email }, process.env.JWT_SECRET, { expiresIn: '7d' });
            //send the token is res
            return res.cookie('sellerToken', sellerToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            }).json({
                success: true,
                message: 'Logged in successfully',
            })

        } else {
            return res.json({
                success: false,
                message: 'Invalid Credential'
            })
        }
    } catch (error) {
        return res.json({
            success: false,
            message: error.message,
        })
    }
}

// sellerAtuh = api/seller/is-auth
export const isSellerAuth = async (req, res) => {
    try {
        return res.json({ success: true });
    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message });

    }
}
// logOut User  : /api/seller/logout
export const logoutSeller = async (req, res) => {
    try {
        res.clearCookie('sellerToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        })

        return res.json({
            success: true,
            message: 'Logged out successfully',
        })

    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message });
    }
}