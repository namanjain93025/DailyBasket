import { cloudinary } from '../config/cloudinary.js';
import {Product} from '../models/product.js';


//Add Product : /api/product/add
export const addProduct = async (req ,res)=>{
try {
    // console.log('hii');
     if(!req.body.productData || !req.files){
        return res.json({
            success :false,
            message : 'Either File or Data is missing'
        })
     }

    // console.log("BODY", req.body);
    // console.log("FILES", req.files);
    let productData  = JSON.parse(req.body.productData);
    
   
    const images = req.files
    //  console.log("images uuu ", images);
    let imagesUrl = await Promise.all(
        images.map(async(item)=>{
// console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
// console.log("API Key:", process.env.CLOUDINARY_API_KEY);
// console.log("Path:", item.path);
//  console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_SECRET);
                    let result = await await cloudinary.uploader.upload(item.path ,{resource_type: "auto",folder:"E-COM"})
                    return result.secure_url;
                })
    )
       
    // console.log("images ulrs", imagesUrl);
    await Product.create({...productData , image : imagesUrl});
    res.json({success : true , message : 'Product Added'});

} catch (error) {
    console.log(error);
    res.json({success :false ,message : error.message});
}
}

//Get Produvt : /api/product/list

export const productList = async(req,res)=>{
    try {
      
        const products = await Product.find({});
       
       return  res.json({success : true, products})
    } catch (error) {
        
       return res.json({success : false, message : error.message});
    }
}

// Get Singlr Product : /api/product/id
export const productById = async(req,res)=>{
    try {
        const {id}= req.body
        const product = await Product.findById(id);
        return  res.json({success : true , product})
    } catch (error) {
        console.log(error.message);
       return res.json({success:false, message :error.message})
    }
}


//Change product inStock : /api/product/stock
export const changeStock = async(req,res)=>{
    try {
       
        const {id ,inStock} = req.body
       
        await Product.findByIdAndUpdate(id,{inStock});
        return res.json({success:true,message:"Stock Updated"});

    } catch (error) {
        console.log(error.message);
        return res.json({success:false,message:error.message})
    }
}