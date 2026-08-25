import React, { useContext, useState } from 'react'
import AuthLayout from '../../components/layouts/AuthLayout'
import { validateEmail } from '../../utils/helper';
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector';
import Input from '../../components/Inputs/Input';
import { Link, useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/userContext';
import uploadImage from '../../utils/uploadImage';

const SignUp = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { updateUser } = useContext(UserContext);

  const navigate = useNavigate();

  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();

    let profileImageUrl = "";

    if (!profilePic) {
      setError('Please upload a profile photo.');
      return;
    }

    if (!fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!password) {
      setError('Please enter a password.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      if (profilePic) {
        const imgUploadRes = await uploadImage(profilePic);
        profileImageUrl = imgUploadRes.imageUrl || "";
      }
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: fullName,
        email,
        password,
        profileImageUrl
      })

      const { token, role } = response.data;

      if (token) {
        localStorage.setItem('token', token);
        updateUser(response.data);

        if (role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/user/dashboard');
        }
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <div className='w-full max-w-md mx-auto md:mx-0 h-auto md:h-full flex flex-col justify-center py-10 md:py-0'>
        <h3 className='text-2xl font-display font-semibold text-ink-900'>Create an account</h3>
        <p className='text-[13px] text-ink-600 mt-1.5 mb-7'>
          Join us today by entering your details below.
        </p>

        <form onSubmit={handleSignUp} className='space-y-1'>
          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />

          <div className='space-y-1'>
            <Input
              value={fullName}
              onChange={({ target }) => setFullName(target.value)}
              label="Full Name"
              placeholder="Enter your full name"
              type="text"
            />

            <Input
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              label='Email Address'
              placeholder='Enter your email address'
              type='text'
            />

            <Input
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              label='Password'
              type='password'
              placeholder='Create a password'
            />
          </div>

          {error && (
            <p className='text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2 mt-3'>
              {error}
            </p>
          )}

          <button
            type='submit'
            disabled={isSubmitting}
            className='btn-primary cursor-pointer'
          >
            {isSubmitting ? 'Creating account…' : 'Sign Up'}
          </button>

          <p className='text-[13px] text-ink-600 text-center'>
            Already have an account?{' '}
            <Link
              className='font-medium text-brand-500 hover:text-brand-600 underline underline-offset-2'
              to='/login'
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  )
}

export default SignUp

