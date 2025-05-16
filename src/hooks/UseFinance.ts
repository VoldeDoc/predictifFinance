import axiosClient from "@/services/axios-client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { KycData, SurveyDataValues } from "@/types";

const UseFinanceHook = () => {
    const client = axiosClient();
    const [loading, setLoading] = useState(false);
    const router = useNavigate();
    const SubmitSurveyQuestion = async (data: SurveyDataValues) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                router("/auth/signup");
                return Promise.reject("Authentication required to change password");
            }
            setLoading(true);
            const response = await client.post("/user/investQuestionnaire", data, {
                headers: {
                    Authorization: `Bearer ${JSON.parse(token)}`
                }
            })
            console.log(response.data);
            router("/dashboard");
            return Promise.resolve("Survey submitted successfully");
        }
        catch (error: any) {
            const resError = error.response?.data;
            const errorMessage = resError?.message || resError?.data;
            console.log(errorMessage);
            return Promise.reject(errorMessage || "Failed to submit survey");
        }
        finally {
            setLoading(false);
        }
    }

    const getUserDetails = async () => {
        try { 
            const token = localStorage.getItem("token");
            if (!token) {
                router("/auth/signup");
                return Promise.reject("Authentication required to change password");
            }
            setLoading(true);
            const response = await client.get("/getUserDetails", {
                headers: {
                    Authorization: `Bearer ${JSON.parse(token)}`
                }
            })
            return Promise.resolve(response.data);
        }
        catch (error: any) {
            const resError = error.response?.data;
            const errorMessage = resError?.message || resError?.data;
            console.log(errorMessage);
            return Promise.reject(errorMessage || "Failed to submit survey");
        }
        finally {
            setLoading(false);
        }
    }

const SubmitKyc = async (data: KycData) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            router("/auth/signup");
            return Promise.reject("Authentication required for KYC submission");
        }
        
        // Create FormData to properly handle file upload
        const formData = new FormData();
        
        // Add each KYC item to the formData with the proper array index
        data.kyc.forEach((item, index) => {
            if (item.type === 'file' && item.value instanceof File) {
                formData.append(`kyc[${index}]${item.key}`, item.value);
            } else if (item.type === 'text') {
                formData.append(`kyc[${index}]${item.key}`, item.value.toString());
            }
        });
        
        setLoading(true);
        const response = await client.post("/user/kycuser", formData, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`,
                'Content-Type': 'multipart/form-data'
            }
        });
        
        console.log(response.data);
        router("/dashboard");
        return Promise.resolve("KYC completed successfully");
    }
    catch (error: any) {
        const resError = error.response?.data;
        const errorMessage = resError?.message || resError?.data;
        console.log(errorMessage);
        return Promise.reject(errorMessage || "Failed to submit KYC");
    }
    finally {
        setLoading(false);
    }
}

    return {
        loading,
        SubmitSurveyQuestion,
        getUserDetails,
        SubmitKyc,
    }

}



export default UseFinanceHook;