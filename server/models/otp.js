import mongoose from 'mongoose';
import { sendOtpMail } from '../utils/mailSenderOtp.js';

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        index: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 5 * 60, // TTL: auto-deletes after 5 min
    },
});

// Send mail before persisting — if mail fails, doc is never saved
otpSchema.pre('save', async function () {
    if (this.isNew) {
        try {
            const mailResponse = await sendOtpMail(this.email, this.otp);
            console.log('mail response:', mailResponse);
        } catch (error) {
            console.log('Error sending OTP mail:', error.message);
            throw error; // blocks save
        }
    }
});

export default mongoose.model('OTP', otpSchema);