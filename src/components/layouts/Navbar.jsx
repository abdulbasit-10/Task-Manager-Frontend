import React, { useState } from 'react'
import { FaBars, FaTimes } from 'react-icons/fa'
import SideMenu from './SideMenu'

const Navbar = ({ activeMenu }) => {

    const [openSideMenu, setOpenSideMenu] = useState(false);
    return (
        <div className='flex gap-5 bg-white border border-b border-gray-200/50 backdrop-blur-[2px] px-7 py-4 sticky top-0 z-50'>
            <button
                className='block lg:hidden text-black'
                onClick={() => {
                    setOpenSideMenu(!openSideMenu)
                }}
            >
                {
                    openSideMenu ? (
                        <FaTimes size={22} />
                    ) : (
                        <FaBars size={22} />
                    )
                }
            </button>

            <h2 className='text-lg font-medium text-black'>Task Manager</h2>

            {
                openSideMenu && (
                    <div className='fixed top-[61px] -ml-4 bg-white'>
                        <SideMenu activeMenu={activeMenu} />
                    </div>
                )
            }
        </div>
    )
}

export default Navbar
