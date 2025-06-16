import { useState, useEffect } from 'react';
import { ChevronDownIcon, ChartBarIcon, ArrowTrendingUpIcon as TrendingUpIcon, ArrowTrendingDownIcon as TrendingDownIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import UseFinanceHook from '@/hooks/UseFinance';
import { AuthLayout } from '../Layout/layout';

interface Category {
  name: string;
  amount: number;
  color: string;
  percentage: number;
}

interface BudgetPeriod {
  id: string;
  label: string;
  startDate: string;
  endDate: string;
  budget_amount?: number;
  income_goal?: number;
}

export default function BudgetSummary() {
  const {
    getExpenseCategories,
    getIncomeCategories,
    getBudgetPeriods,
  } = UseFinanceHook();

  const [periods, setPeriods] = useState<BudgetPeriod[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<string>("");
  const [expenseData, setExpenseData] = useState<Category[]>([]);
  const [incomeData, setIncomeData] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedPeriod) {
      loadPeriodData(selectedPeriod);
    }
  }, [selectedPeriod]);

  const loadData = async () => {
    try {
      setLoading(true);
      const rawPeriods = await getBudgetPeriods();
      
      const mappedPeriods = rawPeriods.map((p: any) => ({
        id: p.id,
        label: p.label,
        startDate: p.startDate || "",
        endDate: p.endDate || "",
        budget_amount: p.budget_amount || 0,
        income_goal: p.income_goal || 0,
      }));
      
      setPeriods(mappedPeriods);
      
      if (mappedPeriods.length > 0) {
        setSelectedPeriod(mappedPeriods[0].id);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPeriodData = async (periodId: string) => {
    if (!periodId) return;
    
    try {
      const [rawExp, rawInc] = await Promise.all([
        getExpenseCategories(periodId),
        getIncomeCategories(periodId),
      ]);
      
      buildChart(rawExp, setExpenseData, 'expense');
      buildChart(rawInc, setIncomeData, 'income');
    } catch (error) {
      console.error('Error loading period data:', error);
    }
  };

  const buildChart = (
    raw: { category: string; total_amount: number }[],
    set: React.Dispatch<React.SetStateAction<Category[]>>,
    type: 'expense' | 'income'
  ) => {
    const total = raw.reduce((sum, x) => sum + x.total_amount, 0);
    const colors = type === "expense"
      ? ["#EF4444", "#F59E0B", "#10B981", "#3B82F6", "#8B5CF6", "#F97316"]
      : ["#10B981", "#3B82F6", "#8B5CF6", "#F59E0B", "#EF4444", "#06B6D4"];

    set(
      raw.map((x, i) => ({
        name: x.category,
        amount: x.total_amount,
        color: colors[i % colors.length],
        percentage: total ? Math.round((x.total_amount / total) * 100) : 0,
      }))
    );
  };

  const currentPlan = periods.find((p) => p.id === selectedPeriod);
  const budgetAmount = currentPlan?.budget_amount || 0;
  const incomeGoal = currentPlan?.income_goal || 0;

  const totalExpenses = expenseData.reduce((sum, d) => sum + d.amount, 0);
  const totalIncome = incomeData.reduce((sum, d) => sum + d.amount, 0);
  const netAmount = totalIncome - totalExpenses;

  const budgetRemaining = Math.max(0, budgetAmount - totalExpenses);
  const isOverBudget = totalExpenses > budgetAmount && budgetAmount > 0;
  const incomeProgress = incomeGoal > 0 ? Math.round((totalIncome / incomeGoal) * 100) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
   <AuthLayout>
     <div className="space-y-6 px-4">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <ChartBarIcon className="w-7 h-7 text-indigo-600" />
              Budget Summary
            </h1>
            <p className="text-gray-600 mt-1">Comprehensive overview of your financial performance</p>
          </div>

          <div className="lg:w-64">
            <div className="relative">
              <select
                className="w-full bg-white border border-gray-300 px-3 py-2 pr-8 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
              >
                <option value="">Select Period</option>
                {periods.map((period) => (
                  <option key={period.id} value={period.id}>
                    {period.label}
                  </option>
                ))}
              </select>
              <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {currentPlan && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900">{currentPlan.label}</h3>
            {currentPlan.startDate && currentPlan.endDate && (
              <p className="text-sm text-gray-500">
                {new Date(currentPlan.startDate).toLocaleDateString()} - {new Date(currentPlan.endDate).toLocaleDateString()}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Income */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Income</p>
              <p className="text-2xl font-bold text-green-600">${totalIncome.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <TrendingUpIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
          {incomeGoal > 0 && (
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Goal: ${incomeGoal.toLocaleString()}</span>
                <span>{incomeProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 rounded-full bg-green-500"
                  style={{ width: `${Math.min(100, incomeProgress)}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Total Expenses */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Expenses</p>
              <p className={`text-2xl font-bold ${isOverBudget ? 'text-red-600' : 'text-red-500'}`}>
                ${totalExpenses.toLocaleString()}
              </p>
            </div>
            <div className={`p-3 rounded-full ${isOverBudget ? 'bg-red-100' : 'bg-red-50'}`}>
              <TrendingDownIcon className={`w-6 h-6 ${isOverBudget ? 'text-red-600' : 'text-red-500'}`} />
            </div>
          </div>
          {budgetAmount > 0 && (
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Budget: ${budgetAmount.toLocaleString()}</span>
                <span>{Math.round((totalExpenses / budgetAmount) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${isOverBudget ? 'bg-red-600' : 'bg-red-500'}`}
                  style={{ width: `${Math.min(100, (totalExpenses / budgetAmount) * 100)}%` }}
                ></div>
              </div>
              {isOverBudget && (
                <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                  <ExclamationTriangleIcon className="w-3 h-3" />
                  Over budget by ${(totalExpenses - budgetAmount).toLocaleString()}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Net Amount */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Net Amount</p>
              <p className={`text-2xl font-bold ${netAmount >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                {netAmount >= 0 ? '+' : ''}${Math.abs(netAmount).toLocaleString()}
              </p>
            </div>
            <div className={`p-3 rounded-full ${netAmount >= 0 ? 'bg-blue-100' : 'bg-orange-100'}`}>
              <ChartBarIcon className={`w-6 h-6 ${netAmount >= 0 ? 'text-blue-600' : 'text-orange-600'}`} />
            </div>
          </div>
          <p className={`text-xs mt-2 ${netAmount >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
            {netAmount >= 0 ? 'Positive balance' : 'Spending exceeds income'}
          </p>
        </div>

        {/* Budget Remaining */}
        {budgetAmount > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {isOverBudget ? 'Over Budget' : 'Remaining'}
                </p>
                <p className={`text-2xl font-bold ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}>
                  ${isOverBudget ? (totalExpenses - budgetAmount).toLocaleString() : budgetRemaining.toLocaleString()}
                </p>
              </div>
              <div className={`p-3 rounded-full ${isOverBudget ? 'bg-red-100' : 'bg-green-100'}`}>
                <ExclamationTriangleIcon className={`w-6 h-6 ${isOverBudget ? 'text-red-600' : 'text-green-600'}`} />
              </div>
            </div>
            <p className={`text-xs mt-2 ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}>
              {isOverBudget ? 'Budget exceeded' : 'Within budget'}
            </p>
          </div>
        )}
      </div>

      {/* Category Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income Breakdown */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Income Breakdown</h3>
          
          {incomeData.length > 0 ? (
            <div className="space-y-3">
              {incomeData.map((item) => (
                <div key={item.name} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <div>
                      <p className="font-medium text-gray-900 capitalize">{item.name}</p>
                      <p className="text-sm text-gray-600">{item.percentage}% of total</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">${item.amount.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <TrendingUpIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p>No income data available</p>
              <p className="text-sm">Add income items to see breakdown</p>
            </div>
          )}
        </div>

        {/* Expense Breakdown */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Expense Breakdown</h3>
          
          {expenseData.length > 0 ? (
            <div className="space-y-3">
              {expenseData.map((item) => (
                <div key={item.name} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <div>
                      <p className="font-medium text-gray-900 capitalize">{item.name}</p>
                      <p className="text-sm text-gray-600">{item.percentage}% of total</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-red-600">${item.amount.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <TrendingDownIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p>No expense data available</p>
              <p className="text-sm">Add expense items to see breakdown</p>
            </div>
          )}
        </div>
      </div>

      {/* Summary Insights */}
      {(incomeData.length > 0 || expenseData.length > 0) && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Insights</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Largest Income Category */}
            {incomeData.length > 0 && (
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-medium text-green-800 mb-2">Top Income Source</h4>
                <p className="text-sm text-green-700 capitalize">
                  {incomeData[0]?.name} - ${incomeData[0]?.amount.toLocaleString()}
                </p>
                <p className="text-xs text-green-600">{incomeData[0]?.percentage}% of total income</p>
              </div>
            )}

            {/* Largest Expense Category */}
            {expenseData.length > 0 && (
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <h4 className="font-medium text-red-800 mb-2">Top Expense Category</h4>
                <p className="text-sm text-red-700 capitalize">
                  {expenseData[0]?.name} - ${expenseData[0]?.amount.toLocaleString()}
                </p>
                <p className="text-xs text-red-600">{expenseData[0]?.percentage}% of total expenses</p>
              </div>
            )}

            {/* Savings Rate */}
            {totalIncome > 0 && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-800 mb-2">Savings Rate</h4>
                <p className="text-sm text-blue-700">
                  {Math.round((netAmount / totalIncome) * 100)}% of income
                </p>
                <p className="text-xs text-blue-600">
                  {netAmount >= 0 ? 'Good savings rate!' : 'Consider reducing expenses'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* No Data State */}
      {!currentPlan && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <ChartBarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Budget Period Selected</h3>
          <p className="text-gray-600">Please select a budget period to view the summary.</p>
        </div>
      )}
    </div>
   </AuthLayout>
  );
}