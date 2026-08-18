import mongoose from "mongoose";

const dishesSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
    },
    aliases: [String],
    ingredients : [{
        type : mongoose.Schema.Types.ObjectId
    }]

})
const Dishes = mongoose.model('Dishes',dishesSchema);
export default Dishes;