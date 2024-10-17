import React, { useState, useRef, useEffect } from "react";
import Button from "../Ui/Button";
import { logo, otp_verification } from "../../../public"; // Make sure these imports are correct
import axiosClient from "@/services/axios-client";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AppDispatch } from "@/context/store";
import { useDispatch, useSelector } from "react-redux";
import { setToken, setUser } from "./store";
import { RootState } from "@/context/store/rootReducer";

const OtpVerification = () => {
  const client = axiosClient();
  const dispatch = useDispatch<AppDispatch>();
  const router = useNavigate();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [isInvalid, setIsInvalid] = useState(false);
  const [fadeOut, setFadeOut] = useState([false, false, false, false]);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes countdown
  const [canResend, setCanResend] = useState(false);
  const inputsRef = useRef<HTMLInputElement[]>([]);

  const otpMail = useSelector((state: RootState) => state.auth.otp_mail);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  // Handle OTP input change
  const handleChange = (index: number, value: string) => {
    if (/^\d$/.test(value) || value === "") {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move to the next input if the current one is filled
      if (value !== "" && index < 3) {
        inputsRef.current[index + 1].focus();
      }
    }
  };

  // Handle backspace key to move focus to the previous input
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleSubmit = async () => {
    const enteredOtp = otp.join("");
    try {
      const client = axiosClient();
     const res = await client.post("/auth/verify-otp", {
        email: otpMail,
        otp: enteredOtp,
      });
      const token = res.data.data.token
      const user = res.data.data.user
      setIsInvalid(false);
      dispatch(setToken(token));
      dispatch(setUser(user));
      router("/dashboard");
      toast.success("OTP verified successfully!");
      // Redirect or update state as needed
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
      try {
      
        const res = await client.post("/auth/resend-otp", { email: otpMail });
        const otp = res.data.data.otp;
        toast.success(`OTP resent successfully! = > ${otp}`);
        setTimeLeft(180);
        setCanResend(false);
      } catch (error:any) {
        if (error.response?.data?.data) {
          toast.error( error.response?.data?.data);
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
      inputsRef.current[0].focus();
    }, 1000);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
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
        <div
          className={`flex md:justify-start justify-center items-center w-full gap-10 mt-4 ${
            isInvalid ? "animate-vibrate" : ""
          }`}
        >
          {otp.map((value, index) => (
            <input
              key={index}
              ref={(el) => (inputsRef.current[index] = el!)}
              type="text"
              maxLength={1}
              value={value}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className={`w-12 h-12 text-center text-xl border rounded-md transition-all duration-150 ${
                value
                  ? "border-primary focus:ring-secondary ring-2 focus:ring-2"
                  : "border-gray-300"
              } ${
                fadeOut[index]
                  ? "opacity-0 transition-opacity duration-300"
                  : ""
              }`}
            />
          ))}
        </div>
        <div className="flex items-start gap-3 w-full pl-5 md:pl-0">
          <span className="font-bold">{formatTime(timeLeft)}</span>
        </div>
        <div className="flex items-start gap-3 w-full pl-5 md:pl-0 ">
          <span className="font-medium">Didn’t get a code ? </span>
          <button
            onClick={handleResend}
            className={`font-bold ${canResend ? "" : "text-gray-500 cursor-not-allowed"}`}
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
