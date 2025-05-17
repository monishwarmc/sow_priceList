import React from 'react'

const menuIcons = [
    "/Menu.png", "/Invoices.png", "/Customer register.png", "/My Business.png",
    "/Invoice Journal.png", "/Price List.png", "/Multiple Invoicing.png",
    "/Unpaid Invoices.png", "/Offer.png", "/Inventory Control.png",
    "/Member Invoicing.png", "/Import and Export.png", "/Support.png", "/Log Out.png"
  ];
  
const Navbar = ({ menuNames }) => {
    return (
        <div className='z-10 pt-2 w-60 h-screen mt-24 fixed border-r-8 flex flex-col items-center'>
        <h1 className='text-2xl font-bold mb-2'>{menuNames[0] || 'Menu'}</h1>
        <hr className='border-2 border-blue-600 mb-4 rounded w-48 ' />
        <div className='flex flex-col items-center'>
            {menuNames.slice(1).map((name, index) => (
                <div key={index + 1} className={`rounded-2xl flex flex-row items-center justify-start w-full h-12 px-4 hover:bg-blue-100 cursor-pointer
                ${index === 4 ? 'bg-blue-200' : ''}`}>
                    <img src={menuIcons[index + 1]} alt={name} className='w-6 h-6 mr-2' />
                    <p className='text-lg'>{name}</p>
                </div>
            ))}
        </div>
        </div>
    )
}

export default Navbar
  