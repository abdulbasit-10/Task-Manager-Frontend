import React from 'react'
import { useState } from 'react'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa'

const Input = ({ value, onChange, label, placeholder, type }) => {
    const [showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    }

    return (
        <div>
            <label className='text-[13px] font-medium text-ink-600'>{label}</label>

            <div className='input-box'>
                <input
                    type={type == 'password' ? (showPassword ? 'text' : 'password') : type}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e)}
                    className='w-full bg-transparent outline-none text-ink-900 placeholder:text-ink-300'
                />

                {type === "password" && (
                    <button
                        type='button'
                        onClick={toggleShowPassword}
                        className='shrink-0 cursor-pointer'
                        tabIndex={-1}
                    >
                        {showPassword ? (
                            <FaRegEye size={18} className="text-brand-500" />
                        ) : (
                            <FaRegEyeSlash size={18} className="text-ink-300" />
                        )}
                    </button>
                )}
            </div>
        </div>
    )
}

export default Input

