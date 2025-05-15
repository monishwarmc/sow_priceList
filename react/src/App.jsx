import React, { useEffect, useState } from 'react'
import Header from './components/Header'
import Navbar from './components/Navbar'

const App = () => {
  const [selectedLanguage, setSelectedLanguage] = useState({ name: 'English', value: 'en', icon: '/GB.png' })
  const [menuNames, setMenuNames] = useState([])

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const langId = selectedLanguage.value === 'en' ? 9 : 10
        const response = await fetch(`https://sow-terms-backend.onrender.com/terms/${langId}`)
        const data = await response.json()
        setMenuNames(data.content.split(','))
      } catch (err) {
        console.error('Failed to fetch menu:', err)
      }
    }

    fetchMenu()
  }, [selectedLanguage])

  return (
    <div className='flex flex-col h-screen'>
      <Header selected={selectedLanguage} onChange={setSelectedLanguage} />
      <div className='flex flex-row justify-start h-full items-center bg-gray-100 text-black'>
        <Navbar menuNames={menuNames} />
        <h1>Hello World</h1>
      </div>
    </div>
  )
}

export default App
