import { useState, useEffect } from 'react';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import { DailyLimitProps } from '@/types';
import UseFinanceHook from "@/hooks/UseFinance";

export default function DailyLimit({ 
  currency = '$' 
}: Omit<DailyLimitProps, 'spentAmount' | 'limit'>) {
    const [showOptions, setShowOptions] = useState(false);
    const [totalBudget, setTotalBudget] = useState(0);
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalExpenses, setTotalExpenses] = useState(0);
    const [loading, setLoading] = useState(false);
    
    const {
        getBudgetPlans,
        getBudgetPlansId,
    } = UseFinanceHook();

    useEffect(() => {
        loadFinancialData();
    }, []);

    const loadFinancialData = async () => {
        setLoading(true);
        try {
            const plans = await getBudgetPlans();
            
            if (!plans || !Array.isArray(plans)) {
                console.warn('No plans data received');
                return;
            }

            let combinedBudget = 0;
            let combinedIncome = 0;
            let combinedExpenses = 0;

            // Calculate totals from all budget plans
            for (const plan of plans) {
                combinedBudget += Number(plan.budget_amount || 0);
                
                try {
                    const planDetails = await getBudgetPlansId(plan.id);
                    
                    if (planDetails) {
                        let incomeData = [];
                        let expenseData = [];

                        // Extract income and expense data from various possible structures
                        if (planDetails.data) {
                            if (planDetails.data.income && Array.isArray(planDetails.data.income)) {
                                incomeData = planDetails.data.income;
                            }
                            if (planDetails.data.expense && Array.isArray(planDetails.data.expense)) {
                                expenseData = planDetails.data.expense;
                            }
                        }

                        if (planDetails.income && Array.isArray(planDetails.income)) {
                            incomeData = planDetails.income;
                        }
                        
                        if (planDetails.expense && Array.isArray(planDetails.expense)) {
                            expenseData = planDetails.expense;
                        }

                        // Sum up income amounts
                        const planIncome = incomeData.reduce((sum: number, item: any) => {
                            const amount = Number(item.amount || item.value || 0);
                            return sum + amount;
                        }, 0);

                        // Sum up expense amounts
                        const planExpenses = expenseData.reduce((sum: number, item: any) => {
                            const amount = Number(item.amount || item.value || 0);
                            return sum + amount;
                        }, 0);

                        combinedIncome += planIncome;
                        combinedExpenses += planExpenses;
                    }
                } catch (error) {
                    console.warn('Could not fetch details for plan:', plan.id, error);
                }
            }

            setTotalBudget(combinedBudget);
            setTotalIncome(combinedIncome);
            setTotalExpenses(combinedExpenses);

        } catch (error) {
            console.error('Error loading financial data:', error);
        } finally {
            setLoading(false);
        }
    };
    
    // Calculate daily limit based on total budget
    const dailyLimit = totalBudget > 0 ? Math.round(totalBudget / 30) : 0; // Assuming 30 days per month
    
    // Calculate daily spent (using expenses as "spent amount")
    const dailySpent = Math.round(totalExpenses / 30); // Average daily expenses
    
    // Calculate percentage spent against daily limit
    const percentageSpent = dailyLimit > 0 ? Math.min(Math.round((dailySpent / dailyLimit) * 100), 100) : 0;
    
    // Determine status based on spending vs income
    const netAmount = totalIncome - totalExpenses;
    const isOverBudget = dailySpent > dailyLimit;
    const isDeficit = netAmount < 0;
    
    // Format currency values
    const formatCurrency = (value: number) => {
        return `${currency}${Math.abs(value).toLocaleString()}`;
    };

    // Get appropriate colors based on financial status
    const getProgressColor = () => {
        if (isDeficit) return 'bg-black';
        if (isOverBudget) return 'bg-red-500';
        return 'bg-blue-500';
    };

  
    
    return (
        <div className="bg-gray-50 p-4 rounded-lg shadow-md my-10">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-800 text-xs">Daily Limit</h3>
                
                <div className="relative">
                    <button 
                        onClick={() => setShowOptions(!showOptions)}
                        className="p-1 rounded-full hover:bg-gray-100"
                        disabled={loading}
                    >
                        <EllipsisVerticalIcon className="h-5 w-5 text-gray-600" />
                    </button>
                    
                    {showOptions && (
                        <div className="absolute right-0 mt-1 w-40 bg-white rounded-md shadow-lg z-10 border">
                            <div className="py-1">
                                <button 
                                    onClick={() => {
                                        setShowOptions(false);
                                        loadFinancialData(); // Refresh data
                                    }}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    Refresh Data
                                </button>
                            
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            {loading ? (
                <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <span className="text-xs text-gray-500">Loading financial data...</span>
                </div>
            ) : (
                <>
                    <div className="mb-2">
                        <span className="text-sm font-bold text-gray-800">{formatCurrency(dailySpent)}</span>
                        <span className="text-xs text-gray-500 ml-1">spent of {formatCurrency(dailyLimit)} daily limit</span>
                    </div>
                    
                    {/* Budget Overview */}
                    <div className="mb-3 text-xs text-gray-600 bg-white p-2 rounded">
                        <div className="grid grid-cols-3 gap-2 text-center">
                            <div>
                                <p className="text-gray-500">Total Budget</p>
                                <p className="font-semibold">{formatCurrency(totalBudget)}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Income</p>
                                <p className="font-semibold text-green-600">{formatCurrency(totalIncome)}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Expenses</p>
                                <p className="font-semibold text-red-600">{formatCurrency(totalExpenses)}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="w-full h-2 bg-gray-300 rounded-full overflow-hidden">
                        <div 
                            className={`h-full rounded-full ${getProgressColor()}`}
                            style={{ width: `${percentageSpent}%` }}
                        ></div>
                    </div>
                    
                    <div className="flex justify-between mt-2">
                        <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500">{percentageSpent}% Used</span>
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                                isDeficit 
                                    ? 'bg-black text-white' 
                                    : isOverBudget
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-blue-100 text-blue-800'
                            }`}>
                                {isDeficit ? 'Budget' : isOverBudget ? 'Over Limit' : 'On Track'}
                            </span>
                        </div>
                        <span className="text-xs text-gray-500">
                            {formatCurrency(Math.max(0, dailyLimit - dailySpent))} Remaining
                        </span>
                    </div>

                    {/* Net Amount Display */}
                    <div className="mt-2 text-center">
                        <span className="text-xs text-gray-500">Net Amount: </span>
                        <span className={`text-xs font-semibold ${netAmount >= 0 ? 'text-blue-600' : 'text-black'}`}>
                            {netAmount < 0 ? '-' : ''}{formatCurrency(netAmount)}
                        </span>
                    </div>
                </>
            )}
        </div>
    );
}