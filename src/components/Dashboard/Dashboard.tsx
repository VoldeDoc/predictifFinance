import { useNavigate } from "react-router-dom";
import { AuthLayout } from "../Layout/layout";
import StockCardCarousel from "./Tools/StockCardCarousel";
import { useEffect, useState, useRef } from "react";
import UseFinanceHook from "@/hooks/UseFinance";
import {  BanknotesIcon, CreditCardIcon, WalletIcon } from "@heroicons/react/24/solid"
import { Card } from "./Tools/card"
import CreditCard from "./Tools/CreditCard"
import CreditCardBtn from "./Tools/CreditCardBtn"
import DailyLimit from "./Tools/DailyLimit"
import SavingPlan from "./Tools/BudgetPlan"
import CashFlow from "./Tools/Cashflow"
import TransactionTable from "./Tools/TransactionTable"
import PieChart from "./Tools/PieChart"
import RecentActivity from "./Tools/RecentActivity"

interface Summary {
  income: number;
  expense: number;
  budgetamount: number;
}

const Dashboard = () => {
  const { getUserDetails, getBudgetSummary } = UseFinanceHook();
  const router = useNavigate();
  const [showKycAlert, setShowKycAlert] = useState(false);
  const [userDetails, setUserDetails] = useState<any>(null);

  // Add ref for transaction table
  const transactionTableRef = useRef<HTMLDivElement>(null);

  const [summary, setSummary] = useState<Summary>({ income: 0, expense: 0, budgetamount: 0 });

  const [incomePct, setIncomePct] = useState(0);
  const [expensePct, setExpensePct] = useState(0);
  const [savingsPct, setSavingsPct] = useState(0);

  // Function to scroll to transaction table
  const scrollToTransactionTable = () => {
    if (transactionTableRef.current) {
      transactionTableRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userDetailsResponse = await getUserDetails();
         setUserDetails(userDetailsResponse);
        const kycNotDone = userDetailsResponse?.data[0]?.kyc_status;
        if (kycNotDone !== "yes") {
          setShowKycAlert(true);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    }
    fetchUserDetails();
  }, []);

  // Listen for hash changes to scroll to transaction table
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#history') {
        setTimeout(() => {
          scrollToTransactionTable();
        }, 100); // Small delay to ensure DOM is ready
      }
    };

    // Check on component mount
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  useEffect(() => {
    async function load() {
      const data = await getBudgetSummary();
      const lastRaw = localStorage.getItem("lastSummary");
      const last: Summary | null = lastRaw ? JSON.parse(lastRaw) : null;

      const pct = (newVal: number, oldVal?: number) =>
        oldVal && oldVal !== 0
          ? Math.round(((newVal - oldVal) / oldVal) * 1000) / 10
          : 0;

      setIncomePct(pct(data.income, last?.income));
      setExpensePct(pct(data.expense, last?.expense));
      setSavingsPct(pct(data.budgetamount, last?.budgetamount));

      setSummary(data);
      localStorage.setItem("lastSummary", JSON.stringify(data));
    }
    load();
  }, [getBudgetSummary]);

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
          <div className="px-4 sm:px-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* First Column - 32% */}
              <div className="w-full lg:w-[32%]">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <CreditCard
                    cardNumber="****** **** ****"
                    cardholderName={`${userDetails?.data[0]?.first_name || ''} ${userDetails?.data[0]?.last_name || ''}`.trim() || 'CARD HOLDER'}
                    expiryDate="**/**"
                    cvv="***"
                    cardTypeImage="/assets/images/favicon.png"
                    size="sm"
                  />
                  {/* Pass the scroll function to CreditCardBtn */}
                  <CreditCardBtn onHistoryClick={scrollToTransactionTable} />
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
                    amount={summary.income}
                    percentageChange={incomePct}
                  />
                  <Card
                    icon={<WalletIcon className="h-6 w-6 text-white" />}
                    title="Total Expense"
                    amount={summary.expense}
                    percentageChange={expensePct}
                  />
                  <Card
                    icon={<CreditCardIcon className="h-6 w-6 text-white" />}
                    title="Total Savings"
                    amount={summary.budgetamount}
                    percentageChange={savingsPct}
                  />
                </div>
                <div>
                  <CashFlow />
                </div>

                {/* Add ref to TransactionTable */}
                <div ref={transactionTableRef} id="history">
                  <TransactionTable
                    initialPageSize={5}
                    maxHeight="350px"
                  />
                </div>
              </div>

              {/* Third Column - 22% */}
              <div className="w-full lg:w-[22%]">
                <PieChart />
                <RecentActivity />
              </div>
            </div>
          </div>
        </div>
      </>
    </AuthLayout>
  );
};

export default Dashboard;