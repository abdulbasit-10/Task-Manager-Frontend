import React from 'react'

const AuthLayout = ({ children }) => {
    return <div className='flex'>
        <div className='w-screen h-screen md:w-[60vw] px-12 pt-8 pb-12'>
            <h2 className='text-lg font-medium text-black'>Task Manager</h2>
            {children}
        </div>

        <div className='hidden md:flex w-[40vw] h-screen items-center justify-center bg-blue-50 bg-[url("https://images.unsplash.com/photo-1522071820081-009f5f82d42a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80") bg-cover bg-no-repeat bg-center overflow-hidden p-8'>
            <img src='' className='w-64 lg:w-[90%]' />
        </div>
    </div>
}

export default AuthLayout
