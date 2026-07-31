import React from 'react'
import { useState } from 'react'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa'

const Input = ({ value, onChange, label, placeholder, type }) => {
    const [showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    }
    return <div>
        <label className='text-[13px] text-slate-800'>{label}</label>

        <div className='input-box '>
            <input
                type={type == 'password' ? (showPassword ? 'text' : 'password') : type}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e)}
                className='w-full bg-transparent outline-none'
            />

            {type === "password" && (
                <>
                    {showPassword ? (
                        <FaRegEye
                            size={22}
                            className="w-full text-blue-600 cursor-pointer"
                            onClick={() => toggleShowPassword()}
                        />
                    ) : (
                        <FaRegEyeSlash
                            size={22}
                            className="w-full text-slate-400 cursor-pointer"
                            onClick={() => toggleShowPassword()}
                        />
                    )}
                </>
            )}

        </div>
    </div>

}

export default Input
