import axiosClient from "@/services/axios-client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SurveyDataValues } from "@/types";

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

    return {
        loading,
        SubmitSurveyQuestion
    }

}



export default UseFinanceHook;