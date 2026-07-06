import mongoose from "mongoose";
// require('dotenv').config();
import dotenv from "dotenv";
dotenv.config();

export const connnectTODB = async () => {
  try {        // Throws an error "getaddrinfo ENOTFOUND doesnt.exist" after 30 seconds
    const connected = await mongoose.connect(process.env.MONGODB_URL);
    if (connected) console.log('conneced to db')
  } catch (e) {
    console.error(e.message)
  }
}

