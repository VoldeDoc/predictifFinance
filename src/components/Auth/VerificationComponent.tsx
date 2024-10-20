import { Link } from "react-router-dom";
import BrandCarousel from "../Home/tools/BrandCarousel";

export default function VerificationComponent() {
  return (
    <div className="min-h-screen flex flex-col sm:flex-row">
      {/* Left Section (Form) */}
      <div className="bg-gray-100 w-full sm:w-1/2 flex flex-col justify-center items-center p-10">
        <div className="w-full max-w-md">
          {/* Logo */}
          <img
            src="/img/logo.png"
            alt="Predict.if Logo"
            className="w-60 mx-auto mb-24"
          />
          {/* Welcome Text */}
          <h1 className="text-4xl font-semibold text-center mb-2">
            Verify your email
          </h1>
          <p className="text-center text-gray-500 mb-8 text-sm">
            We have sent a code to{" "}
            <span className="font-bold">email@dot.com</span>
          </p>
          {/* OTP Input */}
          <input
            type="number"
            placeholder="Enter your OTP"
            className="w-full p-3 pl-5 mb-4 border border-gray-300"
          />
          <div className="flex justify-center mb-4">
            <p className="text-blue-800 me-3">(2:39)</p>
            <span className="text-gray-500">
              Didn't receive the code?{" "}
              <Link to="#" className="text-blue-900 font-bold">
                Resend
              </Link>
            </span>
          </div>
          {/* Sign Up Button */}
          <button className="w-full bg-[#0c21c1] hover:bg-blue-700 text-white p-3 mt-5">
            Create Account
          </button>
        </div>
        {/* Privacy and Terms */}
        <div className="mt-24 text-center text-sm text-gray-500">
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

      <div className="bg-[#0c21c1] w-full sm:w-1/2 flex flex-col justify-center items-center p-10">
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
