import React from 'react'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <div className='flex min-h-screen w-full bg-gray-100'>
        <div className='hidden lg:flex items-center justify-center bg-black h-screen w-1/2 px-12'>
            <div className='max-w-md space-y-6 text-center text-primary'>
                <h1 className='text-4xl font-bold tracking-tight'>Welcome Ecommerce Shopping</h1>
            </div>
        </div>
        <div className='flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8'>
            <Outlet />
        </div>
    </div>
  )
}

export default Layout