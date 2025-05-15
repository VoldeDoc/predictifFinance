import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { Link } from "react-router-dom";
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, SubmitHandler } from 'react-hook-form';
import UserAuthentication from "@/hooks/UseAuth";
import { toast } from "react-toastify";
import { Signup } from "@/types";

const schema = Yup.object({
  first_name: Yup.string()
    .required('First name is required'),
  last_name: Yup.string()
    .required('Last name is required'),
  other_name: Yup.string()
    .required('Other name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string().required('Phone number is required'),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters'),
  password_confirmation: Yup.string()
    .oneOf([Yup.ref('password'), undefined], 'Passwords must match')
    .required('Password confirmation is required'),
  username: Yup.string()
    .required('Username is required')
});

export default function SignupComponent() {
  const { UserSignup, loading } = UserAuthentication();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onBlur',
  });

  const onSubmit: SubmitHandler<Signup> = async (data) => {
    toast.promise(
      UserSignup(data),
      {
        pending: "Creating account...",
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
  
  return (
    <div className="min-h-screen flex flex-col sm:flex-row">
      {/* Left Section (Form) */}
      <form onSubmit={handleSubmit(onSubmit)} className="w-full sm:w-1/2">
        <div className="bg-gray-100 w-full flex flex-col justify-center items-center p-10 min-h-screen">
          <div className="w-full max-w-md">
            {/* Logo */}
            <img
              src="/assets/images/logo.png"
              alt="Predict.if Logo"
              className="w-60 mx-auto mb-20"
            />
            {/* Welcome Text */}
            <h1 className="text-4xl font-semibold text-center mb-10">
              Create an Account
            </h1>
            
            {/* First Name Input */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Enter your first name"
                className={`w-full p-3 pl-5 border ${errors.first_name ? 'border-red-500' : touchedFields.first_name ? 'border-green-500' : 'border-gray-300'}`}
                {...register('first_name')}
              />
              {errors.first_name && (
                <p className="text-red-500 text-sm mt-1">{errors.first_name.message}</p>
              )}
            </div>

            {/* Last Name Input */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Enter your last name"
                className={`w-full p-3 pl-5 border ${errors.last_name ? 'border-red-500' : touchedFields.last_name ? 'border-green-500' : 'border-gray-300'}`}
                {...register('last_name')}
              />
              {errors.last_name && (
                <p className="text-red-500 text-sm mt-1">{errors.last_name.message}</p>
              )}
            </div>

            {/* Other Name Input */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Enter your other name"
                className={`w-full p-3 pl-5 border ${errors.other_name ? 'border-red-500' : touchedFields.other_name ? 'border-green-500' : 'border-gray-300'}`}
                {...register('other_name')}
              />
              {errors.other_name && (
                <p className="text-red-500 text-sm mt-1">{errors.other_name.message}</p>
              )}
            </div>

            {/* Username Input */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Enter your username"
                className={`w-full p-3 pl-5 border ${errors.username ? 'border-red-500' : touchedFields.username ? 'border-green-500' : 'border-gray-300'}`}
                {...register('username')}
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
              )}
            </div>

            {/* Email Input */}
            <div className="mb-4">
              <input
                type="email"
                placeholder="Enter your email"
                className={`w-full p-3 pl-5 border ${errors.email ? 'border-red-500' : touchedFields.email ? 'border-green-500' : 'border-gray-300'}`}
                {...register('email')}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>
            
            {/* Phone No Input */}
            <div className="mb-4">
              <input
                type="tel"
                placeholder="Enter your phone number"
                className={`w-full p-3 pl-5 border ${errors.phone ? 'border-red-500' : touchedFields.phone ? 'border-green-500' : 'border-gray-300'}`}
                {...register('phone')}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
              )}
            </div>
            
            {/* Password Input */}
            <div className="relative mb-4">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className={`w-full p-3 pl-5 border ${errors.password ? 'border-red-500' : touchedFields.password ? 'border-green-500' : 'border-gray-300'}`}
                {...register('password')}
              />
              <span 
                className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>
            
            {/* Password Confirmation Input */}
            <div className="relative mb-4">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Re-enter your password"
                className={`w-full p-3 pl-5 border ${errors.password_confirmation ? 'border-red-500' : touchedFields.password_confirmation ? 'border-green-500' : 'border-gray-300'}`}
                {...register('password_confirmation')}
              />
              <span 
                className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
              {errors.password_confirmation && (
                <p className="text-red-500 text-sm mt-1">{errors.password_confirmation.message}</p>
              )}
            </div>
            
            {/* Sign Up Button */}
            <button 
              type="submit"
              className="w-full bg-[#0c21c1] hover:bg-blue-700 text-white p-3 mt-5"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Sign up"}
            </button>
            
            {/* Sign In Link */}
            <p className="mt-4 text-center">
              Have a Predict.if account?{" "}
              <Link to="/auth/signin" className="text-blue-900 font-bold">
                Sign in
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
      </form>
      
      {/* Right Section */}
     <div className="hidden sm:flex bg-blue-500 sm:w-1/2 flex-col justify-center items-center p-10">
        <img src="/assets/images/auth/ip.png" alt="" className="w-56"/>
      </div>
    </div>
  );
}