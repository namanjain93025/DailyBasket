import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";
import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
export const AppContext = createContext();

export const AppContextProvider = ({children})=>{
    
    const currency = import.meta.VITE_CURRENCY;
    const navigate = useNavigate()
    const [user , setUser] = useState(null);
    const [isSeller ,setIsSeller] =useState(false);
    const [showUserLogin ,setShowUserLogin] = useState(false)
    const [products ,setProducts] = useState([]);
    const [cartItem, setCartItems] = useState(user?.cartItems ||{});//blank ooj
    const [searchQuerry ,setSearchQuerry] = useState({})
    

    //fetch user Auth Status , User Data and cart Items
   const fetchUser = async () => {
    try {
        const { data } = await axios.get('/api/user/is-auth');

        console.log("Full response:", data);

        if (data.success) {
            console.log("User from backend:", data.user);

            setUser(data.user);
           setCartItems(data.user.cartItems || {});
        }

    } catch (error) {
        console.log(error);
        setUser(null);
    }
}


    const fetchSeller = async()=>{
        try {
            const {data} = await axios.get('/api/seller/is-auth');
            if(data.success){
                setIsSeller(true);
            }else{
                setIsSeller(false);
            }
        } catch (error) {
            setIsSeller(false);
        }
    }

    const fetchProduct = async()=>{
       try {
         const {data}  = await axios.get('/api/product/list')
       
         if(data.success){
            setProducts(data.products)
         }else{
            toast.error(data.message)
         }
       } catch (error) {
            console.log('error' ,error);
            toast.error(error.message)
       }
    }
    useEffect(()=>{
        fetchUser();
        fetchProduct();
        fetchSeller();
    
    },[])


//     useEffect(() => {
//   const updateCart = async () => {
//     try {
//       const { data } = await axios.post('/api/cart/update', {
//         cartItems : cartItem,
//         userId: user?._id
//       });

//       if (!data.success) {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       toast.error( error.message);
//     }
//   };

//   if (user?._id) {
//     updateCart();
//   }
// }, [cartItems, user?._id]);
    
    useEffect(()=>{

                const updateCart = async()=>{
                    try {
                        const {data} = await axios.post('/api/cart/update',{cartItems : cartItem,userId : user._id})
                        if(!data.success){
                            toast.error(data.message);
                        }        
                    } catch (error) {
                        toast.error(error.message)
                    }
                }
    if(user?._id){
        updateCart();
    }
    

    },[cartItem,user])

    //Add profd to cart
    const AddToCart = (itemId)=>{
        let cartData  = structuredClone(cartItem);
        
        if(cartData[itemId]){
            cartData[itemId]+=1;
        }else{
            cartData[itemId]=1;

        }
        setCartItems(cartData)
        toast.success('Added to Cart')
        
    }
    //update cart item qtyn   
    const updateCartItem = (itemId,qty)=>{
        let cartData = structuredClone(cartItem);
        cartData[itemId] = qty;
        setCartItems(cartData);
        toast.success('Cart Updated')
    }
    // remove from cart
    const removeFromCart = (itemId)=>{
         let cartData = structuredClone(cartItem)
         if(cartData[itemId]){
            cartData[itemId]-=1;
            if(cartData[itemId]===0){
                delete cartData[itemId];
            }
        }
        toast.success('Remove from Cart')
        setCartItems(cartData)
        }

        //get total count
        const getTotalCount = ()=>{
            let totalCount =0;
            for(const item in cartItem){
                totalCount+=cartItem[item]
            }
            return totalCount;
        }
        //get cart total amount
        const getTotalAmount = ()=>{
            let amount=0;
            for(const item in cartItem){
                const product = products.find((product)=>(product._id==item));
                if(!product) continue;
                const price = Number(product.offerPrice ?? product.price ?? 0);
                amount += cartItem[item] * price;
            }
            return amount;
        }
    const value = {
        navigate,
        user,
        setIsSeller,
        isSeller,
        setUser, 
        showUserLogin,
        setShowUserLogin,
        products,
        cartItem,
        AddToCart,
        updateCartItem,
        removeFromCart,
        currency,
        searchQuerry,
        setSearchQuerry,
        getTotalAmount,
        getTotalCount,
        axios,
        fetchProduct,
        setCartItems
    }

    return(
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = ()=>{
    return useContext(AppContext);
}