import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import useAuth from "../hooks/useAuth";
import { BeatLoader } from 'react-spinners'


const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const { login, register, setIsAuthenticated, getUser, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    password2: ""
  });

  const [errors, setErrors] = useState({
    full_name: "",
    email: "",
    password: "",
    password2: ""
  })
  const resetErrors = () => {
    setErrors({
      full_name: "",
      email: "",
      password: "",
      password2: ""
    });
  };

  // Redirect when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    resetErrors();
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };


  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true)
    try {
      if (isSignUp) {
        const { data, success } = await register(formData.full_name, formData.email, formData.password, formData.password2);
        if (success) {
          console.log(formData, 'This is the sign up form object')
          toast.success("Account created successfully");
          setIsSignUp(false);
        } else {
          console.log(formData, 'This is the sign up form object')
          setErrors((prevErrors) => ({
            ...prevErrors,
            ...data, // Spread the error messages returned by the backend
          }));
        }
      } else {
        const { data, success } = await login(formData.email, formData.password);
        if (success) {
          await getUser();
          setIsAuthenticated(true)
          toast.success("Logged in successfully");
          navigate('/')
        } else {
          toast.error(data.detail);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.detail || error.detail);
    }finally{
      setIsLoading(false)
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-3 items-start m-auto p-8 min-w-[340px] sm:min-w-96 border-none rounded-xl text-zinc-600 text-sm shadow-lg">
        <p className="text-2xl font-semibold">{isSignUp ? 'Create Account' : 'Login'}</p>
        <p>Please {isSignUp ? 'sign up' : 'login'} to book an appointment</p>
        {isSignUp && (
          <div className="w-full">
            <p>Full Name</p>
            <input
              className="border border-zinc-300 rounded w-full p-2 mt-1"
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleInputChange}
              required
            />
            <p className="text-red-800 text-sm">
              {errors.full_name}
            </p>
          </div>
        )}

        <div className="w-full">
          <p>Email</p>
          <input
            className="border border-zinc-300 rounded w-full p-2 mt-1"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          <p className="text-red-800 text-sm">
            {errors.email}
          </p>
        </div>

        <div className="w-full">
          <p>Password</p>
          <input
            className="border border-zinc-300 rounded w-full p-2 mt-1"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
          <p className="text-red-800 text-sm">
            {errors.password}
          </p>
        </div>
        {isSignUp &&
          <div className="w-full">
            <p>Confirm Password</p>
            <input
              className="border border-zinc-300 rounded w-full p-2 mt-1"
              type="password"
              name="password2"
              value={formData.password2}
              onChange={handleInputChange}
              required
            />
            <p className="text-red-800 text-sm">
              {errors.password}
            </p>
          </div>
        }
        <button
          type="submit"
          className="bg-primary text-white w-full py-2 rounded-md text-base hover:scale-105 transition-all duration-300"
        >
          {isLoading
            ? <BeatLoader size={10} color="#ffffff" />
            : <p>{isSignUp ? 'Create Account' : 'Login'}</p>
          }
        </button>
        {isSignUp ? (
          <p>
            Already have an account?{' '}
            <span
              onClick={() => setIsSignUp(false)}
              className="text-primary underline cursor-pointer"
            >
              Login here
            </span>
          </p>
        ) : (
          <p>
            Create a new account?{' '}
            <span
              onClick={() => setIsSignUp(true)}
              className="text-primary underline cursor-pointer"
            >
              Click here
            </span>
          </p>
        )}
        {!isSignUp && (
          <p onClick={() => navigate('/password-reset')} className='text-primary text-sm underline hover:cursor-pointer'>
            Did you forget your password?
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;
