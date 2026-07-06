import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { Link, useParams } from 'react-router-dom';
import { assets } from '../assets/assets';
import ProductCard from '../component/ProductCard.jsx'

const ProductPage = () => {

    const { id, category } = useParams();
    const { products, navigate, AddToCart, currency } = useAppContext();

    const [relatedProducts, setRelatedProducts] = useState([]);
    const [thumbnail, setThumbnail] = useState(null);

    const product = products.find((item) => (item._id === id));
    useEffect(() => {
        if (products.length > 0) {
            let productCopy = products.slice();
            productCopy = productCopy.filter((items) => (items.category.toLowerCase() === category))
            console.log("product copy is ", productCopy)
            setRelatedProducts(productCopy);

        }
    }, [products])


    useEffect(() => {
        setThumbnail(product?.image[0] ? product.image[0] : null);
    }, [product])


    if (!product) {
        return <p>Loading product...</p>;
    }

    return product && (
        <div className="max-w-6xl w-full px-6 flex flex-col "  >
            <div>
                <p>
                    <Link to='/'>Home</Link> /
                    <Link to='/product'> Products</Link> /
                    <Link to={`/product/${product.category}`}> {product.category}</Link> /
                    <Link className="text-indigo-500"> {product.name}</Link>
                </p>

                <div className="flex flex-col md:flex-row gap-16 mt-4">
                    <div className="flex gap-3">
                        <div className="flex flex-col gap-3">
                            {product.image.map((image, index) => (
                                <div key={index} onClick={() => setThumbnail(image)} className="border max-w-24 border-gray-500/30 rounded overflow-hidden cursor-pointer" >
                                    <img src={image} alt={`Thumbnail ${index + 1}`} />
                                </div>
                            ))}
                        </div>

                        <div className="border border-gray-500/30 max-w-100 rounded overflow-hidden">
                            <img src={thumbnail} alt="Selected product" className="w-full h-full object-cover" />
                        </div>
                    </div>

                    <div className="text-sm w-full md:w-1/2">
                        <h1 className="text-3xl font-medium">{product.name}</h1>

                        <div className="flex items-center gap-0.5 mt-1">
                            {Array(5).fill('').map((_, i) => (
                                <img src={i < 4 ? assets.star_icon : assets.star_dull_icon} alt="" className='md:w-4 w-3.5' />
                            ))}
                            <p className="text-base ml-2">({product.rating})</p>
                        </div>

                        <div className="mt-6">
                            <p className="text-gray-500/70 line-through">MRP:{currency} {product.price}</p>
                            <p className="text-2xl font-medium">MRP: {currency}{product.offerPrice}</p>
                            <span className="text-gray-500/70">(inclusive of all taxes)</span>
                        </div>

                        <p className="text-base font-medium mt-6">About Product</p>
                        <ul className="list-disc ml-4 text-gray-500/70">
                            {product.description.map((desc, index) => (
                                <li key={index}>{desc}</li>
                            ))}
                        </ul>

                        <div className="flex items-center mt-10 gap-4 text-base">
                            <button onClick={() => AddToCart(product._id)} className="w-full py-3.5 cursor-pointer font-medium bg-gray-100 text-gray-800/80 hover:bg-gray-200 transition" >
                                Add to Cart
                            </button>
                            <button onClick={() => { AddToCart(product._id); navigate("/cart") }} className="w-full py-3.5 cursor-pointer font-medium bg-primary text-white hover:bg-primary-dull transition" >
                                Buy now
                            </button>
                        </div>
                    </div>
                </div>


            </div>
            <div className='mt-8 flex flex-col justify-center items-center'>
                <p className='text-center bold text-3xl'>Related Products</p>
                <div className="w-30 h-1 bg-primary"></div>

                <div className=' grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 mt-10 justify-items-center gap-2'>
                    {
                        relatedProducts &&
                        relatedProducts.filter((_, i) => (i < 5)).map((product, index) =>
                            (<ProductCard key={index} product={product} />)
                        )
                    }
                </div>
                <div className='mt-10 w-25 text-center text-primary border border-solid border-primary transition hover:text-primary-dull  '>

                    <button onClick={() => navigate('/product')} >See More</button>

                </div>
            </div>
        </div>
    );

}

export default ProductPage