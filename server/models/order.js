import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
   userId : {
    type : String,
    requird:true,
    ref :'user',
   },
   items :[{
    product : {type:String , required:true,ref :'product'},
    quantity : {type:Number,required:true},
   }],
   amount :{
    type:Number,
    required:true,
   },
   address : {
    type: String,
    requird :true,
    ref : 'address'
   },
   status :{
    type : String,
    default :'Order Placed'
   },
   paymentType :{
    type : String,
    required : true,
   },
   isPaid :{
    type:Boolean,
    required:true,
    default : false,
   },
   razorpayOrderId :{
       type:String,
   },
   razorpayPaymentId :{
      type :String,
   }

},{timestamps:true})

const Order  = mongoose.model.order || mongoose.model('order',orderSchema)

export default Order