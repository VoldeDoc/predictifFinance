import React, { useState, useRef, useEffect } from "react";
import Button from "../Ui/Button";
import { logo, otp_verification } from "../../../public";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { AppDispatch } from "@/context/store";
import { useDispatch } from "react-redux";
import { setToken, setUser } from "./store";
import UserAuthentication from "@/hooks/UseAuth";

const OtpVerification = () => {
  const { ResendOtp, VerifyOtp } = UserAuthentication()
  const dispatch = useDispatch<AppDispatch>();
  const router = useNavigate();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [isInvalid, setIsInvalid] = useState(false);
  const [fadeOut, setFadeOut] = useState([false, false, false, false]);
  const [timeLeft, setTimeLeft] = useState(120);
  const [canResend, setCanResend] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);

  const email = location.state?.email;
 

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  // Automatically focus the first input on component mount
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.focus();
    }
  }, []);

  // Handle key press for the entire OTP container
  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.preventDefault();

    const key = e.key;

    // Handle digit input
    if (/^\d$/.test(key)) {
      const newOtp = [...otp];

      // Find the first empty slot or the current active one
      let targetIndex = otp.findIndex(val => val === '');
      // Use active index if no empty slot found or ensure we use valid index 
      if (targetIndex === -1) targetIndex = Math.min(activeIndex, 3);

      newOtp[targetIndex] = key;
      setOtp(newOtp);

      // Move to next input if not at the last one
      if (targetIndex < 3) {
        setActiveIndex(targetIndex + 1);
      }
    }
    // Handle backspace
    else if (key === 'Backspace') {
      const newOtp = [...otp];

      // If current position has a value, clear it
      if (newOtp[activeIndex]) {
        newOtp[activeIndex] = '';
      }
      // Otherwise move to previous position and clear it
      else if (activeIndex > 0) {
        const newIndex = activeIndex - 1;
        newOtp[newIndex] = '';
        setActiveIndex(newIndex);
      }

      setOtp(newOtp);
    }
    // Add arrow key navigation
    else if (key === 'ArrowRight' && activeIndex < 3) {
      setActiveIndex(activeIndex + 1);
    }
    else if (key === 'ArrowLeft' && activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
  };

  // Visual indicator for which box is active
  const getInputClass = (index: number, value: string) => {
    return `w-12 h-12 text-center text-xl border rounded-md transition-all duration-150 flex items-center justify-center
      ${value ? "border-primary focus:ring-secondary ring-2 focus:ring-2" : "border-gray-300"}
      ${index === activeIndex ? "ring-2 ring-primary" : ""}
      ${fadeOut[index] ? "opacity-0 transition-opacity duration-300" : ""}`;
  };

  const handleSubmit = async () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length !== 4) {
      toast.error("Please enter all 4 digits");
      return;
    }

    if (!email) {
      toast.error("Email is not provided. Please try again.");
      return;
    }

    try {
      const response = await VerifyOtp({ email: email, otp: enteredOtp });
      const token = response.data.token;
      const user = response.data.user;
      setIsInvalid(false);
      dispatch(setToken(token));
      dispatch(setUser(user));
      router("/survey");
      toast.success("OTP verified successfully! Fill Survey to continue");
    } catch (error: any) {
      if (error.response?.data?.message) {
        toast.error(error.response?.data?.message);
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
      // Clear OTP inputs and show the invalid animation
      handleError();
    }
  };
const handleResend = async () => {
  if (canResend) {
    if (!email) {
      toast.error("Email is not provided. Please try again.");
      return;
    }
    try {
      await ResendOtp(email, "register");
      toast.success(`OTP resent successfully`);
      setTimeLeft(120); // Reset to 2 minutes after resend
      setCanResend(false);
    } catch (error: any) {
      if (error.response?.data?.data) {
        toast.error(error.response?.data?.data);
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    }
  }
};

  const handleError = () => {
    setIsInvalid(true);
    const fadeOutTimeouts = otp.map((_, index) =>
      setTimeout(
        () =>
          setFadeOut((prev) => {
            const newFadeOut = [...prev];
            newFadeOut[3 - index] = true;
            return newFadeOut;
          }),
        index * 200
      )
    );

    setTimeout(() => {
      fadeOutTimeouts.forEach(clearTimeout);
      setIsInvalid(false);
      setOtp(["", "", "", ""]);
      setFadeOut([false, false, false, false]);
      setActiveIndex(0);
    }, 1000);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  // Keep focus on container even if clicked outside
  const handleBlur = () => {
    setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.focus();
      }
    }, 10);
  };

  return (
    <div className="w-[100%] bg-white flex md:justify-start md:items-start items-center">
      <div className="md:w-1/2 w-full h-[100vh] justify-center md:items-start items-center md:justify-start flex flex-col  md:px-[10%] px-[7%] gap-5 pt-[2%]">
        <div className="pt-5">
          <img src={logo} alt="logo" width={300} height={200} />
        </div>
        <div className="space-y-3 pt-[20%]">
          <h1 className="font-bold text-4xl">OTP Verification</h1>
          <h1 className="font-medium text-gray-500 text-base">
            We sent a code to your email address.
          </h1>
        </div>

        {/* OTP input container - tab index makes it focusable */}
        <div
          ref={containerRef}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className={`flex md:justify-start justify-center items-center w-full gap-10 mt-4 outline-none ${isInvalid ? "animate-vibrate" : ""
            }`}
        >
          {otp.map((value, index) => (
            <div
              key={index}
              className={getInputClass(index, value)}
              onClick={() => setActiveIndex(index)}
            >
              {value}
            </div>
          ))}
        </div>

        <div className="flex items-start gap-3 w-full pl-5 md:pl-0">
          <span className="font-bold">{formatTime(timeLeft)}</span>
        </div>
        <div className="flex items-start gap-3 w-full pl-5 md:pl-0 ">
          <span className="font-medium">Didn't get a code ? </span>
          <button
            onClick={handleResend}
            className={`font-bold ${canResend ? "text-primary hover:underline" : "text-gray-500 cursor-not-allowed"}`}
            disabled={!canResend}
          >
            Resend
          </button>
        </div>
        <div className="w-full md:mt-auto mt-10 md:mb-[10%]">
          <Button
            className="flex items-center py-3 w-full justify-center mx-auto rounded-md"
            text="Continue"
            isLoading={false}
            onClick={handleSubmit}
          />
        </div>
      </div>
      <div className="relative hidden md:flex w-1/2 rounded-xl items-center">
        <img
          src={otp_verification}
          width={550}
          height={500}
          alt="side image"
          className="object-contain absolute left-0"
        />
        <div className="w-[25%] bg-white h-screen"></div>
        <div className="w-[75%] bg-primary h-screen"></div>
      </div>
    </div>
  );
};

export default OtpVerification;