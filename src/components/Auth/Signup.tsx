import { FaEye } from "react-icons/fa6";
import { Link } from "react-router-dom";
import BrandCarousel from "../Home/Tools/BrandCarousel";

export default function SignupComponent() {
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
            Create an Account
          </h1>
          {/* First Name Input */}
          <input
            type="text"
            placeholder="Enter your first name"
            className="w-full p-3 pl-5 mb-4 border border-gray-300"
          />
          {/* Last Name Input */}
          <input
            type="text"
            placeholder="Enter your last name"
            className="w-full p-3 pl-5 mb-4 border border-gray-300"
          />
          {/* Email Input */}
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full p-3 pl-5 mb-4 border border-gray-300"
          />
          {/* Phone No Input */}
          <input
            type="tel"
            placeholder="Enter your phone number"
            className="w-full p-3 pl-5 mb-4 border border-gray-300"
          />
          {/* Password Input */}
          <div className="relative mb-4">
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full p-3 pl-5 border border-gray-300"
            />
            <span className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer">
              <FaEye />
            </span>
          </div>
          {/* Password Input */}
          <div className="relative mb-4">
            <input
              type="password"
              placeholder="Re-enter your password"
              className="w-full p-3 pl-5 border border-gray-300"
            />
            <span className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer">
              <FaEye />
            </span>
          </div>
          {/* Sign Up Button */}
          <button className="w-full bg-[#0c21c1] hover:bg-blue-700 text-white p-3 mt-5">
            Sign up
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
      <div className="bg-blue-800 w-full sm:w-1/2 flex flex-col justify-center items-center p-10">
        <p className="text-white  mb-6 text-center text-xl">
          Join the world's top
        </p>
        <p className="text-white text-xl mb-6 text-center">
          companies using Predict.if
        </p>
        <div className="flex items-center justify-center w-96">
          <div className="flex-grow border-t border-white"></div>
          <span className="mx-2 text-white">•</span>
          <div className="flex-grow border-t border-white"></div>
        </div>

        <BrandCarousel />
      </div>
    </div>
  );
}
