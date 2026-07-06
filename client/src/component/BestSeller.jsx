import React from 'react'
import ProductCard from './ProductCard'
import { useAppContext } from '../context/AppContext'
const BestSeller = () => {
  const { products } = useAppContext()
  console.log("products is - ", products)



  return (
    <div className='mt-16'>
      <p className='text-2xl md:text-3xl font-mediumtext-2xl md:text-3xl font-medium'>BestSeller</p>
      <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 mt-6 gap-8'>
        {
          products && products.filter((prod, index) => (prod.inStock)).slice(0, 5).map((product, index) => (<ProductCard key={index} product={product} />))
        }
      </div>
    </div>
  )
}

export default BestSeller