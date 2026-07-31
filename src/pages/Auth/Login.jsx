import { useContext, useState } from 'react'
import AuthLayout from '../../components/layouts/AuthLayout'
import { Link, useNavigate } from 'react-router-dom'
import Input from '../../components/Inputs/Input';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/userContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const { updateUser } = useContext(UserContext);

  const navigate = useNavigate();

  // Handle login form submit
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!password) {
      setError('Please enter a password.');
      return;
    }

    setError(null);

    // Perform login logic here
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password
      });

      const { token, role } = response.data;

      if (token) {
        localStorage.setItem('token', token);
        updateUser(response.data);

        // redirect based on role
        if (role === 'admin') {
          navigate("/admin/dashboard");
        } else {
          navigate("/user/dashboard");
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

  return <AuthLayout>
    <div className='lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center'>
      <h3 className='text-xl font-semibold text-black'>Welcome Back</h3>
      <p className='text-xs text-slate-700 mt-[5px] mb-6'>
        Please enter your details to login
      </p>

      <form onSubmit={handleLogin}>
        <Input
          value={email}
          onChange={({ target }) => setEmail(target.value)}
          label='Email Address'
          placeholder='munim@example.com'
          type='text'
        />
        <Input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          label='Password'
          type='password'
          placeholder='Password'
        />

        {error && <p className='text-xs text-red-600'>{error}</p>}

        <button
          type='submit'
          className='btn-primary cursor-pointer'
        >
          Login
        </button>

        <div className='mt-3'>
          <p className='text-[13px] text-slate-800'>
            Don&apos;t have an account?{' '}
            <Link
              className='font-medium text-blue-600 underline'
              to='/signUp'
            >
              Sign Up
            </Link>
          </p>

          <p className='font-medium text-blue-600 underline'>Contact Admin</p>
        </div>
      </form>
    </div>
  </AuthLayout>

}

export default Login
