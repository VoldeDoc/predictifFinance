import { FaEye } from "react-icons/fa6";
import { Link } from "react-router-dom";
import BrandCarousel from "../Home/tools/BrandCarousel";

export default function LoginComponent() {
  return (
    <div className="min-h-screen flex flex-col sm:flex-row">
      {/* Left Section (Form) */}
      <div className="bg-gray-100 w-full sm:w-1/2 flex flex-col justify-center items-center p-10">
        <div className="w-full max-w-md">
          {/* Logo */}
          <img
            src="/img/logo.png"
            alt="Predict.if Logo"
            className="w-60 mx-auto mb-20"
          />
          {/* Welcome Text */}
          <h1 className="text-4xl font-semibold text-center mb-10">
            Welcome back!
          </h1>
          {/* Email Input */}
          <input
            type="email"
            placeholder="Enter your email"
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
          {/* Forgot Password */}
          <div className="flex justify-end mb-4">
            <Link to="#" className="text-blue-900 font-bold">
              Forgot your password?
            </Link>
          </div>
          {/* Sign In Button */}
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 mt-5">
            Sign in
          </button>
          {/* Sign Up Link */}
          <p className="mt-4 text-center">
            Don't have a Predict.if account?{" "}
            <Link to="/signup" className="text-blue-900 font-bold">
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

      <div className="bg-blue-500 w-full sm:w-1/2 flex flex-col justify-center items-center p-10">
        <p className="text-white text-lg mb-6 text-center">
          Join the world's top companies using Predict.if
        </p>
        <hr className="border border-white w-96" />
        <div className="w-full text-white text-3xl font-bold">
          <BrandCarousel />
        </div>
      </div>
    </div>
  );
}
