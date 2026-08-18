import jwt from 'jsonwebtoken'
import { configDotenv } from 'dotenv';
import Ingredient from '../models/ingredient.js';
// import { promises } from 'nodemailer/lib/xoauth2/index.js';
import Dishes from '../models/dishes.js';
//seller login : /api/seller/login
// ,..
export const sellerLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (email === process.env.SELLER_EMAIL && password === process.env.SELLER_PASSWORD) {
            //create sellerToken
            const sellerToken = jwt.sign({ email: email }, process.env.JWT_SECRET, { expiresIn: '7d' });
            //send the token is res
            return res.cookie('sellerToken', sellerToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            }).json({
                success: true,
                message: 'Logged in successfully',
            })

        } else {
            return res.json({
                success: false,
                message: 'Invalid Credential'
            })
        }
    } catch (error) {
        return res.json({
            success: false,
            message: error.message,
        })
    }
}

// sellerAtuh = api/seller/is-auth
export const isSellerAuth = async (req, res) => {
    try {
        return res.json({ success: true });
    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message });

    }
}
// logOut User  : /api/seller/logout
export const logoutSeller = async (req, res) => {
    try {
        res.clearCookie('sellerToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        })

        return res.json({
            success: true,
            message: 'Logged out successfully',
        })

    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message });
    }
}

//fetch all ingredinet api/seller/fetchAllIngredinet
export const fetchAllIngredient = async (req, res) => {
    try {
        
        const ingredients = await Ingredient.find({});

        if (ingredients.length === 0) {
            return res.json({
                success: false,
                message: "No ingredients found",
            });
        }

        return res.json({
            success: true,
            ingredients,
        });

    } catch (error) {
        return res.json({
            success: false,
            message: error.message,
        });
    }
};
//crete ingrdint 


// Create Ingredient : POST /api/seller/ingredientadd
export const createIngredient = async (req, res) => {
    try {
        const { name } = req.body;

        // Validate name
        if (!name || name.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Ingredient name is required"
            });
        }

        // Check if ingredient already exists
        const existingIngredient = await Ingredient.findOne({
            name: name });

        if (existingIngredient) {
            return res.status(400).json({
                success: false,
                message: "Ingredient already exists"
            });
        }

        // Create ingredient
        const ingredient = await Ingredient.create({
            name: name.trim(),
            
        });

        return res.status(201).json({
            success: true,
            message: "Ingredient created successfully",
            ingredient
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// api/seller/add-dish
export const addDish = async (req, res) => {
    try {
        const { name, aliases, ingredientsName } = req.body;

        if (!name || !aliases || !ingredientsName) {
            return res.json({
                success: false,
                message: "Enter all data",
            });
        }

        const ingredients = await Promise.all(
            ingredientsName.map(async (ingredient) => {

                const foundIngredient = await Ingredient.findOne({
                    name: ingredient
                });

                if (!foundIngredient) {
                    throw new Error(
                        `Ingredient ${ingredient} does not exist`
                    );
                }

                return foundIngredient._id;
            })
        );

        await Dishes.create({
            name,
            aliases,
            ingredients,
        });

        return res.json({
            success: true,
            message: "Dish created successfully",
        });

    } catch (error) {
        return res.json({
            success: false,
            message: error.message,
        });
    }
};