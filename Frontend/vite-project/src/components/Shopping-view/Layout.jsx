import React from 'react'
import ShoppingHeader from './Header'
import { Outlet } from 'react-router-dom'

const ShoppingLayout = () => {
  return (
    <div className='flex flex-col bg-whitw overflow-hidden'>
        {/* common header */}
        <h1>Shopping </h1>
        <ShoppingHeader/>
        <main className='flex flex-col w-full'>
            <Outlet/>
        </main>
        </div>
  )
}

export default ShoppingLayout