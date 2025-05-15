import {
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
  } from '@headlessui/react'


  


  const Header = ({ selected, onChange }) => {
    return (
      <div className='flex flex-row justify-between items-center bg-blue-500 w-screen h-24 text-white p-4'>
        <div className='flex flex-row items-center justify-center ml-32'>
          <img src="/account.png" alt="Logo" className='w-16 h-16 mr-4' />
          <div>
            <h1 className='text-2xl font-bold mb-1'>Monishwar</h1>
            <p className='text-sm ml-1'>India</p>
          </div>
        </div>
  
        <div className="mr-32 w-32">
          <Listbox value={selected} onChange={onChange}>
            <div className="relative">
              <ListboxButton className="w-full flex items-center justify-between bg-blue-500 text-white px-4 py-2 rounded-md">
                <img src={selected.icon} className="w-4 h-4 mr-2" />
                {selected.name}
              </ListboxButton>
              <ListboxOptions className="absolute mt-1 w-full bg-white text-black border rounded-md shadow-lg z-10">
                {[
                  { name: 'English', value: 'en', icon: '/GB.png' },
                  { name: 'Swedish', value: 'sv', icon: '/SE.png' },
                ].map((lang) => (
                  <ListboxOption
                    key={lang.value}
                    value={lang}
                    className="cursor-pointer flex items-center px-4 py-2 hover:bg-blue-100"
                  >
                    <img src={lang.icon} className="w-4 h-4 mr-2" />
                    {lang.name}
                  </ListboxOption>
                ))}
              </ListboxOptions>
            </div>
          </Listbox>
        </div>
      </div>
    )
  }
  
  export default Header
  