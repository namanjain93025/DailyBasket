import React from 'react'
import  Navbar  from './component/Navbar.jsx'
import { Routes ,Route, useLocation } from 'react-router-dom'
import Home from './pages/Home.jsx'
import {Toaster} from 'react-hot-toast'
import Footer from './component/Footer.jsx'
import { useAppContext } from './context/AppContext.jsx'
import Login from './component/Login.jsx'
import AllProducts from './pages/AllProducts.jsx'
import ProductCategory from './pages/ProductCategory.jsx'
import ProductPage from './pages/ProductPage.jsx'
import Cart from './pages/Cart.jsx'
import AddAdress from './pages/AddAdress.jsx'
import MyOrderes from './pages/MyOrderes.jsx'
import SellerLogin from './component/seller/SellerLogin.jsx'
import SellerLayout from './pages/SellerLayout.jsx'
import AddProduct from './component/seller/AddProduct.jsx'
import ProductList from './component/seller/ProductList.jsx'
import Orders from './component/seller/Orders.jsx'
function App(){

const isSellerPath = useLocation().pathname.includes('seller');
// console.log("seller path is , ",isSellerPath);

const { showUserLogin ,isSeller } = useAppContext()
// console.log("showUseLogin is ",showUserLogin);
// console.log("isSeller, ",isSeller)
  return (
    <div className='text-default min-h-screen text-gray-700 bg-white'>
     
      {isSellerPath? null :<Navbar/>}
      {showUserLogin?(<Login/>) : null}
      <Toaster/>
       <div className={`${isSellerPath ?"" :'px-6 md:px-16 lg:px-24 xl:px-32'}`}>
       <Routes>
          <Route path='/' element={<Home/>}></Route>
          <Route path='/product' element={<AllProducts/>}></Route>
          <Route path='/product/:category' element={<ProductCategory/>}></Route>
          <Route path='/product/:category/:id' element={<ProductPage/>}></Route>
          <Route path='/cart' element={<Cart/>}></Route>
          <Route path='/add-address' element={<AddAdress/>}></Route>
          <Route path='/my-orders' element={<MyOrderes/>}></Route>
          <Route path='/seller' element={isSeller ? <SellerLayout/> : <SellerLogin/>}>
            <Route index element={<AddProduct/>} />
            <Route path='product-list' element={<ProductList/>} />
            <Route path='orders' element={<Orders/>} />
            
          </Route>
          
       </Routes>
     </div>
       
        {isSellerPath? null :<Footer/>}
    </div>
  )
}

export default App