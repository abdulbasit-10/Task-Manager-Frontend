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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { updateUser } = useContext(UserContext);

  const navigate = useNavigate();

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
    setIsSubmitting(true);

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password
      });

      const { token, role } = response.data;

      if (token) {
        localStorage.setItem('token', token);
        updateUser(response.data);

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
    } finally {
      setIsSubmitting(false);
    }
  };

  return <AuthLayout>
    <div className='lg:w-[76%] h-3/4 md:h-full flex flex-col justify-center'>
      <h3 className='text-2xl font-display font-semibold text-ink-900 mt-10'>Welcome back</h3>
      <p className='text-[13px] text-ink-600 mt-1.5 mb-8'>
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

        {error && (
          <p className='text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2 mt-1'>
            {error}
          </p>
        )}

        <button
          type='submit'
          disabled={isSubmitting}
          className='btn-primary cursor-pointer'
        >
          {isSubmitting ? 'Logging in…' : 'Login'}
        </button>

        <div className='mt-2'>
          <p className='text-[13px] text-ink-600'>
            Don&apos;t have an account?{' '}
            <Link
              className='font-medium text-brand-500 hover:text-brand-600 underline underline-offset-2'
              to='/signUp'
            >
              Sign Up
            </Link>
          </p>

          <p className='text-[13px] font-medium text-brand-500 hover:text-brand-600 underline underline-offset-2 mt-2 cursor-pointer w-fit'>
            Contact Admin
          </p>
        </div>
      </form>
    </div>
  </AuthLayout>

}

export default Login
