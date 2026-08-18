import express from 'express'
import { upload } from '../config/multer.js';
import authSeller from '../middlewares/authSeller.js';
import { addProduct, changeStock, fetchIngredient, productById ,productList } from '../controllers/productController.js';
const productRouter = express.Router();

productRouter.post('/add',authSeller,upload.array('images'),addProduct)
productRouter.get('/list',productList)
productRouter.get('/id',productById)
productRouter.post('/stock',authSeller,changeStock)
productRouter.get('/dish',fetchIngredient)

export default productRouter