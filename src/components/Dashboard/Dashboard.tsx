import { useNavigate } from "react-router-dom";
import { AuthLayout } from "../Layout/layout";
// import FinancialOverview from "./Tools/FinancialOverview";
// import PortfolioAnalyticsWatchList from "./Tools/PortfolioAnalyticsWatchList";
import StockCardCarousel from "./Tools/StockCardCarousel";
import { useEffect, useState } from "react";
import UseFinanceHook from "@/hooks/UseFinance";
import { BanknotesIcon, CreditCardIcon, WalletIcon } from "@heroicons/react/24/solid"
import { Card } from "./Tools/card"
import CreditCard from "./Tools/CreditCard"
import CreditCardBtn from "./Tools/CreditCardBtn"
import DailyLimit from "./Tools/DailyLimit"
import SavingPlan from "./Tools/SavingsPlan"
import CashFlow from "./Tools/Cashflow"
import TransactionTable from "./Tools/TransactionTable"
import PieChart from "./Tools/PieChart"
import RecentActivity from "./Tools/RecentActivity"
import AnalyticsSparkline from "./Tools/AnalyticsChart"
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
          {/* <FinancialOverview />
          <PortfolioAnalyticsWatchList /> */}
             <div className="px-4 sm:px-6">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* First Column - 32% */}
                    <div className="w-full lg:w-[32%]">
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                            <CreditCard
                                cardNumber="1234567890123456"
                                cardholderName="John Doe"
                                expiryDate="12/23"
                                cvv="1234"
                                cardType="VISA"
                            size="sm"
                            />
                            <CreditCardBtn />
                        </div>
                        <div className="mt-6">
                            <DailyLimit />
                        </div>
                        <div className="mt-6">
                            <SavingPlan />
                        </div>
                    </div>

                    {/* Second Column - 45% */}
                    <div className="w-full lg:w-[45%]">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Card
                                icon={<BanknotesIcon className="h-6 w-6 text-white" />}
                                title="Total Income"
                                amount={5840.75}
                                percentageChange={3.2}
                            />
                            <Card
                                icon={<WalletIcon className="h-6 w-6 text-white" />}
                                title="Total Expense"
                                amount={2350.00}
                                percentageChange={1.8}
                            />
                            <Card
                                icon={<CreditCardIcon className="h-6 w-6 text-white" />}
                                title="Total Savings"
                                amount={1490.25}
                                percentageChange={-0.7}
                            />
                        </div>
                        <div>
                            <CashFlow />
                        </div>

                        <TransactionTable
                            initialPageSize={4}
                            maxHeight="350px"
                        />
                    </div>

                    {/* Third Column - 22% */}
                    <div className="w-full lg:w-[22%]">
                        {/* Pie Chart with tabs */}
                        <PieChart />

                        <RecentActivity />
                    </div>
                </div>
                <div className="px-4 md:px-6 lg:px-4">
                    <AnalyticsSparkline
                        title="Analytics"
                        maxY={50000}
                        lineColor="#3B82F6"
                        fillColor="#93C5FD"
                    />

                </div>
            </div>
        </div>
      </>
    </AuthLayout>
  );
};

export default Dashboard;