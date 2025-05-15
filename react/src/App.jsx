import React from 'react'
import Header from './components/Header'
import Navbar from './components/Navbar'

const App = () => {
  return (
    <div className='flex flex-col h-screen'>
      <Header />
      <div className='flex flex-row justify-start h-full items-center bg-gray-100 text-black'>
        <Navbar />
        <h1 className=''>Hello World</h1>
      </div>
    </div>
  )
}

export default App
