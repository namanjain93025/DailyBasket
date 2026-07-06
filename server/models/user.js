import mongoose  from "mongoose";

const userSchema = new mongoose.Schema({
    name :{
        type : String,
        required:true,
    },
    email :{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    cartItems : {
        type:Object,
        default :{},
    },
},{minimize:false})
//minimize false ensures that empty obj also saved in doc collection 
const User =  mongoose.model('user',userSchema);
export default User ;