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
import Verification from "@/pages/auth/emailVerification";
import Investment from "@/pages/investing";
import Dashboard_T from "@/pages/dashboard";
import Stocking from "@/pages/stock";
import Market from "@/pages/marketzone";
import Dashboard2Page from "./pages/dashboard2";
import PredictiveAccountPage from "./pages/predictive_account/predictiveAccountPage";


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
              <Route path="/auth/otp-verification" element={<Verification />} />
              

              {/* Auth Pages */}
              <Route path="/dashboard" element={<Dashboard_T />} />
              <Route path="/investing" element={<Investment />} />
              <Route path="/stock" element={<Stocking />} />
              <Route path="/market-zone" element={<Market />} />
              <Route path="/dashboard2" element={<Dashboard2Page />} />
              <Route path="/predictive-account" element={<PredictiveAccountPage />} />


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
