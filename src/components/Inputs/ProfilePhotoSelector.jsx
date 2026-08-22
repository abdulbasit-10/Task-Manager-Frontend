import React, { useRef, useState } from 'react'
import { LuUser, LuUpload, LuTrash } from 'react-icons/lu'

const ProfilePhotoSelector = ({ image, setImage, existingImageUrl }) => {
    const inputRef = useRef(null);
    const [previewUrl, setPreviewUrl] = useState(existingImageUrl || null);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImage(file);
            const preview = URL.createObjectURL(file);
            setPreviewUrl(preview);
        }
    };

    const handleRemoveImage = () => {
        setImage(null);
        setPreviewUrl(null);
    };

    const onChooseFile = () => {
        inputRef.current.click();
    }

    return (
        <div className='flex justify-center mb-6'>
            <input
                type='file'
                accept='image/*'
                ref={inputRef}
                onChange={handleImageChange}
                className='hidden'
            />

            {!previewUrl ? (
                <div className='w-20 h-20 flex justify-center items-center bg-brand-50 rounded-full relative border border-brand-100'>
                    <LuUser className='text-4xl text-brand-500' />
                    <button
                        type='button'
                        className="w-8 h-8 flex justify-center items-center bg-brand-500 hover:bg-brand-600 rounded-full absolute -bottom-1 -right-1 text-white cursor-pointer transition-colors"
                        onClick={onChooseFile}>
                        <LuUpload size={14} />
                    </button>
                </div>
            ) : (
                <div className='relative'>
                    <img
                        src={previewUrl}
                        alt='Profile'
                        className='w-20 h-20 rounded-full object-cover border border-line-200'
                    />
                    <button
                        type='button'
                        className="w-8 h-8 flex justify-center items-center bg-brand-500 hover:bg-brand-600 rounded-full absolute -bottom-1 -right-1 text-white cursor-pointer transition-colors"
                        onClick={onChooseFile}>
                        <LuUpload size={14} />
                    </button>
                    <button
                        type='button'
                        className="w-8 h-8 flex justify-center items-center bg-red-500 hover:bg-red-600 rounded-full absolute -bottom-1 -left-1 text-white cursor-pointer transition-colors"
                        onClick={handleRemoveImage}>
                        <LuTrash size={14} />
                    </button>
                </div>
            )}
        </div>
    )
}

export default ProfilePhotoSelector
