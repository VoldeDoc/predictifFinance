import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { Link } from "react-router-dom";
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, SubmitHandler } from 'react-hook-form';
import UserAuthentication from "@/hooks/UseAuth";
import { toast } from "react-toastify";

export default function SigninComponent() {
  const { Login, loading } = UserAuthentication();
  const [showPassword, setShowPassword] = useState(false);
  
  const schema = Yup.object({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onBlur',
  });

  const onSubmit: SubmitHandler<{ email: string; password: string }> = async (data) => {
    toast.promise(
      Login(data),
      {
        pending: "Logging in...",
        success: {
          render({ data }) {
            return <div>{data as string}</div>
          }
        },
        error: {
          render({ data }) {
            return <div>{data as string}</div>
          }
        }
      },
    )
  }
  
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  
  return (
    <div className="min-h-screen flex flex-col sm:flex-row">
      {/* Left Section (Form) */}
      <div className="bg-gray-100 w-full sm:w-1/2 flex flex-col justify-center items-center p-10">
        <div className="w-full max-w-md">
          {/* Logo */}
          <img
            src="/assets/images/logo.png"
            alt="Predict.if Logo"
            className="w-60 mx-auto mb-20"
          />

          {/* Welcome Text */}
          <h1 className="text-4xl font-semibold text-center mb-10">
            Welcome back!
          </h1>
          
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Email Input */}
            <div className="mb-4">
              <input
                {...register('email')}
                type="email"
                placeholder="Enter your email"
                className={`w-full p-3 pl-5 border ${
                  errors.email && touchedFields.email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.email && touchedFields.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email?.message}</p>
              )}
            </div>
            
            {/* Password Input */}
            <div className="relative mb-4">
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                className={`w-full p-3 pl-5 border ${
                  errors.password && touchedFields.password ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <button 
                type="button"
                className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              {errors.password && touchedFields.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password?.message}</p>
              )}
            </div>
            
            {/* Forgot Password */}
            <div className="flex justify-end mb-4">
              <Link
                to="/auth/forget-pwd"
                className="text-blue-900 font-bold"
              >
                Forgot your password?
              </Link>
            </div>
            
            {/* Sign In Button */}
            <button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 mt-5"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
          
          {/* Sign Up Link */}
          <p className="mt-4 text-center">
            Don't have a Predict.if account?{" "}
            <Link to="/auth/signup" className="text-blue-900 font-bold">
              Sign up
            </Link>
          </p>
        </div>
        
        {/* Privacy and Terms */}
        <div className="mt-8 text-center text-sm text-gray-500">
          This site is protected by reCAPTCHA and the Google
          <Link to="#" className="text-blue-600">
            {" "}
            Privacy Policy{" "}
          </Link>{" "}
          and
          <Link to="#" className="text-blue-600">
            {" "}
            Terms of Service
          </Link>
          .
        </div>
      </div>

      {/* Right Section (Brand Carousel) */}
      <div className="hidden sm:flex bg-blue-500 sm:w-1/2 flex-col justify-center items-center p-10">
        <img src="/assets/images/auth/ip1.png" alt="" className="w-56"/>
      </div>
    </div>
  );
}