import { cloudinary } from '../config/cloudinary.js';
import { Product } from '../models/product.js';
import Ingredient from '../models/ingredient.js';
import Dishes from '../models/dishes.js';
//Add Product : /api/product/add
// export const addProduct = async (req, res) => {
//     try {

//         if (!req.body.productData || !req.files) {
//             return res.json({
//                 success: false,
//                 message: 'Either File or Data is missing'
//             })
//         }

//         let productData = JSON.parse(req.body.productData);


//         const images = req.files

//         let imagesUrl = await Promise.all(
//             images.map(async (item) => {
//                 let result = await await cloudinary.uploader.upload(item.path, { resource_type: "auto", folder: "E-COM" })
//                 return result.secure_url;
//             })
//         )

//         await Product.create({ ...productData, image: imagesUrl });
//         res.json({ success: true, message: 'Product Added' });

//     } catch (error) {
//         console.log(error);
//         res.json({ success: false, message: error.message });
//     }
// }



// helper to upload a buffer via stream
const uploadFromBuffer = (buffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { resource_type: "auto", folder: "E-COM" },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );
        stream.end(buffer);
    });
};

export const addProduct = async (req, res) => {
    try {
        if (!req.body.productData || !req.files) {
            return res.json({
                success: false,
                message: 'Either File or Data is missing'
            });
        }
        

        let productData = JSON.parse(req.body.productData);

        const images = req.files;

        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                const result = await uploadFromBuffer(item.buffer);
                return result.secure_url;
            })
        );
        console.log("ingre ",productData.ingredient)
        const ingredient = await Ingredient.findById(productData.ingredient)

        if (!ingredient) {
            return res.json({
                success: false,
                message: "Ingredient does not exist"
            });
        }

        const ingredient_id = ingredient._id;
        
        await Product.create({ ...productData,ingredient_id, image: imagesUrl });
        res.json({ success: true, message: 'Product Added' });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

//Get Produvt : /api/product/list

export const productList = async (req, res) => {
    try {

        const products = await Product.find({});

        return res.json({ success: true, products })
    } catch (error) {

        return res.json({ success: false, message: error.message });
    }
}

// Get Singlr Product : /api/product/id
export const productById = async (req, res) => {
    try {
        const { id } = req.body
        const product = await Product.findById(id);
        return res.json({ success: true, product })
    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message })
    }
}


//Change product inStock : /api/product/stock
export const changeStock = async (req, res) => {
    try {

        const { id, inStock } = req.body

        await Product.findByIdAndUpdate(id, { inStock });
        return res.json({ success: true, message: "Stock Updated" });

    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message })
    }
}

// api/product/dish
export const fetchIngredient = async (req, res) => {
    try {
        console.log('inside fetchingredient func')
        const { dishName } = req.query;
        console.log(dishName)
        if (!dishName) {
            return res.json({
                success: false,
                message: "Dish name does not exist"
            });
        }

         const dish = await Dishes.findOne({
        $or: [
        { name: { $regex: `^${dishName}$`, $options: "i" } },
        { aliases: { $regex: `^${dishName}$`, $options: "i" } }
            ]
        });
        
        if (!dish) {
            return res.json({
                success: false,
                message: "Dish does not exist"
            });
        }

        // const ingredients = dish.ingredients;
        const items = await Product.find({
            ingredient_id: {
                $in: dish.ingredients
            },
            inStock: true
        }).populate("ingredient_id");
            

        return res.json({
            success: true,
            items
        });

    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        });
    }
};