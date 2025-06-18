import { useEffect, useState } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { SurveyDataValues } from "@/types";
import { toast } from "react-toastify";
import Loading from "@/utils/Loading";
import UseFinanceHook from "@/hooks/UseFinance";
import { questionnaire } from "./questions";
import Question from "./questionStructure";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/context/store/rootReducer";

export default function Survey() {
  const [currentStep, setCurrentStep] = useState(0);
  const { SubmitSurveyQuestion, loading, getUserDetails } = UseFinanceHook();
  const router = useNavigate()
  const token = useSelector((state: RootState) => state.auth.token);
  const user = useSelector((state: RootState) => state.auth.user);
  
  useEffect(() => {
    const fetchUserDetails = async () => {

      try {
        // Check token from Redux first, then localStorage as fallback
        const authToken = token || localStorage.getItem("token");

        if (!authToken) {
          toast.error("Please complete the login process first.");
          router("/auth/signin");
          return;
        }

        // Log for debugging
        console.log("Token available:", !!authToken);
        console.log("User available:", !!user);

        const userDetails = await getUserDetails();
        console.log("User details:", userDetails);

        // Check if survey is already filled
        const isSurveyFilled = userDetails?.data?.[0]?.is_questionnaire_filled;
        if (isSurveyFilled === "yes") {
          toast.info("You have already completed the questionnaire.");
          router("/dashboard");
        }
      } catch (error: any) {
        console.error("Error fetching user details:", error);

        // Handle authentication errors
        if (error?.response?.status === 401 || error?.message?.includes("unauthorized")) {
          toast.error("Session expired. Please log in again.");
          localStorage.removeItem("token");
          sessionStorage.removeItem("token");
          router("/auth/signin");
        }
      }
    };

    fetchUserDetails();
  }, [token, user, getUserDetails, router]);


  const handlePreviousClick = () => {
    setCurrentStep((prevStep) => Math.max(prevStep - 1, 0));
  };

  // Validation Schema that matches SurveyDataValues interface
  const schema = yup.object().shape({
    age: yup.string().required("Age is required"),
    geneder: yup.string().required("Gender is required"),
    country: yup.string().required("Country is required"),
    state: yup.string().required("State is required"),
    occupation: yup.string().required("Occupation is required"),
    long_investing: yup.string().required("Investment duration is required"),
    often_review_invest_portolio: yup.string().required("Portfolio review frequency is required"),
    type_fin_assets: yup.array().of(yup.string().required()).min(1, "At least one option must be selected").required("Field is required"),

    portCompPer_stock: yup.string().required("Stock percentage is required"),
    portCompPer_bond: yup.string().required("Bond percentage is required"),
    portCompPer_mutEtf: yup.string().required("Mutual funds/ETF percentage is required"),
    portCompPer_real_est: yup.string().required("Real estate percentage is required"),
    portCompPer_crypto: yup.string().required("Crypto percentage is required"),
    portCompPer_cash: yup.string().required("Cash percentage is required"),
    portCompper_other_name: yup.string(),
    portCompper_other_per: yup.string().required("Field is required"),

    pri_investment_goal: yup.string().required("Investment goal is required"),
    risk_tolerance: yup.string().required("Risk tolerance is required"),
    believe_ai: yup.array().of(yup.string().required()).min(1, "At least one option must be selected").required("Field is required"),
    market_down: yup.string().required("Market reaction is required"),
    insestment_strategy: yup.array().of(yup.string().required()).min(1, "At least one option must be selected").required("Field is required"),
    follow_investment_advice: yup.string().required("Investment advice is required"),
    do_advisor: yup.string().required("Financial advisor info is required"),
    invest_budget: yup.string().required("Investment budget is required"),
    diverser_investment: yup.string().required("Diversification importance is required"),

    aitool_decision: yup.string().required("AI tool usage is required"),
    ai_benefit: yup.array().of(yup.string().required()).min(1, "At least one option must be selected").required("Field is required"),
    ai_aspect: yup.array().of(yup.string().required()).min(1, "At least one option must be selected").required("Field is required"),
    ai_comfortable_using: yup.string().required("AI comfort level is required"),

    consider_event_current: yup.string().required("Field is required"),
    belief_event_current_affect: yup.array().of(yup.string().required()).min(1, "At least one option must be selected").required("Field is required"),

    role_researcher_invest: yup.string().required("Research role is required"),
    challenges_invest: yup.string().required("Investment challenges are required"),
    improvement_platform: yup.string().required("Platform improvements are required"),
    concerns_ai_invest: yup.string().required("AI concerns are required"),
    see_ai_invest_years: yup.string().required("Future AI role is required"),

    additional_comment_ai: yup.string().required("Field is required"),
    additional_comment_preference: yup.string().required("Preference comments are required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm<SurveyDataValues>({
    resolver: yupResolver(schema),
    mode: "all",
    defaultValues: {
      type_fin_assets: [],
      believe_ai: [],
      insestment_strategy: [],
      ai_benefit: [],
      ai_aspect: [],
      belief_event_current_affect: [],
    },
  });

  const handleNextClick = async () => {
    const currentStepFields = questionnaire[currentStep].questions.map(
      (question) => question.id.toString() as keyof SurveyDataValues
    );

    const isValid = await trigger(currentStepFields);

    if (isValid) {
      setCurrentStep((prevStep) => Math.min(prevStep + 1, questionnaire.length - 1));
    }
  };

  const onSubmitSurvey: SubmitHandler<SurveyDataValues> = async (data) => {
    toast.promise(SubmitSurveyQuestion(data), {
      pending: "Submitting...",
      success: {
        render({ data }) {
          return <div>{data as string}</div>;
        },
      },
      error: {
        render({ data }) {
          return <div>{data as string}</div>;
        },
      },
    });
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center">
      <div className="sm:px-16 px-8 py-8 w-full max-w-4xl">
        <div className="flex flex-col md:flex-row bg-white p-5 md:p-10 rounded-lg shadow-lg">
          {/* Questionnaire Section */}
          <div className="w-full md:w-1/2 p-5">
            <div className="pb-3">
              <h3 className="font-semibold pb-3 text-center md:text-left">Financial Assets Preferences Questionnaire</h3>
              <hr className="border border-blue-600 w-56 mx-auto md:mx-0" />
            </div>
            {questionnaire[currentStep] && (
              <div>
                {/* Title */}
                <h2 className="mb-4 font-bold text-2xl text-center md:text-left">{questionnaire[currentStep].title}</h2>
                {/* Form */}
                <form className="space-y-4" onSubmit={handleSubmit(onSubmitSurvey)}>
                  {questionnaire[currentStep].questions.map((question) => (
                    <Question
                      key={question.id}
                      label={question.label}
                      id={question.id}
                      type={question.type as "text" | "select" | "multi-select"}
                      options={question.options || []}
                      placeholder={question.placeholder}
                      register={register}
                      errors={errors}
                    />
                  ))}

                  {/* Navigation Buttons */}
                  <div className="w-full mt-5 flex justify-between">
                    {currentStep > 0 && (
                      <button
                        type="button"
                        onClick={handlePreviousClick}
                        className="bg-gray-500 text-white py-2 px-4 rounded"
                      >
                        Previous
                      </button>
                    )}
                    {currentStep < questionnaire.length - 1 ? (
                      <button
                        type="button"
                        onClick={handleNextClick}
                        className="bg-blue-500 text-white py-2 px-4 rounded"
                      >
                        Next
                      </button>
                    ) : (
                      <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
                        Submit
                      </button>
                    )}
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Illustration Section */}
          <div className="hidden md:flex w-full md:w-1/2 md:h-auto m-5 rounded-xl px-10 flex-col justify-center items-center">
            {/* <div className="object-cover">
              <img
                src="assets/images/dashboard/dashboard/undraw_online_organizer_re_156n 1.svg"
                alt="Illustration"
                width={250}
                height={250}
                className="object-contain"
              />
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}