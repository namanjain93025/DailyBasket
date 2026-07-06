import React from 'react'
import { assets, features } from '../assets/assets'

const BottomBanner = () => {
  return (
    <div className='relative'>
      <img src={assets.bottom_banner_image} alt="" className='w-full hidden md:flex mt-16' />
      <img src={assets.bottom_banner_image_sm} alt="" className='w-full mt-10 md:hidden' />

      <div className='absolute inset-0 flex flex-col items-center md:items-end md:justify-center pt-16 md:pt-0 md:pr-24' >
        <h2 className='text-2xl md:text-3xl font-semibold text-primary mb-6'>Why We Are The Best</h2>
        <div >
          {
            features.map((feature, index) => (
              <div key={index}>
                <img src={feature.icon} alt="" className='md:w-11 w-9' />
                <h4 className='text-lg md:text-xl font-semibold'>{feature.title}</h4>
                <p className='text-gray-500/70 text-xs md:text-sm'>{feature.description}</p>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default BottomBanner