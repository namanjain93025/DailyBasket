import React from 'react'
import { useAppContext } from '../context/AppContext';
import { assets } from '../assets/assets';

const ProductCard = ({ product }) => {
   console.log("product is this , " , product);
 const [count, setCount] = React.useState(0);
 const { AddToCart, updateCartItem, removeFromCart, navigate, currency, cartItem } = useAppContext();
   
   

    return (
        <div onClick={()=>{navigate(`/product/${product.category.toLowerCase()}/${product._id}`);scrollTo(0,0);}} className="border border-gray-500/20 rounded-md md:px-4 px-3 py-2 bg-white min-w-40 max-w-40 w-full md:min-w-56 md:max-w-56">
            <div className="group cursor-pointer flex items-center justify-center px-2">
                <img className="group-hover:scale-105 transition max-w-26 md:max-w-36" src={product.image[0]} alt={product.name} />
            </div>
            <div className="text-gray-500/60 text-sm">
                <p>{product.category}</p>
                <p className="text-gray-700 font-medium text-lg truncate w-full">{product.name}</p>
                <div className="flex items-center gap-0.5">
                    {Array(5).fill('').map((_,i) => (
                         <img key={i} className='md:w-3.5 w3' src={i< (product.rating?product.rating :3) ? assets.star_icon : assets.star_dull_icon} alt="" />        
                    ))}
                   
                </div>
                <div className="flex items-end justify-between mt-3">
                    <p className="md:text-xl text-base font-medium text-primary-dull">
                        ${product.offerPrice} <span className="text-gray-500/60 md:text-sm text-xs line-through">{currency}${product.price}</span>
                    </p>
                    <div className="text-primary-dull">
                        {!cartItem[product._id] ? (
                            <button  className="flex items-center justify-center gap-1 bg-primary-dutext-primary-dull border border-primary-dutext-primary-dull
                             md:w-[80px] w-[64px] h-[34px] rounded text-primary-dull font-medium" onClick={(e) => {setCount(1); AddToCart(product._id); e.stopPropagation() }} >
                                <img src={assets.cart_icon} alt="cart" />
                                Add
                            </button>
                        ) : (
                            <div className="flex items-center justify-center gap-2 md:w-20 w-16 h-[34px] bg-primary-dutext-primary-dull/25 rounded select-none">
                                <button onClick={(e) => {removeFromCart(product._id); e.stopPropagation();}} className="cursor-pointer text-md px-2 h-full" >
                                    -
                                </button>
                                <span className="w-5 text-center">{cartItem[product._id]}</span>
                                <button onClick={(e) => {AddToCart(product._id); e.stopPropagation()}} className="cursor-pointer text-md px-2 h-full" >
                                    +
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductCard