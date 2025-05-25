import { useNavigate } from "react-router-dom";
import { AuthLayout } from "../Layout/layout";
import FinancialOverview from "./Tools/FinancialOverview";
import PortfolioAnalyticsWatchList from "./Tools/PortfolioAnalyticsWatchList";
import StockCardCarousel from "./Tools/StockCardCarousel";
import { useEffect, useState } from "react";
import UseFinanceHook from "@/hooks/UseFinance";

const Dashboard = () => {
  const { getUserDetails } = UseFinanceHook();
  const router = useNavigate();
  const [showKycAlert, setShowKycAlert] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userDetails = await getUserDetails();
        const kycNotDone = userDetails?.data[0]?.kyc_status;
        if (kycNotDone !== "yes") {
          setShowKycAlert(true);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    }
    fetchUserDetails();
  }, []);

  return (
    <AuthLayout>
      <>
        {showKycAlert && (
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-amber-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-amber-700 font-medium">
                  Your KYC verification is incomplete. 
                  <button 
                    onClick={() => router("/kyc")}
                    className="ml-2 text-amber-800 underline font-semibold hover:text-amber-900"
                  >
                    Complete now
                  </button>
                </p>
              </div>
              <div className="ml-auto">
                <button
                  onClick={() => setShowKycAlert(false)}
                  className="text-amber-700 hover:text-amber-900"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="container">
          <StockCardCarousel />
          <FinancialOverview />
          <PortfolioAnalyticsWatchList />
        </div>
      </>
    </AuthLayout>
  );
};

export default Dashboard;