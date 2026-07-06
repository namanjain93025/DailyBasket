import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import axios from 'axios';
import toast from 'react-hot-toast';

const SellerLogin = () => {
    const { navigate,isSeller ,setIsSeller,axios} = useAppContext()
    const [email ,setEmail] = useState('');
    const [password ,setPassword] = useState('');

    useEffect(()=>{
        if(isSeller){
            navigate('/seller')
        }
    },[isSeller, navigate])

    const onSubmitHandler = async(e)=>{
        try {
            e.preventDefault();
            const {data } = await axios.post('/api/seller/login',{email,password}) 
            console.log(data);
            if(data.success){
                setIsSeller(true);
                navigate('/seller');
            }else{
                toast.error(data.message)
            }
        
        } catch (error) {
            toast.error(error.message)
        }
    }
    function onChangeHandlerEmail(e){
        setEmail(e.target.value);
    }

     function onChangeHandlerPassword(e){
        setPassword(e.target.value);
    }
  return ( !isSeller &&<div>  <form onSubmit={onSubmitHandler} className='min-h-screen flex items-center 
        text-sm text-gray-600'>
            <div className='flex flex-col gap-5 m-auto items-start
            p-8 py-12 min-w-80 sm:min-w-88 rounded-lg shadow-xl border-gray-200'>
                <p className='text-2xl font-medium m-auto'><span className='text-primary'>Seller</span> Login</p>
                <div className='w-full '>
                    <p>Email</p>
                    <input type="email" placeholder='enter email'
                    className='border border-gray-200 rounded w-full p-2 mt-1 outline-primary' name='email' value={email} onChange={onChangeHandlerEmail}/>
                </div>
                <div className='w-full '>
                    <p>Password</p>
                    <input className='border border-gray-200 rounded w-full p-2 mt-1 outline-primary'
                     type="password" placeholder='password'  name='password' value={password} onChange={onChangeHandlerPassword} />
                </div>
                <button className='bg-primary text-white w-full py-2 rounded-md cursor-pointer'>Login</button>
            </div>

        </form></div> )
}


export default SellerLogin
