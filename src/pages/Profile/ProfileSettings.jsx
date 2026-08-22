import React, { useContext, useEffect, useState } from 'react'
import { LuArrowLeft, LuKeyRound } from 'react-icons/lu'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector'
import Input from '../../components/Inputs/Input'
import { UserContext } from '../../context/userContext'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import uploadImage from '../../utils/uploadImage'
import { validateEmail } from '../../utils/helper'

const ProfileSettings = () => {
    const { user, updateUser } = useContext(UserContext);
    const navigate = useNavigate();

    const [profilePic, setProfilePic] = useState(null);
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const [error, setError] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    useEffect(() => {
        if (user) {
            setFullName(user.name || "");
            setEmail(user.email || "");
        }
    }, [user]);

    const handleSaveProfile = async (e) => {
        e.preventDefault();

        if (!fullName) {
            setError('Please enter your full name.');
            return;
        }
        if (!validateEmail(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        setError(null);
        setIsSaving(true);

        try {
            let profileImageUrl = user?.profileImageUrl || "";

            if (profilePic) {
                const imgUploadRes = await uploadImage(profilePic);
                profileImageUrl = imgUploadRes.imageUrl || profileImageUrl;
            }

            const response = await axiosInstance.put(API_PATHS.AUTH.UPDATE_PROFILE, {
                name: fullName,
                email,
                profileImageUrl,
            });

            updateUser(response.data);
            toast.success('Profile updated successfully.');
        } catch (error) {
            if (error.response && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError('Something went wrong. Please try again.');
            }
        } finally {
            setIsSaving(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (!newPassword || newPassword.length < 6) {
            setError('New password must be at least 6 characters.');
            return;
        }

        setError(null);
        setIsChangingPassword(true);

        try {
            const response = await axiosInstance.put(API_PATHS.AUTH.UPDATE_PROFILE, {
                password: newPassword,
            });

            updateUser(response.data);
            setNewPassword("");
            toast.success('Password updated successfully.');
        } catch (error) {
            if (error.response && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError('Something went wrong. Please try again.');
            }
        } finally {
            setIsChangingPassword(false);
        }
    };

    return (
        <div className='min-h-screen bg-[#F6F7FB] font-body'>
            <div className='max-w-2xl mx-auto px-4 sm:px-6 py-10'>
                <button
                    type='button'
                    onClick={() => navigate(-1)}
                    className='flex items-center gap-1.5 text-[13px] font-medium text-ink-600 hover:text-brand-500 mb-6 cursor-pointer'
                >
                    <LuArrowLeft size={15} />
                    Back
                </button>

                <h2 className='text-2xl font-display font-semibold text-ink-900'>Profile Settings</h2>
                <p className='text-[13px] text-ink-600 mt-1.5 mb-8'>
                    Manage your personal information and password.
                </p>

                {error && (
                    <p className='text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-6'>
                        {error}
                    </p>
                )}

                <form onSubmit={handleSaveProfile} className='card mb-6'>
                    <ProfilePhotoSelector
                        image={profilePic}
                        setImage={setProfilePic}
                        existingImageUrl={user?.profileImageUrl}
                    />

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-x-4'>
                        <Input
                            value={fullName}
                            onChange={({ target }) => setFullName(target.value)}
                            label='Full Name'
                            placeholder='Your name'
                            type='text'
                        />
                        <Input
                            value={email}
                            onChange={({ target }) => setEmail(target.value)}
                            label='Email Address'
                            placeholder='you@example.com'
                            type='text'
                        />
                    </div>

                    <button type='submit' disabled={isSaving} className='btn-primary cursor-pointer mt-2'>
                        {isSaving ? 'Saving…' : 'Save Changes'}
                    </button>
                </form>

                <form onSubmit={handleChangePassword} className='card'>
                    <div className='flex items-center gap-2 mb-1'>
                        <LuKeyRound size={16} className='text-brand-500' />
                        <h3 className='text-sm font-display font-semibold text-ink-900'>Change Password</h3>
                    </div>
                    <p className='text-[12.5px] text-ink-600 mb-1'>
                        Leave this blank if you don&apos;t want to change your password.
                    </p>

                    <Input
                        value={newPassword}
                        onChange={({ target }) => setNewPassword(target.value)}
                        label='New Password'
                        type='password'
                        placeholder='At least 6 characters'
                    />

                    <button type='submit' disabled={isChangingPassword} className='btn-primary cursor-pointer mt-2'>
                        {isChangingPassword ? 'Updating…' : 'Update Password'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default ProfileSettings
