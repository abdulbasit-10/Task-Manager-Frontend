import React, { useState } from 'react'
import { LuChevronDown } from 'react-icons/lu'

const SelectDropdown = ({ options, onChange, value, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (option) => {
        onChange(option)
        setIsOpen(false)
    }

    return (
        <div className='relative w-full'>
            {/* Dropdown box */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full text-sm text-black outline-none  border border-slate-100 px-2.5 py-3 rounded-md mt-2 flex justify-between items-center relative "
            >
                {value ? options.find((opt) => opt.value === value)?.label : placeholder}
                <span className='ml-2
                '>{isOpen ? <LuChevronDown className='rotate-180' /> : <LuChevronDown />}</span>
            </button>

            {/* drop menu */}
            {isOpen && (
                <div className='absolute w-full bg-white border border-slate-100 mt-2 rounded-md shadow-md z-10'>
                    {options.map((option) => (
                        <div
                            key={option.value}
                            className='px-3 py-2 cursor-pointer hover:bg-gray-100'
                            onClick={() => handleSelect(option.value)}
                        >
                            {option.label}
                        </div>
                    ))}
                </div>
            )}

        </div>
    )
}

export default SelectDropdown