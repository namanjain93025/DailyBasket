import express from 'express'
import { addDish, isSellerAuth, logoutSeller, sellerLogin ,createIngredient, fetchAllIngredient} from '../controllers/sellerController.js';
import authSeller from '../middlewares/authSeller.js';

const sellerRouter = express.Router();

sellerRouter.post('/login',sellerLogin);
sellerRouter.post('/Login',sellerLogin);
sellerRouter.get('/is-auth',authSeller ,isSellerAuth);
sellerRouter.get('/logout',authSeller ,logoutSeller);
sellerRouter.post('/add-dish',authSeller,addDish)
sellerRouter.post('/create-ingrdient',authSeller,createIngredient)
sellerRouter.get('/fetch-all-ingridient',authSeller,fetchAllIngredient)

export default sellerRouter