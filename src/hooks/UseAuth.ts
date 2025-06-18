import { setToken, setUser } from "@/components/Auth/store";
import { AppDispatch } from "@/context/store";
// import { RootState } from "@/context/store/rootReducer";
import axiosClient from "@/services/axios-client";
import { Signup } from "@/types";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const UserAuthentication = () => {
    const client = axiosClient();
    const [loading, setLoading] = useState(false);
    const router = useNavigate();

    const dispatch = useDispatch<AppDispatch>()

    const UserSignup = async (data: Signup) => {
        try {
            setLoading(true)
            await client.post("/register", data);
            router("/auth/otp-verification", { state: { email: data.email } });
            return Promise.resolve("User created successfully");
        } catch (error: any) {
            const resError = error.response?.data;
            const errorMessage = resError?.message || resError?.data;
            console.log(errorMessage);
            return Promise.reject(errorMessage || "Failed to create account");
        }
        finally {
            setLoading(false);
        }
    }


   const VerifyOtp = async (data: { email: string, otp: string }) => {
  try {
    setLoading(true);
    const response = await client.post("/verifyOtp", {
      email: data.email,
      otp: data.otp
    });
    
    console.log("VerifyOtp API Response:", response.data); // Debug log
    
    // Store token and user in Redux if available
    if (response.data.token) {
      dispatch(setToken(response.data.token));
      // Also store in localStorage as backup
      localStorage.setItem("token", JSON.stringify(response.data.token));
    }
    
    if (response.data.user) {
      dispatch(setUser(response.data.user));
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    
    return response.data;
  } catch (error: any) {
    const resError = error.response?.data;
    const errorMessage = resError?.message || resError?.data || "Failed to verify OTP";
    console.error("VerifyOtp Error:", errorMessage);
    throw new Error(errorMessage);
  } finally {
    setLoading(false);
  }
};

    const ResendOtp = async (email: string, action: string) => {
        try {
            setLoading(true);
            const response = await client.post("/resendOtp", {
                email: email,
                action: action
            });
            return Promise.resolve(response.data.message || "OTP resent successfully");
        } catch (error: any) {
            const resError = error.response?.data;
            const errorMessage = resError?.message || resError?.data;
            console.log(errorMessage);
            return Promise.reject(errorMessage || "Failed to resend OTP");
        } finally {
            setLoading(false);
        }
    }


    const Logout = async () => {
        try {
            setLoading(true);
            localStorage.removeItem("token");
            dispatch(setToken(""));
            dispatch(setUser(null));
            router("/auth/signin");
            return Promise.resolve("Logged out successfully");
        } catch (error: any) {
            const resError = error.response?.data;
            const errorMessage = resError?.message || "An error occurred";
            return Promise.reject(`${errorMessage}`);
        }
        finally {
            setLoading(false);
        }

    }


    const Login = async (data: { email: string; password: string }) => {
        try {

            setLoading(true);
            const res = await client.post("/login", data);
            const token = res.data.data.token;
            const user = res.data.data.user;
            console.log(user);
            console.log(token);

            if (token) {
                localStorage.setItem("token", token);
                dispatch(setToken(token));
                dispatch(setUser(user));
            } else {
                throw new Error("Token not found");
            }
            // Redirect to the dashboard or another page
            router("/dashboard");
            return Promise.resolve("Logged in successfully");
        }
        catch (error: any) {
            const resError = error.response?.data;
            const errorMessage = resError?.message || resError?.data;
            console.log(errorMessage);
            return Promise.reject(errorMessage || "Failed to login");
        }
        finally {
            setLoading(false);
        }
    }

    const forgetPasswordMail = async (email: string, action: string) => {
        try {
            setLoading(true);
            const response = await client.post("/resendOtp", {
                email: email,
                action: action
            });
            router("/auth/forget-otp-verification", { state: { email: email } });
            return Promise.resolve(response.data.message || "Otp sent to mail");
        } catch (error: any) {
            const resError = error.response?.data;
            const errorMessage = resError?.message || resError?.data;
            console.log(errorMessage);
            return Promise.reject(errorMessage || "Failed to resend OTP");
        } finally {
            setLoading(false);
        }
    }


    const ChangePasswordMail = async (email: string, action: string) => {
        try {
            setLoading(true);
            const response = await client.post("/resendOtp", {
                email: email,
                action: action
            });
            router("/auth/change-pwd-verification", { state: { email: email } });
            return Promise.resolve(response.data.message || "Otp sent to mail");
        } catch (error: any) {
            const resError = error.response?.data;
            const errorMessage = resError?.message || resError?.data;
            console.log(errorMessage);
            return Promise.reject(errorMessage || "Failed to resend OTP");
        } finally {
            setLoading(false);
        }
    }

    const ChangePassword = async (data: {
        otp: string;
        new_password: string;
        new_password_confirmation: string;
    }) => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            if (!token) {
                router("/auth/signin");
                return Promise.reject("Authentication required to change password");
            }

            // Make sure to include the Authorization header with the token
            const response = await client.post("/resetPassword", data, {
                headers: {
                    Authorization: `Bearer ${JSON.parse(token)}`
                }
            });

            router("/auth/signin");
            return Promise.resolve(response.data.message || "Password changed successfully");
        } catch (error: any) {
            const resError = error.response?.data;
            const errorMessage = resError?.message || resError?.data;
            console.log(errorMessage);
            return Promise.reject(errorMessage || "Failed to change password");
        } finally {
            setLoading(false);
        }
    };



       const VerifyOtpForgetpwd = async (data: { email: string, otp: string }) => {
        try {
            setLoading(true);
            const response = await client.post("/verifyOtp", {
                email: data.email,
                otp: data.otp
            });

            // if (response.data.token) {
            //     dispatch(setToken(response.data.token));
            //     dispatch(setUser(response.data.user));
            // }
            router("/auth/reset-forget-pwd", { state: { email: data.email } });
            return Promise.resolve(response.data.message || "OTP verified successfully");
        } catch (error: any) {
            const resError = error.response?.data;
            const errorMessage = resError?.message || resError?.data;
            console.log(errorMessage);
            return Promise.reject(errorMessage || "Failed to verify OTP");
        } finally {
            setLoading(false);
        }
    }

    const ResetForgetPwd = async (data: { email: string, new_password: string, new_password_confirmation: string }) => {
        try {
            setLoading(true);
            const response = await client.post("/resetForgetPassword", data);
            console.log(response)
            router("/auth/signin");
            return Promise.resolve(response.data.message || "Password reset successfully");
        } catch (error: any) {
            const resError = error.response?.data;
            const errorMessage = resError?.message || resError?.data;
            console.log(errorMessage);
            return Promise.reject(errorMessage || "Failed to reset password");
        } finally {
            setLoading(false);
        }
    }

  

    return {
        loading,
        UserSignup,
        VerifyOtp,
        ResendOtp,
        Logout,
        Login,
        forgetPasswordMail,
        ResetForgetPwd,
        ChangePasswordMail,
        ChangePassword,
        VerifyOtpForgetpwd,

    }

}

export default UserAuthentication;