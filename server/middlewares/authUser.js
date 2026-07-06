import jwt from 'jsonwebtoken'
import { configDotenv } from 'dotenv';
import User from '../models/user.js';
export const authUser = async(req ,res,next)=>{
    //step-1 token step-2 validation step-3 
    try {
        // console.log('inside auth user middelware ')
        const {token} = req.cookies;
        // console.log('token is' ,token);
        
        if(!token){
            return res.json({success : false , message : 'Not Authorized'});
            
        }
        //step-2 
        try {
            const tokenDecode = jwt.verify(token,process.env.JWT_SECRET)
            if(!tokenDecode.id)return res.json({success : false , message:"Not Authorized"})
                // console.log("decoded token ",tokenDecode)
                req.userId = tokenDecode.id;
            // console.log(req.body.userId , "   req.body.userId")

        } catch (error) {
            console.log("error occured in authUser " ,error)
            return res.json({
                success : false,
                message : 'invalid token'
            })
        
        }
        next();


    } catch (error) {
        return res.json({
            success : false,
            message : error.message,
        })
    }
}
