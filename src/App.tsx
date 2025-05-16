import { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import Signin from "@/pages/auth/signin";
import Loading from "@/utils/Loading";
import Signup from "@/pages/auth/signup";

import ButtonT from "@/pages/Ui/button";
import ExampleForm from "./pages/Ui/textinput";

import Home from "@/pages/home/";
import NotFound from "@/pages/404";
import Investment from "@/pages/investing";
import Dashboard_T from "@/pages/dashboard";
import Stocking from "@/pages/stock";
import Market from "@/pages/marketzone";
import Dashboard2Page from "./pages/dashboard2";
import PredictiveAccountPage from "./pages/predictive_account/predictiveAccountPage";
import SavingsPage from "./pages/Savings";
import EducationPage from "./pages/education";
import Course from "./components/Education/Tool/course";
import CourseDetail from "./components/Education/Tool/courseDetail";
import MarketNews from "./components/MarketNews/MarketNews";
import MarketNewsDetails from "./components/MarketNews/MarketNewsDetails";
import AnalysisDetailsPage from "./pages/analysis";
import Analysis from "./components/Analysis/Analysis";
import OtpVerification from "./components/Auth/OtpVerification";
import ProtectedRoute from "./services/protected-auth";
import ForgetPasswordEmail from "./components/Auth/ForgetPasswordEmail";
import ResetPassword from "./components/Auth/ResetPassword";
import ChangePasswordEmail from "./components/Auth/ChangePasswordMail";
import ChangePasswordPage from "./components/Auth/ChangePassword";
import Survey from "./components/Survey/survey";
import KycForm from "./components/Survey/kyc";


function App() {
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setLoading(true);

    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [location]);

  return (
    <>
      <main>
        {loading ? (
          <Loading message="please wait..." />
        ) : (
          <>
            <Routes>
              <Route path="*" element={<NotFound />} />
              <Route path="/" element={<Home />} />

              {/* Authentication */}
              <Route path="/auth/signin" element={<Signin />} />
              <Route path="/auth/signup" element={<Signup />} />
              <Route path="/auth/otp-verification" element={<OtpVerification />} />
              <Route path="/auth/forget-pwd" element={<ForgetPasswordEmail />} />
              <Route path="/auth/forget-pwd-verification" element={<ResetPassword />} />
              <Route path="/survey" element={<Survey />} />
              <Route path="/kyc" element={<ProtectedRoute><KycForm /></ProtectedRoute>} />

              {/* Auth Pages */}
              <Route path="/auth/change-pwd" element={<ProtectedRoute><ChangePasswordEmail /></ProtectedRoute>} />
              <Route path="/auth/change-pwd-verification" element={<ProtectedRoute><ChangePasswordPage /></ProtectedRoute>} />

              <Route path="/investing" element={<ProtectedRoute><Investment /></ProtectedRoute>} />

              <Route path="/dashboard" element={<ProtectedRoute><Dashboard_T /></ProtectedRoute>} />
              <Route path="/stock" element={<ProtectedRoute><Stocking /></ProtectedRoute>} />
              <Route path="/market-zone" element={<ProtectedRoute><Market /></ProtectedRoute>} />
              <Route path="/dashboard2" element={<ProtectedRoute><Dashboard2Page /></ProtectedRoute>} />
              <Route path="/predictive-account" element={<ProtectedRoute><PredictiveAccountPage /></ProtectedRoute>} />
              <Route path="/savings" element={<ProtectedRoute><SavingsPage /></ProtectedRoute>} />
              <Route path="/education" element={<ProtectedRoute><EducationPage /></ProtectedRoute>} />
              <Route path="/course" element={<ProtectedRoute><Course /></ProtectedRoute>} />
              <Route path="/course-detail" element={<ProtectedRoute><CourseDetail /></ProtectedRoute>} />
              <Route path="/market-news" element={<ProtectedRoute><MarketNews /></ProtectedRoute>} />
              <Route path="/market-news/details" element={<ProtectedRoute><MarketNewsDetails /></ProtectedRoute>} />
              <Route path="/analysis/details" element={<ProtectedRoute><AnalysisDetailsPage /></ProtectedRoute>} />
              <Route path="/analysis" element={<ProtectedRoute><Analysis /></ProtectedRoute>} />


              {/* Ui */}
              <Route path="/ui/button" element={<ButtonT />} />
              <Route path="/ui/textinput" element={<ExampleForm />} />
            </Routes>
          </>
        )}
      </main>
    </>
  );
}

export default App;
