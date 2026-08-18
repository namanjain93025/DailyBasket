import mongoose from "mongoose";

const ingredientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
     
});
 const Ingredient =  mongoose.model('Ingredient',ingredientSchema);
 export default Ingredient ;