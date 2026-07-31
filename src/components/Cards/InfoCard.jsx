import React from 'react'

const InfoCard = ({ icon, label, value, color }) => {
    return (
        <div className='flex items-center gap-3'>
            <div className={`w-2 md:w-3 h-2 md:h-3 ${color} rounded-full`}>
            </div>
            <p className='text-xs md:text-[14px] text-gray-500'>
                <span className='text-sm md:text-[15px] text-black font-semibold'>{value}</span> {label}
            </p>
        </div>
    )
}

export default InfoCard
