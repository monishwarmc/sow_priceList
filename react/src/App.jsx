import React, { useEffect, useState, useRef } from 'react'
import Header from './components/Header'
import Navbar from './components/Navbar'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

const App = () => {
  const [selectedLanguage, setSelectedLanguage] = useState({ name: 'English', value: 'en', icon: '/GB.png' })
  const [menuNames, setMenuNames] = useState([])
  const [headings, setHeadings] = useState([])
  const [products, setProducts] = useState([])
  const [articleSearch, setArticleSearch] = useState('')
  const [nameSearch, setNameSearch] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  const [previewImage, setPreviewImage] = useState(null)
  const tableRef = useRef(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch menu
        const langId = selectedLanguage.value === 'en' ? 9 : 10
        let response = await fetch(`https://sow-terms-backend.onrender.com/terms/${langId}`)
        let data = await response.json()
        setMenuNames(data.content.split(','))

        // Fetch headings
        const headId = selectedLanguage.value === 'en' ? 1 : 2
        response = await fetch(`https://sow-terms-backend.onrender.com/terms/${headId}`)
        data = await response.json()
        setHeadings(data.content.split(','))

        // Fetch products
        response = await fetch('https://sow-terms-backend.onrender.com/products')
        data = await response.json()
        setProducts(data)
      } catch (err) {
        console.error('Failed to fetch data:', err)
      }
    }

    fetchData()
  }, [selectedLanguage])

  // Filter products based on search inputs
  const filteredProducts = products.filter((product) =>
    product.article_no.toLowerCase().includes(articleSearch.toLowerCase()) &&
    product.name.toLowerCase().includes(nameSearch.toLowerCase())
  )

  // Handle Price List button: Generate preview
  const handlePriceList = async () => {
    if (tableRef.current) {
      try {
        const canvas = await html2canvas(tableRef.current, { scale: 2 })
        const imgData = canvas.toDataURL('image/png')
        setPreviewImage(imgData)
        setShowPreview(true)
      } catch (err) {
        console.error('Failed to generate preview:', err)
      }
    }
  }

  // Handle PDF download
  const handleDownloadPDF = () => {
    const pdf = new jsPDF('p', 'mm', 'a4')
    const imgWidth = 190 // A4 width in mm minus margins
    const img = new Image()
    img.src = previewImage
    img.onload = () => {
      const imgHeight = (img.height * imgWidth) / img.width
      pdf.addImage(previewImage, 'PNG', 10, 15, imgWidth, imgHeight)
      pdf.save('price-list.pdf')
      setShowPreview(false)
    }
  }

  // Placeholder handlers for other buttons
  const handleAddNewProduct = () => {
    console.log('Add New Product clicked')
    // Add functionality here
  }

  const handleAdvancedMode = () => {
    console.log('Advanced Mode clicked')
    // Add functionality here
  }

  return (
    <div className='flex flex-col h-screen'>
      <Header selected={selectedLanguage} onChange={setSelectedLanguage} />
      <div className='flex flex-row h-full bg-gray-100 text-black'>
        <Navbar menuNames={menuNames} />
        <div className='w-full flex flex-col items-center justify-start'>
          {/* Top of list */}
          <div className='h-24 w-full flex justify-between items-center px-24 bg-white shadow-sm'>
            {/* Left side: Search bars */}
            <div className='flex flex-col gap-2'>
              <input
                type='text'
                placeholder={`Search ${headings[0]}`}
                value={articleSearch}
                onChange={(e) => setArticleSearch(e.target.value)}
                className='border border-gray-300 rounded-md px-3 py-1 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
              <input
                type='text'
                placeholder={`Search ${headings[1]}`}
                value={nameSearch}
                onChange={(e) => setNameSearch(e.target.value)}
                className='border border-gray-300 rounded-md px-3 py-1 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>
            {/* Right side: Buttons */}
            <div className='flex gap-3'>
              <button
                onClick={handleAddNewProduct}
                className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition'
              >
                Add New Product
              </button>
              <button
                onClick={handlePriceList}
                className='bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition'
              >
                Price List
              </button>
              <button
                onClick={handleAdvancedMode}
                className='bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 transition'
              >
                Advanced Mode
              </button>
            </div>
          </div>
          {/* Price list */}
          <div className='px-24 w-full'>
            <table ref={tableRef} className='w-full' style={{ display: 'grid' }}>
              <thead style={{ 
                display: 'grid', 
                gridTemplateColumns: '1.5fr 3fr 1fr 1fr 2fr 1fr 3fr' 
              }}>
                <tr style={{ display: 'contents' }}>
                  {headings.map((name, index) => (
                    <th key={index} className='text-lg text-left'>
                      {name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody style={{ 
                display: 'grid', 
                gridTemplateColumns: '1.5fr 3fr 1fr 1fr 2fr 1fr 3fr' 
              }}>
                {filteredProducts.map((product) => (
                  <tr key={product.id} style={{ display: 'contents' }}>
                    <td className='text-left'>{product.article_no}</td>
                    <td className='text-left'>{product.name}</td>
                    <td className purchasing_price>{product.in_price}</td>
                    <td className='text-left'>{product.price}</td>
                    <td className='text-left'>{product.unit}</td>
                    <td className='text-left'>{product.in_stock}</td>
                    <td className='text-left'>{product.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white p-6 rounded-lg max-w-4xl w-full max-h-[80vh] overflow-auto'>
            <h2 className='text-xl font-bold mb-4'>Price List Preview</h2>
            <img src={previewImage} alt='Price List Preview' className='w-full' />
            <div className='flex justify-end gap-4 mt-4'>
              <button
                onClick={() => setShowPreview(false)}
                className='bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition'
              >
                Cancel
              </button>
              <button
                onClick={handleDownloadPDF}
                className='bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition'
              >
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App