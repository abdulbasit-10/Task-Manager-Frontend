import React from 'react'

const Progresss = ({ progress, status }) => {
    const getColor = () => {
        switch (status) {
            case "In Progress":
                return "text-cyan-500 bg-cyan-50 border border-cyan-500/10";

            case "Completed":
                return "text-lime-500 bg-lime-50 border border-cyan-200";

            default:
                return "text-gray-500 bg-gray-50 border border-gray-500/10";
        }
    }
    return (
        <div className='w-full bg-gray-200 rounded-full h-1.5'>
            <div className={`${getColor()} h-1.5 rounded-full text-center text-xs font-medium`} style={{ width: `${progress}%` }}>

            </div>
        </div>
    )
}

export default Progresss
