import express from 'express'
import { resetPasswordToken, resetPassword } from '../controllers/userResetPassword.js'

const resetPasswordRoute = express.Router();

resetPasswordRoute.post('/update-password-token', resetPasswordToken);
resetPasswordRoute.post('/reset-password', resetPassword);

export default resetPasswordRoute;