import React from 'react'
import HeaderComponent from './HeaderComponent'
import MenuComponent from './MenuComponent'
// truyen vao children va goi ra ben duoi header
const DefaultComponent = ({children}) => {
  return (
    <div className="flex flex-col min-h-screen">
        <HeaderComponent/>
        <main className="flex-grow">
          {children}
        </main>
        <MenuComponent/>
    </div>
  )
}

export default DefaultComponent