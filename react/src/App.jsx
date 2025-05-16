import React, { useEffect, useState } from 'react'
import Header from './components/Header'
import Navbar from './components/Navbar'

const App = () => {
  const [selectedLanguage, setSelectedLanguage] = useState({ name: 'English', value: 'en', icon: '/GB.png' })
  const [menuNames, setMenuNames] = useState([])
  const [headings, setHeadings] = useState([])

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        // menu
        const langId = selectedLanguage.value === 'en' ? 9 : 10
        let response = await fetch(`https://sow-terms-backend.onrender.com/terms/${langId}`)
        let data = await response.json()
        setMenuNames(data.content.split(','))

        // heading
        const headId = selectedLanguage.value === 'en' ? 1 : 2
        response = await fetch (`https://sow-terms-backend.onrender.com/terms/${headId}`)
        data = await response.json()
        setHeadings(data.content.split(','))
      } catch (err) {
        console.error('Failed to fetch menu:', err)
      }
    }

    fetchMenu()
  }, [selectedLanguage])

  return (
    <div className='flex flex-col h-screen'>
      <Header selected={selectedLanguage} onChange={setSelectedLanguage} />
      <div className='flex flex-row justify-start h-full bg-gray-100 text-black'>
        <Navbar menuNames={menuNames} />
        <div className='w-full'>
          {/* top of list */}
          <div>

          </div>
          {/* price list */}
          <div>
            <div className='flex flex-row items-center justify-center'>
                {headings.map((name, index) => (
                    <h1 key={index} className='text-lg'>{name}</h1>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
