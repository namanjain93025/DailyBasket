import User from "../models/user.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { configDotenv } from "dotenv";
import OTP from '../models/otp.js'
import otpGenerator from 'otp-generator'
// register user


export const register = async (req, res) => {
    try {
        const { name, email, password ,otp } = req.body;
        if (!name || !email || !password) {
            return res.json({
                success: false,
                message: 'missing details',
            })
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.json({
                success: false,
                message: 'user already exist',
            })
        }
        //find the latest otp send to user 
        const latestOtpDoc = await OTP.findOne({email }).sort({createdAt : -1});
      
   if(!latestOtpDoc || latestOtpDoc.otp !== otp ){
        return res.status(400).json({
            success :false,
            message :"otp is not matching ",
        })
   }
   //delete otp
   await OTP.deleteMany({ email });
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name, email, password: hashedPassword
        })

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        user.password = "";
        return res.cookie('token', token, {
            httpOnly: true,//prevents js to access cookie
            secure: process.env.NODE_ENV === 'production',//use secure cookie in production
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',//csrf protection
            maxAge: 7 * 24 * 60 * 60 * 1000 // cookie exp time

        }).json({
            success: true,
            user: user,
        })

    } catch (error) {
        return res.json({
            success: false,
            message: error.message,
        })
    }
}




export const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required" });
        }
        

        const user = await User.findOne({ email });
        if (user) {
            return res.status(409).json({
                success: false,
                message: "User with this email already exists",
            });
        }

        let otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });

        let isOtpExist = await OTP.findOne({ otp });
        while (isOtpExist) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            });
            isOtpExist = await OTP.findOne({ otp });
        }

        // clear any stale pending OTPs for this email 
        await OTP.deleteMany({ email });

        
        await OTP.create({ email, otp });

        return res.status(200).json({
            success: true,
            message: "OTP sent successfully to your email",
            
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

//login user 
export const login = async (req, res) => {
    try {
        //step-1 fetch the data 
        const { email, password } = req.body;
        //step-2 validate 
        if (!email || !password) {
            return res.json({
                success: false,
                message: 'All fields are required'
            })
        }
        //step-3 does mail exist 
        const user = await User.findOne({ email })
        //step-4 chechk the pass ans send token
        if (!user) {
            return res.json({
                success: false,
                message: 'User not found',
            })
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({
                success: false,
                message: "Invalid credentials",
            })
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        user.password = "";
        return res.cookie('token', token, {
            httpOnly: true,//prevents js to access cookie
            secure: process.env.NODE_ENV === 'production',//use secure cookie in production
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',//csrf protection
            maxAge: 7 * 24 * 60 * 60 * 1000 // cookie exp time

        }).json({
            success: true,
            message: "login sucessfully",
            user: user,
        })


    } catch (error) {
        return res.json({
            success: false,
            message: error.message,
        })
    }
}

// ../api/user/is-auth
export const isAuth = async (req, res) => {
    try {

        const user = await User.findById(req.userId);

        user.password = undefined;
        return res.json({ success: true, user, message: 'success' })
    } catch (error) {
        return res.json({
            success: true,
            message: error.message,
        })
    }
}

// logOut : /api/user/logout

export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV == 'Production' ? 'none' : 'strict',
        })

        return res.json({ success: true, message: 'User Logged Out Successfully' });
    } catch (error) {
        return res.json({
            success: false,
            message: error.message,
        })
    }
}