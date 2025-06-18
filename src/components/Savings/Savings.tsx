import { useState, useEffect } from "react";
import { BiTrendingUp } from "react-icons/bi";
import { AuthLayout } from "../Layout/layout";
import { PiChatCenteredTextLight } from "react-icons/pi";
import SavingPlan from "../Dashboard/Tools/BudgetPlan";
import { PiAirplaneTiltThin } from "react-icons/pi";
import TransactionsComponent from "../PrediciveAccount/compon/TransactionComponent";
import BalanceChart from "./Component/BalanceChart";
import { useNavigate } from "react-router-dom";
import UseFinanceHook from "@/hooks/UseFinance";

interface SavingsData {
  balance: number;
  type: string;
  created_at: string;
  updated_at: string;
  label: string;
  description: string;
  target_amount: number;
  reference: string;
  status: string;
}

interface WalletData {
  balance: number;
  type: string;
  status: string;
}

interface SavingsSummary {
  totalSavings: number;
  totalTargets: number;
  totalPlans: number;
  savingsGrowth: number;
  targetsGrowth: number;
  plansGrowth: number;
  mainAccountBalance: number;
}

const Savings = () => {
  const navigate = useNavigate();
  const [savingsData, setSavingsData] = useState<SavingsSummary>({
    totalSavings: 0,
    totalTargets: 0,
    totalPlans: 0,
    savingsGrowth: 0,
    targetsGrowth: 0,
    plansGrowth: 0,
    mainAccountBalance: 0,
  });
  const [loading, setLoading] = useState(true);
  const [savings, setSavings] = useState<SavingsData[]>([]);
  const [, setWallets] = useState<WalletData[]>([]);

  const { 
    getSavingWallets,
    getAllWallets,
    getDepositTransactions,
    getBudgetPeriods 
  } = UseFinanceHook();

  // Calculate the percentage for vacation fund (this could be made dynamic)
  const percentage = (3000 / 5000) * 100;

  useEffect(() => {
    loadSavingsData();
  }, []);

  const loadSavingsData = async () => {
    setLoading(true);
    try {
      // Fetch all required data
      const [savingsResponse, walletsResponse, depositsResponse, budgetPeriodsResponse] = await Promise.all([
        getSavingWallets(),
        getAllWallets(),
        getDepositTransactions(),
        getBudgetPeriods()
      ]);

      console.log('Savings Response:', savingsResponse);
      console.log('Wallets Response:', walletsResponse);
      console.log('Deposits Response:', depositsResponse);
      console.log('Budget Periods Response:', budgetPeriodsResponse);

      // Process savings data
      let savingsArray: SavingsData[] = [];
      if (Array.isArray(savingsResponse)) {
        savingsArray = savingsResponse;
      } else if (savingsResponse?.data && Array.isArray(savingsResponse.data)) {
        savingsArray = savingsResponse.data;
      }

      // Process wallets data
      let walletsArray: WalletData[] = [];
      if (Array.isArray(walletsResponse)) {
        walletsArray = walletsResponse;
      } else if (walletsResponse?.data && Array.isArray(walletsResponse.data)) {
        walletsArray = walletsResponse.data;
      }

      // Get main account balance
      const mainAccount = walletsArray.find(wallet => wallet.type === 'main' && wallet.status === 'active');
      const mainAccountBalance = mainAccount ? mainAccount.balance : 0;

      // Calculate total savings (sum of all savings balances)
      const totalSavingsAmount = savingsArray.reduce((sum, saving) => {
        return sum + (saving.balance || 0);
      }, 0);

      // Calculate total targets (sum of all target amounts)
      const totalTargetsAmount = savingsArray.reduce((sum, saving) => {
        return sum + (saving.target_amount || 0);
      }, 0);

      // Count total active savings plans
      const totalPlansCount = savingsArray.filter(saving => saving.status === 'active').length;

    
     

      // Mock growth calculations (you can implement real growth calculation by comparing with previous period)
      const savingsGrowth = 4.20;
      const targetsGrowth = 2.80;
      const plansGrowth = 15.60;

      setSavingsData({
        totalSavings: totalSavingsAmount,
        totalTargets: totalTargetsAmount,
        totalPlans: totalPlansCount,
        savingsGrowth,
        targetsGrowth,
        plansGrowth,
        mainAccountBalance,
      });

      setSavings(savingsArray);
      setWallets(walletsArray);

    } catch (error) {
      console.error('Error loading savings data:', error);
      // Keep default values on error
    } finally {
      setLoading(false);
    }
  };

  const handleTotalSavingsClick = () => {
    // Navigate to savings/cards component
    navigate('/all-savings');
  };

  const handleTotalTargetsClick = () => {
    // Navigate to goals/targets page
    navigate('/predictive-account?tab=goals');
  };

  const handleTotalPlansClick = () => {
    // Navigate to all plans view
    navigate('/predictive-account?tab=cards');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatGrowth = (growth: number) => {
    return `${growth >= 0 ? '+' : ''}${growth.toFixed(2)}%`;
  };

  // Get the most recent/highest savings plan for featured display
  const featuredSaving = savings.length > 0 
    ? savings.reduce((prev, current) => (prev.balance > current.balance) ? prev : current)
    : null;

  const featuredProgress = featuredSaving 
    ? (featuredSaving.balance / featuredSaving.target_amount) * 100
    : percentage;

  return (
    <AuthLayout>
      <>
        <div className="px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Savings Card */}
            <div 
              className="bg-blue-300 shadow rounded-lg p-4 cursor-pointer hover:bg-blue-400 transition-colors transform hover:scale-105"
              onClick={handleTotalSavingsClick}
            >
              <div className="flex justify-between">
                <div>
                  <h5 className="font-normal">Total Savings</h5>
                  <div className="flex">
                    {loading ? (
                      <div className="animate-pulse bg-blue-200 h-6 w-20 rounded"></div>
                    ) : (
                      <h4 className="text-blue-800 text-xl">{formatCurrency(savingsData.totalSavings)}</h4>
                    )}
                    <p className={`rounded-xl p-1 text-xs flex items-center ml-2 ${
                      savingsData.savingsGrowth >= 0 ? 'bg-green-400' : 'bg-red-400'
                    }`}>
                      <BiTrendingUp className="mr-1" /> 
                      {formatGrowth(savingsData.savingsGrowth)}
                    </p>
                  </div>
                  <p className="text-xs text-blue-700 mt-1">
                    💰 Main Balance: {formatCurrency(savingsData.mainAccountBalance)}
                  </p>
                </div>
                <div className="rounded-full bg-white p-4">
                  <PiChatCenteredTextLight className="text-3xl" />
                </div>
              </div>
            </div>

            {/* Total Targets Card */}
            <div 
              className="bg-green-300 shadow rounded-lg p-4 cursor-pointer hover:bg-green-400 transition-colors transform hover:scale-105"
              onClick={handleTotalTargetsClick}
            >
              <div className="flex justify-between">
                <div>
                  <h5 className="font-normal">Total Targets</h5>
                  <div className="flex">
                    {loading ? (
                      <div className="animate-pulse bg-green-200 h-6 w-20 rounded"></div>
                    ) : (
                      <h4 className="text-green-800 text-xl">{formatCurrency(savingsData.totalTargets)}</h4>
                    )}
                    <p className={`rounded-xl p-1 text-xs flex items-center ml-2 ${
                      savingsData.targetsGrowth >= 0 ? 'bg-green-400' : 'bg-red-400'
                    }`}>
                      <BiTrendingUp className="mr-1" /> 
                      {formatGrowth(savingsData.targetsGrowth)}
                    </p>
                  </div>
                  <p className="text-xs text-green-700 mt-1">
                    🎯 Average: {savingsData.totalPlans > 0 ? formatCurrency(savingsData.totalTargets / savingsData.totalPlans) : '$0'}
                  </p>
                </div>
                <div className="rounded-full bg-white p-4">
                  <PiChatCenteredTextLight className="text-3xl" />
                </div>
              </div>
            </div>

            {/* Total Plans Card */}
            <div 
              className="bg-purple-300 shadow rounded-lg p-4 cursor-pointer hover:bg-purple-400 transition-colors transform hover:scale-105"
              onClick={handleTotalPlansClick}
            >
              <div className="flex justify-between">
                <div>
                  <h5 className="font-normal">Savings Plans</h5>
                  <div className="flex">
                    {loading ? (
                      <div className="animate-pulse bg-purple-200 h-6 w-8 rounded"></div>
                    ) : (
                      <h4 className="text-purple-800 text-xl">{savingsData.totalPlans}</h4>
                    )}
                    <p className={`rounded-xl p-1 text-xs flex items-center ml-2 ${
                      savingsData.plansGrowth >= 0 ? 'bg-green-400' : 'bg-red-400'
                    }`}>
                      <BiTrendingUp className="mr-1" /> 
                      {formatGrowth(savingsData.plansGrowth)}
                    </p>
                  </div>
                  <p className="text-xs text-purple-700 mt-1">
                    📋 Active Plans: {savings.filter(s => s.status === 'active').length}
                  </p>
                </div>
                <div className="rounded-full bg-white p-4">
                  <PiChatCenteredTextLight className="text-3xl" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 mt-6">
            <div className="w-full lg:w-[30%] p-4">
              <SavingPlan />
            </div>
            <div className="w-full lg:w-[70%] p-4">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="w-full lg:w-[35%] p-4 bg-blue-300 shadow rounded-lg">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="rounded-full p-2 bg-white">
                      <PiAirplaneTiltThin className="text-3xl text-blue-300" />
                    </div>
                    <h3 className="font-medium text-lg">
                      {featuredSaving ? featuredSaving.label : 'Vacation Fund'}
                    </h3>
                  </div>

                  <div>
                    <h3>
                      <span className="text-lg">
                        {featuredSaving ? formatCurrency(featuredSaving.balance) : '$3,000'}
                      </span> / 
                      <span className="text-base text-gray-700">
                        {featuredSaving ? formatCurrency(featuredSaving.target_amount) : ' $5,000'}
                      </span>
                    </h3>
                  </div>

                  <div className="w-full h-10 bg-blue-100 rounded-lg overflow-hidden mt-5">
                    <div
                      className="h-full bg-gray-500 rounded-lg transition-all duration-500"
                      style={{ width: `${Math.min(featuredProgress, 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-1 mb-4">
                    <h3>In progress</h3>
                    <h3>{featuredProgress.toFixed(0)}%</h3>
                  </div>

                  <div className="border-t border-red-300 my-4"></div>

                  <div className="flex justify-between py-3">
                    <div>
                      <h5 className="text-gray-800">Description</h5>
                    </div>
                    <div className="col-span-2">
                      <h5 className="text-gray-800 text-sm">
                        {featuredSaving ? featuredSaving.description : 'Saving for vacation'}
                      </h5>
                    </div>
                  </div>

                  <div className="flex justify-between py-3">
                    <div>
                      <h5 className="text-gray-800">Created</h5>
                    </div>
                    <div className="col-span-2">
                      <h5 className="text-gray-800">
                        {featuredSaving 
                          ? new Date(featuredSaving.created_at).toLocaleDateString()
                          : '31, December, 2024'
                        }
                      </h5>
                    </div>
                  </div>

                  <div className="flex justify-between py-3">
                    <div>
                      <h5 className="text-gray-800">Remaining</h5>
                    </div>
                    <div className="col-span-2">
                      <h5 className="text-gray-800">
                        {featuredSaving 
                          ? formatCurrency(featuredSaving.target_amount - featuredSaving.balance)
                          : '$2,000'
                        }
                      </h5>
                    </div>
                  </div>

                  <div className="flex justify-between py-3">
                    <div>
                      <h5 className="text-gray-800">Status</h5>
                    </div>
                    <div className="col-span-2">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        featuredSaving?.status === 'active' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {featuredSaving ? featuredSaving.status : 'active'}
                      </span>
                    </div>
                  </div>

                  {/* Quick action button */}
                  <button
                    onClick={handleTotalSavingsClick}
                    className="w-full mt-4 bg-white bg-opacity-20 hover:bg-opacity-30 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <span>View All Plans</span>
                    <BiTrendingUp className="w-4 h-4" />
                  </button>
                </div>

                <div className="w-full lg:w-[65%] p-4 bg-white shadow rounded-lg">
                  <div className="border-gray-500 rounded-xl p-4 shadow-lg my-5">
                    <h1 className="text-base font-semibold mb-3">Saving Tips</h1>
                    <ul className="list-disc list-inside space-y-2">
                      <li className="text-sm">
                        <strong>Mission:</strong> Save consistently to reach your goals faster.
                      </li>
                      <li className="text-sm text-gray-600">
                        Set up automatic transfers to savings accounts.
                      </li>
                      <li className="text-sm text-gray-600">
                        Cut unnecessary subscriptions and redirect to savings.
                      </li>
                      <li className="text-sm text-gray-600">
                        Use the 50/30/20 rule: 50% needs, 30% wants, 20% savings.
                      </li>
                      <li className="text-sm text-gray-600">
                        Track your spending to identify saving opportunities.
                      </li>
                      {savingsData.totalPlans > 0 && (
                        <li className="text-sm text-blue-600 font-medium">
                          You have {savingsData.totalPlans} active savings plans totaling {formatCurrency(savingsData.totalTargets)}!
                        </li>
                      )}
                    </ul>
                  </div>
                  <div>
                    <BalanceChart />
                  </div>
                </div>
              </div>
              <div className="py-10">
                <TransactionsComponent />
              </div>
            </div>
          </div>
        </div>
      </>
    </AuthLayout>
  );
};

export default Savings;