import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import UseFinanceHook from '@/hooks/UseFinance';
import { 
  ChevronDownIcon, 
  PlusIcon, 
  ChartBarIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline';

interface Category {
  name: string;
  amount: number;
  color: string;
  percentage: number;
}

interface CategoryWithAngles extends Category {
  startAngle: number;
  endAngle: number;
}

interface BudgetPeriod {
  id: string;
  label: string;
  startDate: string;
  endDate: string;
  budget_amount?: number;
  income_goal?: number;
}

export default function PieChart() {
  const {
    getExpenseCategories,
    getIncomeCategories,
    getBudgetPeriods,
  } = UseFinanceHook();

  const [periods, setPeriods] = useState<BudgetPeriod[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"expense" | "income">("expense");
  const [expenseData, setExpenseData] = useState<Category[]>([]);
  const [incomeData, setIncomeData] = useState<Category[]>([]);
  const [showBudgetSummary, setShowBudgetSummary] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedPeriod) {
      loadChartDataForPeriod(selectedPeriod);
    }
  }, [selectedPeriod, activeTab]);

  const loadData = async () => {
    try {
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
    }
  };

  const loadChartDataForPeriod = async (periodId: string) => {
    if (!periodId) return;
    
    try {
      const [rawExp, rawInc] = await Promise.all([
        getExpenseCategories(periodId),
        getIncomeCategories(periodId),
      ]);
      
      buildChart(rawExp, setExpenseData);
      buildChart(rawInc, setIncomeData);
    } catch (error) {
      console.error('Error loading chart data for period:', error);
    }
  };

  const buildChart = (
    raw: { category: string; total_amount: number }[],
    set: React.Dispatch<React.SetStateAction<Category[]>>
  ) => {
    const total = raw.reduce((sum, x) => sum + x.total_amount, 0);
    const colors = activeTab === "expense"
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

  const data = activeTab === "expense" ? expenseData : incomeData;
  const totalAmount = data.reduce((sum, d) => sum + d.amount, 0);

  const currentPlan = periods.find((p) => p.id === selectedPeriod);

  // Budget calculations
  const budgetAmount = currentPlan?.budget_amount || 0;
  const incomeGoal = currentPlan?.income_goal || 0;
  
  const budgetRemaining = activeTab === 'expense' 
    ? Math.max(0, budgetAmount - totalAmount)
    : 0;
    
  const isOverBudget = activeTab === 'expense' && totalAmount > budgetAmount;
  
  const incomeProgress = activeTab === 'income' && incomeGoal > 0
    ? Math.round((totalAmount / incomeGoal) * 100)
    : 0;

  // Calculate totals for budget summary
  const totalExpenses = expenseData.reduce((sum, d) => sum + d.amount, 0);
  const totalIncome = incomeData.reduce((sum, d) => sum + d.amount, 0);
  const netAmount = totalIncome - totalExpenses;

  const dataWithAngles: CategoryWithAngles[] = data.map((item, idx) => {
    const prevAngle = data
      .slice(0, idx)
      .reduce((sum, e) => sum + e.percentage * 3.6, 0);
    return {
      ...item,
      startAngle: prevAngle,
      endAngle: prevAngle + item.percentage * 3.6,
    };
  });

  const generatePieSegment = (start: number, end: number, r: number, ir: number) => {
    const spacing = 2;
    const a1 = (start + spacing / 2 - 90) * Math.PI / 180;
    const a2 = (end - spacing / 2 - 90) * Math.PI / 180;
    const x1 = r * Math.cos(a1), y1 = r * Math.sin(a1);
    const x2 = r * Math.cos(a2), y2 = r * Math.sin(a2);
    const x3 = ir * Math.cos(a2), y3 = ir * Math.sin(a2);
    const x4 = ir * Math.cos(a1), y4 = ir * Math.sin(a1);
    const large = end - start > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${x3} ${y3} A ${ir} ${ir} 0 ${large} 0 ${x4} ${y4} Z`;
  };

  const openBudgetSummary = () => {
    setShowBudgetSummary(true);
  };

  const closeBudgetSummary = () => {
    setShowBudgetSummary(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header Section */}
      <div className="p-4 lg:p-6 border-b border-gray-200">
        <div className="flex flex-col space-y-3">
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <h2 className="text-lg lg:text-xl font-semibold text-gray-900">Statistics</h2>
              {currentPlan && (
                <button
                  onClick={openBudgetSummary}
                  className="flex items-center space-x-1 px-2 py-1 text-xs text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-md transition-colors"
                >
                  <ChartBarIcon className="w-3 h-3" />
                  <span>Summary</span>
                </button>
              )}
            </div>
            <div className="relative w-full">
              <select
                className="w-full bg-white border border-gray-300 px-3 py-2 pr-8 rounded-lg text-xs lg:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none truncate"
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

          <div className="flex bg-gray-100 p-1 rounded-lg w-full">
            <button
              className={`flex-1 px-2 py-1.5 text-xs lg:text-sm font-medium rounded-md transition-all duration-200 ${
                activeTab === 'expense'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setActiveTab('expense')}
            >
              Expenses
            </button>
            <button
              className={`flex-1 px-2 py-1.5 text-xs lg:text-sm font-medium rounded-md transition-all duration-200 ${
                activeTab === 'income'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setActiveTab('income')}
            >
              Income
            </button>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 lg:p-6">
        <div className="flex flex-col items-center space-y-6">
          {/* Pie Chart */}
          <div className="flex flex-col items-center w-full">
            <div className="relative w-48 h-48 lg:w-56 lg:h-56 mb-4">
              <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-white rounded-full border-4 border-gray-50" style={{ width: '100px', height: '100px', margin: 'auto' }}>
                <p className="text-[8px] lg:text-[10px] text-gray-500 uppercase tracking-wide text-center">
                  {activeTab === 'expense' ? 'Spent' : 'Earned'}
                </p>
                <p className={`font-bold text-xs lg:text-sm ${isOverBudget ? 'text-red-600' : 'text-gray-900'}`}>
                  ${totalAmount.toLocaleString()}
                </p>
                
                {/* Budget info in center */}
                {((activeTab === 'expense' && budgetAmount > 0) || (activeTab === 'income' && incomeGoal > 0)) && (
                  <div className="text-center">
                    {activeTab === 'expense' ? (
                      <div>
                        <p className={`text-[6px] ${isOverBudget ? 'text-red-500' : 'text-green-500'}`}>
                          {isOverBudget ? 'Over Budget' : 'Remaining'}
                        </p>
                        <p className={`text-[6px] font-medium ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}>
                          ${isOverBudget ? (totalAmount - budgetAmount).toLocaleString() : budgetRemaining.toLocaleString()}
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-[6px] text-blue-500">Goal Progress</p>
                        <p className="text-[6px] font-medium text-blue-600">{incomeProgress}%</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <svg viewBox="-100 -100 200 200" className="w-full h-full transform -rotate-90">
                {dataWithAngles.map(d => (
                  <path
                    key={d.name}
                    d={generatePieSegment(d.startAngle, d.endAngle, 90, 45)}
                    fill={d.color}
                    stroke="#fff"
                    strokeWidth="3"
                    className="hover:opacity-80 transition-opacity cursor-pointer"
                  />
                ))}
              </svg>
            </div>

            {/* Empty State */}
            {data.length === 0 && (
              <div className="text-center py-6">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <PlusIcon className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-gray-500 text-xs">No {activeTab} data</p>
                <p className="text-gray-400 text-[10px] mt-1">Add items to see chart</p>
              </div>
            )}
          </div>

          {/* Legend and Items */}
          <div className="w-full space-y-3">
            <div className="space-y-2 max-h-48 lg:max-h-64 overflow-y-auto pr-1">
              {dataWithAngles.map(d => (
                <div key={d.name} className="flex items-center justify-between p-2 lg:p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-2 min-w-0">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: d.color }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-gray-900 capitalize truncate">{d.name}</p>
                      <p className="text-[10px] text-gray-500">{d.percentage}%</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-semibold text-gray-900">
                      ${d.amount > 999 ? `${(d.amount / 1000).toFixed(1)}k` : d.amount.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Budget Summary */}
            {currentPlan && ((activeTab === 'expense' && budgetAmount > 0) || (activeTab === 'income' && incomeGoal > 0)) && (
              <div className="pt-3 border-t border-gray-200">
                <h4 className="text-xs font-medium text-gray-700 mb-2">
                  Budget Overview - {currentPlan.label}
                </h4>
                
                {activeTab === 'expense' ? (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Budget Limit:</span>
                      <span className="font-medium">${budgetAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Total Spent:</span>
                      <span className={`font-medium ${isOverBudget ? 'text-red-600' : 'text-gray-900'}`}>
                        ${totalAmount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>{isOverBudget ? 'Over Budget:' : 'Remaining:'}</span>
                      <span className={`font-medium ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}>
                        ${isOverBudget ? (totalAmount - budgetAmount).toLocaleString() : budgetRemaining.toLocaleString()}
                      </span>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${isOverBudget ? 'bg-red-500' : 'bg-blue-500'}`}
                        style={{ width: `${Math.min(100, (totalAmount / budgetAmount) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Income Goal:</span>
                      <span className="font-medium">${incomeGoal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Total Earned:</span>
                      <span className="font-medium text-gray-900">${totalAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Progress:</span>
                      <span className="font-medium text-blue-600">{incomeProgress}%</span>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full bg-green-500"
                        style={{ width: `${Math.min(100, incomeProgress)}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Add Buttons */}
            <div className="pt-3 border-t border-gray-200 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/add-expense"
                  className="flex items-center justify-center space-x-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  <PlusIcon className="w-4 h-4" />
                  <span>Add Expense</span>
                </Link>
                <Link
                  to="/add-income"
                  className="flex items-center justify-center space-x-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  <PlusIcon className="w-4 h-4" />
                  <span>Add Income</span>
                </Link>
              </div>
              {periods.length === 0 && (
                <p className="text-[10px] text-red-600 text-center mt-1">Create a budget plan first</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Budget Summary Modal - keeping this as is */}
      {showBudgetSummary && currentPlan && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={closeBudgetSummary}></div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full mx-4">
              <div className="bg-white px-6 pt-6 pb-4">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                    <ChartBarIcon className="w-5 h-5 text-indigo-600" />
                    <span>Budget Summary</span>
                  </h3>
                  <button
                    type="button"
                    onClick={closeBudgetSummary}
                    className="text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-1">{currentPlan.label}</h4>
                  <p className="text-sm text-gray-500">
                    {currentPlan.startDate && currentPlan.endDate && (
                      `${new Date(currentPlan.startDate).toLocaleDateString()} - ${new Date(currentPlan.endDate).toLocaleDateString()}`
                    )}
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Income Section */}
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h5 className="font-medium text-green-800 mb-3 flex items-center justify-between">
                      <span>Income</span>
                      <span className="text-green-600">${totalIncome.toLocaleString()}</span>
                    </h5>
                    
                    {incomeGoal > 0 && (
                      <div className="mb-2">
                        <div className="flex justify-between text-sm text-green-700 mb-1">
                          <span>Goal: ${incomeGoal.toLocaleString()}</span>
                          <span>{Math.round((totalIncome / incomeGoal) * 100)}%</span>
                        </div>
                        <div className="w-full bg-green-200 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full bg-green-500"
                            style={{ width: `${Math.min(100, (totalIncome / incomeGoal) * 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    <div className="space-y-1 text-sm">
                      {incomeData.map(item => (
                        <div key={item.name} className="flex justify-between text-green-700">
                          <span className="capitalize">{item.name}:</span>
                          <span>${item.amount.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Expense Section */}
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <h5 className="font-medium text-red-800 mb-3 flex items-center justify-between">
                      <span>Expenses</span>
                      <span className="text-red-600">${totalExpenses.toLocaleString()}</span>
                    </h5>

                    {budgetAmount > 0 && (
                      <div className="mb-2">
                        <div className="flex justify-between text-sm text-red-700 mb-1">
                          <span>Budget: ${budgetAmount.toLocaleString()}</span>
                          <span>{Math.round((totalExpenses / budgetAmount) * 100)}%</span>
                        </div>
                        <div className="w-full bg-red-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${totalExpenses > budgetAmount ? 'bg-red-600' : 'bg-red-500'}`}
                            style={{ width: `${Math.min(100, (totalExpenses / budgetAmount) * 100)}%` }}
                          ></div>
                        </div>
                        {totalExpenses > budgetAmount && (
                          <p className="text-xs text-red-600 mt-1">
                            Over budget by ${(totalExpenses - budgetAmount).toLocaleString()}
                          </p>
                        )}
                      </div>
                    )}

                    <div className="space-y-1 text-sm">
                      {expenseData.map(item => (
                        <div key={item.name} className="flex justify-between text-red-700">
                          <span className="capitalize">{item.name}:</span>
                          <span>${item.amount.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Net Amount */}
                  <div className={`p-4 rounded-lg border ${netAmount >= 0 ? 'bg-blue-50 border-blue-200' : 'bg-orange-50 border-orange-200'}`}>
                    <div className="flex justify-between items-center">
                      <span className={`font-medium ${netAmount >= 0 ? 'text-blue-800' : 'text-orange-800'}`}>
                        Net Amount:
                      </span>
                      <span className={`font-bold text-lg ${netAmount >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                        {netAmount >= 0 ? '+' : ''}${netAmount.toLocaleString()}
                      </span>
                    </div>
                    <p className={`text-xs mt-1 ${netAmount >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                      {netAmount >= 0 ? 'You have a positive balance' : 'You are spending more than earning'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-6 py-3">
                <button
                  onClick={closeBudgetSummary}
                  className="w-full inline-flex justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}