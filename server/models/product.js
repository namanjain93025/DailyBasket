import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: Array,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    offerPrice: {
        type: Number,
        required: true,
    },
    image: {
        type: Array,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    inStock: {
        type: Boolean,
        default: true,
    },
    ingredient_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref: "Ingredient",
    }
    
}, { timestamps: true })

export const Product = mongoose.model.product || mongoose.model('product', productSchema);



