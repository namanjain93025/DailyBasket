import jwt from 'jsonwebtoken'
import { configDotenv } from 'dotenv';
import User from '../models/user.js';
export const authUser = async (req, res, next) => {
   
    try {

        const { token } = req.cookies;


        if (!token) {
            return res.json({ success: false, message: 'Not Authorized' });

        }
       
        try {
            const tokenDecode = jwt.verify(token, process.env.JWT_SECRET)
            if (!tokenDecode.id) return res.json({ success: false, message: "Not Authorized" })

            req.userId = tokenDecode.id;


        } catch (error) {
            console.log("error occured in authUser ", error)
            return res.json({
                success: false,
                message: 'invalid token'
            })

        }
        next();


    } catch (error) {
        return res.json({
            success: false,
            message: error.message,
        })
    }
}
