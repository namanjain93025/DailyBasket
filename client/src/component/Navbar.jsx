import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'
import toast from 'react-hot-toast'

const Navbar = () => {
    const [open, setOpen] = useState(false);
    const { user, setUser, setShowUserLogin, navigate, searchQuerry,
        setSearchQuerry, getTotalCount, axios } = useAppContext();

    async function logout() {
        try {
            const { data } = await axios.get('/api/user/logout');

            if (data.success) {
                toast.success(data.message)
                setUser(null);
                navigate('/');
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            toast.error(error.message);
        }

    }

    useEffect(() => {
        if (searchQuerry.length > 0) {
            navigate('/product')
        }
    }, [searchQuerry])
    return (
        <nav className="z-50 flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b  border-gray-300 bg-white relative transition-all">

            <NavLink to='/' onClick={() => (setOpen(false))}>
                <img src={assets.logo} alt="logo" />
            </NavLink>


            {/* Desktop Menu */}
            <div className="hidden sm:flex items-center gap-8">
                <NavLink to='/'>Home</NavLink>
                <NavLink to='/product'>All Product</NavLink>
                <NavLink to='/'>Contact</NavLink>

                <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full">
                    <input onChange={(e) => (setSearchQuerry(e.target.value))} className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500" type="text" placeholder="Search products" />
                    <img src={assets.search_icon} alt="search_icon" />
                </div>

                <div onClick={() => navigate('cart')} className="relative cursor-pointer">
                    <img src={assets.cart_icon} alt="cart" className='h-6' />
                    <button className="absolute -top-2 -right-3 text-xs text-white bg-primary-dull w-[18px] h-[18px] rounded-full">{getTotalCount()}</button>
                </div>
                 <button onClick={() => navigate('seller')} className="cursor-pointer px-8 py-2 bg-white border-primary  text-primary-dull rounded-full">
                    Seller
                </button>
                {!user ? (<button onClick={() => setShowUserLogin(true)} className="cursor-pointer px-8 py-2 bg-primary-dull hover:bg-primary transition text-white rounded-full">
                    Login
                </button>) :
                    (<div className='relative group'>
                        <img src={assets.profile_icon} className='w-10' alt="" />
                        <ul className='hidden group-hover:block absolute top-10 right-0 bg-white shadow border border-gray-200 py-2.5 w-30 rounded-md text-sm z-40'>
                            <li onClick={() => (navigate('my-orders'))} className='p-1.5 pl-3 hover:bg-primary/10 cursor-pointer'>My Orderes</li>
                            <li onClick={() => (logout())} className='p-1.5 pl-3 hover:bg-primary/10 cursor-pointer'>LogOut</li>
                        </ul>
                    </div>)}
            </div>

            <div className='flex sm:hidden items-center gap-6'>
                <div onClick={() => navigate('cart')} className="relative cursor-pointer">
                    <img src={assets.cart_icon} alt="cart" className='h-6' />
                    <button className="absolute -top-2 -right-3 text-xs text-white bg-primary-dull w-[18px] h-[18px] rounded-full">{getTotalCount()}</button>
                </div>
                <button onClick={() => open ? setOpen(false) : setOpen(true)} aria-label="Menu" className="sm:hidden">
                    {/* Menu Icon SVG */}
                    <img src={assets.menu_icon} alt="menu" />
                </button>

            </div>

            {/* Mobile Menu */}
            <div className={`${open ? 'flex' : 'hidden'} absolute top-15 left-0 w-full bg-white shadow-md py-4 flex-col items-start gap-2 px-5 text-sm md:hidden`}>
                <NavLink to='/' onClick={() => (setOpen(false))} >Home</NavLink>
                <NavLink to='/product' onClick={() => (setOpen(false))}>All Product</NavLink>
                {user && <NavLink to='/product' onClick={() => (setOpen(false))}>My Orderes</NavLink>}
                <NavLink to='/' onClick={() => (setOpen(false))}>Contact</NavLink>

                {
                    !user ? (<button onClick={() => { setOpen(false); setShowUserLogin(true) }} className="cursor-pointer px-6 py-2 mt-2 bg-primary-dull hover:bg-primary transition text-white rounded-full text-sm">
                        Login
                    </button>) : (<button onClick={() => (logout())} className="cursor-pointer px-6 py-2 mt-2 bg-primary-dull hover:bg-primary transition text-white rounded-full text-sm">
                        LogOut
                    </button>)
                    
                }
                {
                    <button onClick={() => navigate('seller')} className="cursor-pointer px-6 mt-2 py-2 bg-white border-primary  text-primary-dull rounded-full">
                    Seller
                   </button>
                }
            </div>


        </nav>
    )
}
export default Navbar;