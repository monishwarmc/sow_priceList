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
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [showEditProduct, setShowEditProduct] = useState(false)
  const [editProduct, setEditProduct] = useState(null)
  const [newProduct, setNewProduct] = useState({
    article_no: '',
    name: '',
    in_price: '',
    price: '',
    unit: '',
    in_stock: '',
    description: ''
  })
  const [dropdownId, setDropdownId] = useState(null)
  const tableRef = useRef(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const langId = selectedLanguage.value === 'en' ? 9 : 10
        let response = await fetch(`https://sow-terms-backend.onrender.com/terms/${langId}`)
        let data = await response.json()
        setMenuNames(data.content.split(','))

        const headId = selectedLanguage.value === 'en' ? 1 : 2
        response = await fetch(`https://sow-terms-backend.onrender.com/terms/${headId}`)
        data = await response.json()
        setHeadings(data.content.split(','))

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
    const imgWidth = 190
    const img = new Image()
    img.src = previewImage
    img.onload = () => {
      const imgHeight = (img.height * imgWidth) / img.width
      pdf.addImage(previewImage, 'PNG', 10, 15, imgWidth, imgHeight)
      pdf.save('price-list.pdf')
      setShowPreview(false)
    }
  }

  // Handle Add New Product button: Open modal
  const handleAddNewProduct = () => {
    setShowAddProduct(true)
  }

  // Handle form input changes
  const handleInputChange = (e, isEdit = false) => {
    const { name, value } = e.target
    if (isEdit) {
      setEditProduct((prev) => ({ ...prev, [name]: value }))
    } else {
      setNewProduct((prev) => ({ ...prev, [name]: value }))
    }
  }

  // Handle form submission for adding product
  const handleSubmitProduct = async (e) => {
    e.preventDefault()
    try {
      if (!newProduct.article_no || !newProduct.name || !newProduct.in_price || !newProduct.price || !newProduct.unit || !newProduct.in_stock) {
        alert('Please fill in all required fields.')
        return
      }

      const productData = {
        article_no: newProduct.article_no,
        name: newProduct.name,
        in_price: parseFloat(newProduct.in_price),
        price: parseFloat(newProduct.price),
        unit: newProduct.unit,
        in_stock: parseInt(newProduct.in_stock),
        description: newProduct.description || ''
      }

      const response = await fetch('https://sow-terms-backend.onrender.com/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      })

      if (!response.ok) throw new Error('Failed to add product')

      const addedProduct = await response.json()
      setProducts((prev) => [...prev, addedProduct])
      setNewProduct({
        article_no: '',
        name: '',
        in_price: '',
        price: '',
        unit: '',
        in_stock: '',
        description: ''
      })
      setShowAddProduct(false)
    } catch (err) {
      console.error('Failed to add product:', err)
      alert('Failed to add product. Please try again.')
    }
  }

  // Handle Edit Product: Open modal
  const handleEditProduct = (product) => {
    setEditProduct(product)
    setShowEditProduct(true)
    setDropdownId(null)
  }

  // Handle form submission for editing product
  const handleSubmitEditProduct = async (e) => {
    e.preventDefault()
    try {
      if (!editProduct.article_no || !editProduct.name || !editProduct.in_price || !editProduct.price || !editProduct.unit || !editProduct.in_stock) {
        alert('Please fill in all required fields.')
        return
      }

      const productData = {
        article_no: editProduct.article_no,
        name: editProduct.name,
        in_price: parseFloat(editProduct.in_price),
        price: parseFloat(editProduct.price),
        unit: editProduct.unit,
        in_stock: parseInt(editProduct.in_stock),
        description: editProduct.description || ''
      }

      const response = await fetch(`https://sow-terms-backend.onrender.com/products/${editProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      })

      if (!response.ok) throw new Error('Failed to update product')

      const updatedProduct = await response.json()
      setProducts((prev) =>
        prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
      )
      setShowEditProduct(false)
    } catch (err) {
      console.error('Failed to update product:', err)
      alert('Failed to update product. Please try again.')
    }
  }

  // Handle Delete Product
  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return
    try {
      const response = await fetch(`https://sow-terms-backend.onrender.com/products/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete product')

      setProducts((prev) => prev.filter((p) => p.id !== id))
      setDropdownId(null)
    } catch (err) {
      console.error('Failed to delete product:', err)
      alert('Failed to delete product. Please try again.')
    }
  }

  // Handle Advanced Mode button
  const handleAdvancedMode = () => {
    console.log('Advanced Mode clicked')
  }

  // Toggle dropdown
  const toggleDropdown = (id) => {
    setDropdownId(dropdownId === id ? null : id)
  }

  return (
    <div className='flex flex-col h-screen w-screen'>
      <Header selected={selectedLanguage} onChange={setSelectedLanguage} />
      <div className='flex flex-row h-full bg-gray-100 text-black'>
        <Navbar menuNames={menuNames} />
        <div className='w-full ml-60 mt-24 flex flex-col'>
          {/* Top of list */}
          <div className='h-24 w-full flex justify-between items-center px-24 bg-white shadow-sm'>
            <div className='flex flex-col gap-2'>
              <input
                type='text'
                placeholder={headings[0] ? `Search ${headings[0]}` : 'Search Article No'}
                value={articleSearch}
                onChange={(e) => setArticleSearch(e.target.value)}
                className='border border-gray-300 rounded-md px-3 py-1 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
              <input
                type='text'
                placeholder={headings[1] ? `Search ${headings[1]}` : 'Search Product'}
                value={nameSearch}
                onChange={(e) => setNameSearch(e.target.value)}
                className='border border-gray-300 rounded-md px-3 py-1 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>
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
                Print List
              </button>
              <button
                onClick={handleAdvancedMode}
                className='bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 transition'
              >
                Advanced Mode
              </button>
            </div>
          </div>
          {/* Price list for full */}
          <div className='flex-1 px-24 w-full overflow-y-auto'>
            <table ref={tableRef} className='w-full' style={{ display: 'grid' }}>
              <thead style={{ 
                display: 'grid', 
                gridTemplateColumns: '1.5fr 3fr 1fr 1fr 2fr 1fr 3fr 0.5fr' 
              }}>
                <tr style={{ display: 'contents' }}>
                  {headings.map((name, index) => (
                    <th key={index} className='text-lg text-left py-2'>
                      {name}
                    </th>
                  ))}
                  <th className='text-lg text-left py-2'></th>
                </tr>
              </thead>
              <tbody style={{ 
                display: 'grid', 
                gridTemplateColumns: '1.5fr 3fr 1fr 1fr 2fr 1fr 3fr 0.5fr',
              }}>
                {filteredProducts.map((product) => (
                  <tr key={product.id} style={{ display: 'contents' }}>
                    <td className='text-left py-2'>{product.article_no}</td>
                    <td className='text-left py-2'>{product.name}</td>
                    <td className='text-left py-2'>{product.in_price}</td>
                    <td className='text-left py-2'>{product.price}</td>
                    <td className='text-left py-2'>{product.unit}</td>
                    <td className='text-left py-2'>{product.in_stock}</td>
                    <td className='text-left py-2'>{product.description}</td>
                    <td className='text-left py-2 relative'>
                      <button
                        onClick={() => toggleDropdown(product.id)}
                        className='text-gray-600 hover:text-gray-800'
                      >
                        ⋮
                      </button>
                      {dropdownId === product.id && (
                        <div className='absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10'>
                          <button
                            onClick={() => handleEditProduct(product)}
                            className='block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className='block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100'
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Price List Preview Modal */}
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

      {/* Add Product Modal */}
      {showAddProduct && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white p-6 rounded-lg w-full max-w-md'>
            <h2 className='text-xl font-bold mb-4'>Add New Product</h2>
            <form onSubmit={handleSubmitProduct} className='flex flex-col gap-4'>
              <div>
                <label className='block text-sm font-medium'>Article No *</label>
                <input
                  type='text'
                  name='article_no'
                  value={newProduct.article_no}
                  onChange={handleInputChange}
                  className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                  required
                />
              </div>
              <div>
                <label className='block text-sm font-medium'>Name *</label>
                <input
                  type='text'
                  name='name'
                  value={newProduct.name}
                  onChange={handleInputChange}
                  className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                  required
                />
              </div>
              <div>
                <label className='block text-sm font-medium'>Purchase Price *</label>
                <input
                  type='number'
                  name='in_price'
                  value={newProduct.in_price}
                  onChange={handleInputChange}
                  step='0.01'
                  className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                  required
                />
              </div>
              <div>
                <label className='block text-sm font-medium'>Price *</label>
                <input
                  type='number'
                  name='price'
                  value={newProduct.price}
                  onChange={handleInputChange}
                  step='0.01'
                  className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                  required
                />
              </div>
              <div>
                <label className='block text-sm font-medium'>Unit *</label>
                <input
                  type='text'
                  name='unit'
                  value={newProduct.unit}
                  onChange={handleInputChange}
                  className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                  required
                />
              </div>
              <div>
                <label className='block text-sm font-medium'>In Stock *</label>
                <input
                  type='number'
                  name='in_stock'
                  value={newProduct.in_stock}
                  onChange={handleInputChange}
                  className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                  required
                />
              </div>
              <div>
                <label className='block text-sm font-medium'>Description</label>
                <textarea
                  name='description'
                  value={newProduct.description}
                  onChange={handleInputChange}
                  className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>
              <div className='flex justify-end gap-4'>
                <button
                  type='button'
                  onClick={() => setShowAddProduct(false)}
                  className='bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition'
                >
                  Add Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditProduct && editProduct && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white p-6 rounded-lg w-full max-w-md'>
            <h2 className='text-xl font-bold mb-4'>Edit Product</h2>
            <form onSubmit={handleSubmitEditProduct} className='flex flex-col gap-4'>
              <div>
                <label className='block text-sm font-medium'>Article No *</label>
                <input
                  type='text'
                  name='article_no'
                  value={editProduct.article_no}
                  onChange={(e) => handleInputChange(e, true)}
                  className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                  required
                />
              </div>
              <div>
                <label className='block text-sm font-medium'>Name *</label>
                <input
                  type='text'
                  name='name'
                  value={editProduct.name}
                  onChange={(e) => handleInputChange(e, true)}
                  className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                  required
                />
              </div>
              <div>
                <label className='block text-sm font-medium'>Purchase Price *</label>
                <input
                  type='number'
                  name='in_price'
                  value={editProduct.in_price}
                  onChange={(e) => handleInputChange(e, true)}
                  step='0.01'
                  className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                  required
                />
              </div>
              <div>
                <label className='block text-sm font-medium'>Price *</label>
                <input
                  type='number'
                  name='price'
                  value={editProduct.price}
                  onChange={(e) => handleInputChange(e, true)}
                  step='0.01'
                  className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                  required
                />
              </div>
              <div>
                <label className='block text-sm font-medium'>Unit *</label>
                <input
                  type='text'
                  name='unit'
                  value={editProduct.unit}
                  onChange={(e) => handleInputChange(e, true)}
                  className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                  required
                />
              </div>
              <div>
                <label className='block text-sm font-medium'>In Stock *</label>
                <input
                  type='number'
                  name='in_stock'
                  value={editProduct.in_stock}
                  onChange={(e) => handleInputChange(e, true)}
                  className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                  required
                />
              </div>
              <div>
                <label className='block text-sm font-medium'>Description</label>
                <textarea
                  name='description'
                  value={editProduct.description}
                  onChange={(e) => handleInputChange(e, true)}
                  className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>
              <div className='flex justify-end gap-4'>
                <button
                  type='button'
                  onClick={() => setShowEditProduct(false)}
                  className='bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition'
                >
                  Update Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default App