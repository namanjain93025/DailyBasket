import React, { useState } from 'react'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const InputField = ({ type, placeholder, name, handleChange, address }) => (
  <input className='w-full px-2 py-2.5  border border-gray-500/30 rounded outline-none'
    type={type}
    placeholder={placeholder}
    onChange={handleChange}
    name={name}
    value={address[name]}
    required
  />)

const AddAdress = () => {
  const [address, setAddress] = useState({
    firstName: '',
    lastName: '',
    email: "",
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: '',
  })
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prevAdd) => ({
      ...prevAdd,
      [name]: value,
    }))
  }
  const { navigate, axios, user } = useAppContext()
  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();

      if (!user?._id) {
        toast.error("login first");
        navigate('/cart')
        return;
      }
      
      const { data } = await axios.post('/api/address/add', { address, userId: user._id });
      
      if (data.success) {
        toast.success(data.message);
        navigate('/cart')
      } else {

        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className='mt-16 pb-16'>
      <p className='text-2xl md:text-3xl text-gray-500'>Add Shipping
        <span className='font-semibold text-primary'>Address</span></p>
      <div className='flex flex-col-reverse md:flex-row justify-between mt-10'>
        <div className='flex  flex-col  max-w-md'>
          <form onSubmit={onSubmitHandler} >
            <div className='flex gap-2 mt-5'>
              <InputField handleChange={handleChange} address={address} placeholder={'first Name'} name='firstName' type='text' />
              <InputField handleChange={handleChange} address={address} placeholder={'last Name'} name='lastName' type='text' />
            </div>
            <div className=' mt-5'>
              <InputField handleChange={handleChange} address={address} placeholder={'email'} name='email' type='email' />

            </div>
            <div className='mt-5'>
              <InputField handleChange={handleChange} address={address} placeholder={'street'} name='street' type='text' />
            </div>
            <div className='flex gap-2  mt-5'>
              <InputField handleChange={handleChange} address={address} placeholder={'city'} name={'city'} type={'text'} />
              <InputField handleChange={handleChange} address={address} placeholder={'state'} name='state' type='text' />
            </div>
            <div className='flex gap-2 mt-5'>
              <InputField handleChange={handleChange} address={address} placeholder={'zipcode'} name={'zipcode'} type={'number'} />
              <InputField handleChange={handleChange} address={address} placeholder={'country'} name='country' type='text' />
            </div>
            <div className='mt-5'>
              <InputField handleChange={handleChange} address={address} placeholder={'phone'} name='phone' type='Number' />
            </div>
            <div className='mt-5'>
              <button className='bg-primary text-white hover:bg-primary-dull transition w-full h-10'>Save Address</button>
            </div>


          </form>
        </div>
        <img className='md:mr-16 mb-16 md:mt-0' src={assets.add_address_iamge} alt="" />
      </div>
    </div>
  )
}

export default AddAdress