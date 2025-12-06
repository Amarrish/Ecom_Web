
import './App.css'
import { Route, Routes } from 'react-router-dom'
import AuthLayout from './components/auth/Layout'
import Login from './Pages/auth/Login'
import Register from './Pages/auth/Register'
import AdminLayout from './components/Admin-view/Layout'
import AdminDashboard from './Pages/Admin-view/Dashboard'
import AdminProducts from './Pages/Admin-view/Products'
import AdminOrders from './Pages/Admin-view/Orders'
import AdminFeatures from './Pages/Admin-view/Features'
import ShoppingLayout from './components/Shopping-view/Layout'
import NotFound from './Pages/Not-found/NotFound'
import ShoppingHome from './Pages/Shopping-view/Home'
import ShoppingListing from './Pages/Shopping-view/Listing'
import ShoppingAccount from './Pages/Shopping-view/Account'
import ShoppingCheckout from './Pages/Shopping-view/Checkout'
import CheckAuth from './components/Common/CheckAuth'
import Unauth from './Pages/Unauth/Unauth'
import { useDispatch, useSelector } from 'react-redux'
import { Skeleton } from './components/ui/skeleton'
import { useEffect } from 'react'
import { checkAuth } from './store/auth-slice'
import Sampleone from './Pages/sample/Sampleone'
import Sampletwo from './Pages/sample/Sampletwo'
import Samplethree from './Pages/sample/Samplethree'

function App() {

  const {user, isAuthenticated, isLoading} = useSelector((state) => state.auth);
  
 const dispatch = useDispatch();

 useEffect(()=>{
  dispatch(checkAuth())
 },[dispatch])

 if (isLoading) return <Skeleton className="h-[20px] w-[100px] rounded-full" />
 
console.log(isLoading, user);

  return (
  <div className='flex flex-col bg-white'>
  

    <Routes>

      <Route path='/auth' element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user}>
            <AuthLayout />
        </CheckAuth>
        }>
          <Route path='login' element={<Login />} />
          <Route path='register' element={<Register />} />
      </Route>



      <Route path='/admin' element={
         <CheckAuth isAuthenticated={isAuthenticated} user={user}>
            <AdminLayout/>
        </CheckAuth>
      }>
          <Route path='dashboard' element={<AdminDashboard/>}/>
          <Route path='products' element={<AdminProducts/>}/>
          <Route path='orders' element={<AdminOrders/>}/>
          <Route path='features' element={<AdminFeatures/>}/>
      </Route>

      
        <Route path='/shop' element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user}>
            <ShoppingLayout/>
          </CheckAuth>
         }>
          <Route path='home' element={<ShoppingHome/>}/>
          <Route path='listing' element={<ShoppingListing/>}/>
          <Route path='checkout' element={<ShoppingCheckout/>}/>
          <Route path='accounts' element={<ShoppingAccount/>}/>
        </Route>

        <Route path='/smone' element={<Sampleone/>}/>
        <Route path='/smtwo' element={<Sampletwo/>}/>
        <Route path='/smth' element={<Samplethree/>}/>


        <Route path='/unauth-page' element={<Unauth/>}/>
        <Route path='*' element={<NotFound/>}/>

    </Routes>
  </div>
  )
}

export default App
