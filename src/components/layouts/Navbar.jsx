import React, { useContext, useState } from 'react'
import { FaBars, FaTimes } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import SideMenu from './SideMenu'
import { UserContext } from '../../context/userContext'

const Navbar = ({ activeMenu }) => {

    const [openSideMenu, setOpenSideMenu] = useState(false);
    const { user } = useContext(UserContext);

    const initials = user?.name
        ? user.name.trim().split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase()
        : '';

    return (
        <div className='flex items-center justify-between gap-5 bg-white border border-b border-gray-200/50 backdrop-blur-[2px] px-7 py-4 sticky top-0 z-50'>
            <div className='flex items-center gap-5'>
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

                <div className='flex items-center gap-2'>
                    <span className='w-7 h-7 rounded-lg bg-brand-500 flex items-center justify-center'>
                        <span className='w-2 h-2 rounded-[2px] bg-white' />
                    </span>
                    <h2 className='text-lg font-display font-semibold text-ink-900'>Task Manager</h2>
                </div>

                {
                    openSideMenu && (
                        <div className='fixed top-[61px] -ml-4 bg-white'>
                            <SideMenu activeMenu={activeMenu} />
                        </div>
                    )
                }
            </div>

            <Link
                to='/profile'
                className='shrink-0 w-9 h-9 rounded-full overflow-hidden border border-line-200 hover:border-brand-300 transition-colors flex items-center justify-center bg-brand-50'
                title='Profile Settings'
            >
                {user?.profileImageUrl ? (
                    <img
                        src={user.profileImageUrl}
                        alt={user?.name || 'Profile'}
                        className='w-full h-full object-cover'
                    />
                ) : (
                    <span className='text-[12px] font-semibold text-brand-600'>
                        {initials || '?'}
                    </span>
                )}
            </Link>
        </div>
    )
}

export default Navbar
