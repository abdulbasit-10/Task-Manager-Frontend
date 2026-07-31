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
  const [adminInviteToken, setAdminInviteToken] = useState("");

  const { updateUser } = useContext(UserContext);

  const navigate = useNavigate();

  const [error, setError] = useState(null);

  const handleSignUp = async (e) => {
    e.preventDefault();

    // console.log(fullName, email, password, adminInviteToken);

    let profileImageUrl = "";

    if (!fullName) {
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

    // Perform sign-up logic here
    try {
      // upload profile image if exists
      if (profilePic) {
        const imgUploadRes = await uploadImage(profilePic);
        profileImageUrl = imgUploadRes.imageUrl || "";
      }
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: fullName,
        email,
        password,
        adminInviteToken,
        profileImageUrl
      })

      const { token, role } = response.data;

      if (token) {
        localStorage.setItem('token', token);
        updateUser(response.data);

        // redirect based on role
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
    }
  };

  return (
    <AuthLayout>
      <div className='lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center'>
        <h3 className='text-xl font-semibold text-black'>Create an Account</h3>
        <p className='text-xs text-slate-700 mt-[5px] mb-6'>
          Join us today by entering your details below.
        </p>

        <form onSubmit={handleSignUp}>
          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <Input
              value={fullName}
              onChange={({ target }) => setFullName(target.value)}
              label="Full Name"
              placeholder="Jhon"
              type="text"
            />

            <Input
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              label='Email Address'
              placeholder='munim@example.com'
              type='text'
            />
            <Input
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              label='Password'
              type='password'
              placeholder='Password'
            />

            <Input
              value={adminInviteToken}
              onChange={({ target }) => setAdminInviteToken(target.value)}
              label='Admin Invite Token'
              type='text'
              placeholder='6 digit token'
            />
          </div>

          {error && <p className='text-xs text-red-600'>{error}</p>}

          <button
            type='submit'
            className='btn-primary'
          >
            Sign Up
          </button>

          <p className=''>
            Already have an account?
            <Link
              className='font-medium text-blue-600 underline'
              to='/login'
            >
              Login
            </Link>
          </p>


        </form>
      </div>
    </AuthLayout >
  )
}

export default SignUp
