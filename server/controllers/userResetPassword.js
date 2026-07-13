import User from '../models/user.js'
import { sendResetEmail } from '../utils/mailSenderResPasw.js'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import dotenv from 'dotenv'
dotenv.config();

export const resetPasswordToken = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please enter an email',
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal whether the email exists — respond the same either way
      return res.status(200).json({
        success: true,
        message: 'If that email exists, a reset link has been sent.',
      });
    }

    const token = crypto.randomUUID();

    await User.findOneAndUpdate(
      { email },
      {
        token: token,
        tokenExpiresIn: Date.now() + 5 * 60 * 1000, // actual expiry timestamp, 5 min from now
      },
      { new: true }
    );

    const url = process.env.NODE_ENV === 'production'
      ? `https://daily-basket-theta.vercel.app/update-password/${token}`
      : `http://localhost:5173/update-password/${token}`;

    await sendResetEmail(email, url);

    return res.status(200).json({
      success: true,
      message: 'Reset link sent successfully',
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Error occurred while sending link',
    });
  }
};




///reset password
export const resetPassword = async (req ,res)=>{
try {
    console.log('reset password function')
        //data fetch
    const {password , token} = req.body
   
    //get userdetails from db using token
    const user  = User.findOne({token});
    //if no entry invalid 
    if(!user){
        return res.status(400).json({
            success :false,
            message :'user is not present ',
        })
    }
    //token time expires
    if(user.tokenExpiresIn < Date.now()){
        //token exp
        return res.status(400).json({
            success: false,
            message : `token has expired`,
        })
    }
    //hash password
    const hashedPassword = await  bcrypt.hash(password,10);
    // update paasword
    await User.findOneAndUpdate({token},{password:hashedPassword},{new :true});

    //return res
    return res.status(200).json({
        success : true,
        message : 'user is updated successfully ',
    })
} catch (error) {
    console.log(error)
    return res.status(500).json({
        success : false,
        message : 'something went wrong while updating password',
    })
}
}