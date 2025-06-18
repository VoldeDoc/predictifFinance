import React, { useState, useRef, useEffect } from 'react';
import UseFinanceHook from '@/hooks/UseFinance';

interface YearData {
  incomeData: number[];
  expenseData: number[];
}

interface TooltipInfo {
  visible: boolean;
  x: number;
  y: number;
  month: string;
  income: number;
  expense: number;
  net: number;
}

interface CategoryData {
  category: string;
  total_amount: number;
}

interface BudgetPeriod {
  id: string;
  label: string;
  startDate: string;
  endDate: string;
  budget_amount?: number;
  income_goal?: number;
}

export function CashFlow() {
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [periods, setPeriods] = useState<BudgetPeriod[]>([]);
  const [tooltip, setTooltip] = useState<TooltipInfo>({
    visible: false,
    x: 0,
    y: 0,
    month: '',
    income: 0,
    expense: 0,
    net: 0
  });
  const [loading, setLoading] = useState(true);
  const [cashFlowData, setCashFlowData] = useState<YearData>({
    incomeData: [6800, 7000, 7200, 7500, 8000, 8200, 8500, 9000, 9200, 9500, 9800, 10000],
    expenseData: [5200, 5500, 5800, 6000, 6200, 6500, 6800, 7000, 7200, 7500, 7800, 8000]
  });
  
  const chartRef = useRef<HTMLDivElement>(null);
  
  const { 
    getIncomeCategories, 
    getExpenseCategories, 
    getBudgetPeriods 
  } = UseFinanceHook();
  
  // Months labels for x-axis
  const monthLabels = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  // Fallback data when no API data is available
  const fallbackData: YearData = {
    incomeData: [6800, 7000, 7200, 7500, 8000, 8200, 8500, 9000, 9200, 9500, 9800, 10000],
    expenseData: [5200, 5500, 5800, 6000, 6200, 6500, 6800, 7000, 7200, 7500, 7800, 8000]
  };

  useEffect(() => {
    loadPeriods();
  }, []);

  useEffect(() => {
    if (selectedPeriod) {
      loadCashFlowData(selectedPeriod);
    }
  }, [selectedPeriod]);

  const loadPeriods = async () => {
    try {
      setLoading(true);
      const rawPeriods = await getBudgetPeriods() as { data?: any[] } | any[];
      console.log('Raw periods for cash flow:', rawPeriods);
      
      let periodsArray: any[] = [];
      if (Array.isArray(rawPeriods)) {
        periodsArray = rawPeriods;
      } else if (rawPeriods && typeof rawPeriods === 'object' && 'data' in rawPeriods && Array.isArray(rawPeriods.data)) {
        periodsArray = rawPeriods.data;
      }
      
      const mappedPeriods: BudgetPeriod[] = periodsArray.map((p: any) => ({
        id: String(p.id || p.period_id || Math.random()),
        label: String(p.label || p.name || p.title || `Period ${p.id}`),
        startDate: String(p.startDate || p.start_date || ""),
        endDate: String(p.endDate || p.end_date || ""),
        budget_amount: Number(p.budget_amount || p.budgetAmount || 0),
        income_goal: Number(p.income_goal || p.incomeGoal || 0),
      }));
      
      setPeriods(mappedPeriods);
      
      if (mappedPeriods.length > 0) {
        setSelectedPeriod(mappedPeriods[0].id);
      } else {
        // If no periods, use fallback data
        setCashFlowData(fallbackData);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error loading periods:', error);
      setCashFlowData(fallbackData);
      setLoading(false);
    }
  };

  const loadCashFlowData = async (periodId: string) => {
    if (!periodId) return;
    
    try {
      setLoading(true);
      
      // Define a type for the API response
      type ApiResponse = { data?: CategoryData[] } | CategoryData[] | null;
      
      // Fetch both income and expense categories for the selected period
      const [incomeResponse, expenseResponse] = await Promise.all([
        getIncomeCategories(periodId).catch(() => null) as ApiResponse,
        getExpenseCategories(periodId).catch(() => null) as ApiResponse
      ]);

      console.log('Income response:', incomeResponse);
      console.log('Expense response:', expenseResponse);

      // Process income data
      let incomeCategories: CategoryData[] = [];
      if (incomeResponse) {
        if (Array.isArray(incomeResponse)) {
          incomeCategories = incomeResponse;
        } else if (incomeResponse?.data && Array.isArray(incomeResponse.data)) {
          incomeCategories = incomeResponse.data;
        }
      }

      // Process expense data
      let expenseCategories: CategoryData[] = [];
      if (expenseResponse) {
        if (Array.isArray(expenseResponse)) {
          expenseCategories = expenseResponse;
        } else if (expenseResponse?.data && Array.isArray(expenseResponse.data)) {
          expenseCategories = expenseResponse.data;
        }
      }

      // Calculate total income and expenses
      const totalIncome = incomeCategories.reduce((sum, category) => {
        return sum + Number(category.total_amount || 0);
      }, 0);
      
      const totalExpenses = expenseCategories.reduce((sum, category) => {
        return sum + Number(category.total_amount || 0);
      }, 0);

      console.log('Total Income:', totalIncome);
      console.log('Total Expenses:', totalExpenses);

      // If we have real data, use it; otherwise use fallback
      if (totalIncome > 0 || totalExpenses > 0) {
        const monthlyIncome = distributeAcrossMonths(totalIncome);
        const monthlyExpenses = distributeAcrossMonths(totalExpenses);

        setCashFlowData({
          incomeData: monthlyIncome,
          expenseData: monthlyExpenses
        });
      } else {
        setCashFlowData(fallbackData);
      }

    } catch (error) {
      console.error('Error loading cash flow data:', error);
      setCashFlowData(fallbackData);
    } finally {
      setLoading(false);
    }
  };

  // Distribute total amount across 12 months with some variation
  const distributeAcrossMonths = (totalAmount: number): number[] => {
    if (totalAmount === 0) {
      return new Array(12).fill(0);
    }

    const baseAmount = totalAmount / 12;
    const months: number[] = [];
    
    for (let i = 0; i < 12; i++) {
      // Add some realistic variation (+/- 20%)
      const variation = (Math.random() - 0.5) * 0.4;
      const monthAmount = Math.max(0, baseAmount * (1 + variation));
      months.push(Math.round(monthAmount));
    }
    
    // Adjust the last month to ensure total matches exactly
    const currentTotal = months.reduce((sum, amount) => sum + amount, 0);
    const difference = totalAmount - currentTotal;
    months[11] = Math.max(0, months[11] + difference);
    
    return months;
  };

  // Get maximum value for scaling
  const getMaxValue = (): number => {
    const allValues = [...cashFlowData.incomeData, ...cashFlowData.expenseData];
    const maxValue = Math.max(...allValues);
    return Math.max(maxValue, 1000); // Minimum 1000 for scaling
  };

  // Calculate net cash flow
  const netCashFlow = cashFlowData.incomeData.map((income, index) => 
    income - cashFlowData.expenseData[index]
  );

  // Handle mouse over for tooltips
  const handleMouseOver = (event: React.MouseEvent, index: number) => {
    if (!chartRef.current) return;
    
    const rect = chartRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    setTooltip({
      visible: true,
      x: x,
      y: y,
      month: monthLabels[index],
      income: cashFlowData.incomeData[index],
      expense: cashFlowData.expenseData[index],
      net: cashFlowData.incomeData[index] - cashFlowData.expenseData[index]
    });
  };

  const handleMouseOut = () => {
    setTooltip(prev => ({ ...prev, visible: false }));
  };

  const maxValue = getMaxValue();
  const currentPeriod = periods.find(p => p.id === selectedPeriod);
  const totalIncome = cashFlowData.incomeData.reduce((a, b) => a + b, 0);
  const totalExpenses = cashFlowData.expenseData.reduce((a, b) => a + b, 0);
  const totalNetFlow = netCashFlow.reduce((a, b) => a + b, 0);
  
  if (loading) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-sm mt-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading cash flow...</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mt-6 overflow-hidden">
      {/* Header with title, legend and period selector */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 gap-3">
          <h2 className="text-lg font-semibold">Cash Flow</h2>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            {periods.length > 0 ? (
              <select 
                value={selectedPeriod} 
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="py-1 px-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Period</option>
                {periods.map((period) => (
                  <option key={period.id} value={period.id}>
                    {period.label}
                  </option>
                ))}
              </select>
            ) : (
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-md">
                Using demo data
              </span>
            )}
          </div>
        </div>
        
        {/* Period info */}
        {currentPeriod && (
          <div className="mb-3 p-2 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>{currentPeriod.label}</strong>
              {currentPeriod.startDate && currentPeriod.endDate && (
                <span className="ml-2">
                  ({new Date(currentPeriod.startDate).toLocaleDateString()} - {new Date(currentPeriod.endDate).toLocaleDateString()})
                </span>
              )}
            </p>
          </div>
        )}
        
        {/* Legend */}
        <div className="flex items-center">
          <div className="flex items-center mr-4">
            <div className="w-3 h-3 bg-blue-500 mr-1"></div>
            <span className="text-xs">Income</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-900 mr-1"></div>
            <span className="text-xs">Expense</span>
          </div>
        </div>
      </div>
      
      {/* Chart container with fixed height */}
      <div className="flex w-full mt-3">
        {/* Y-axis labels */}
        <div className="flex flex-col justify-between h-[250px] pr-2 text-xs text-gray-500 flex-shrink-0">
          <div>${Math.round(maxValue).toLocaleString()}</div>
          <div>${Math.round(maxValue * 0.75).toLocaleString()}</div>
          <div>${Math.round(maxValue * 0.5).toLocaleString()}</div>
          <div>${Math.round(maxValue * 0.25).toLocaleString()}</div>
          <div>$0</div>
          <div>-${Math.round(maxValue * 0.25).toLocaleString()}</div>
        </div>
        
        {/* Bar chart */}
        <div className="flex-1 relative" ref={chartRef}>
          {/* Zero line */}
          <div 
            className="absolute w-full h-[1px] bg-gray-400" 
            style={{ top: '80%' }}
          ></div>
          
          <div className="h-[250px] flex items-center">
            {monthLabels.map((month, index) => {
              const incomeHeight = Math.max((cashFlowData.incomeData[index] / maxValue) * 80, 0);
              const expenseHeight = Math.max((cashFlowData.expenseData[index] / maxValue) * 80, 0);
              
              return (
                <div 
                  key={month} 
                  className="flex-1 h-full relative cursor-pointer hover:bg-gray-50"
                  onMouseOver={(e) => handleMouseOver(e, index)}
                  onMouseOut={handleMouseOut}
                >
                  <div className="absolute left-0 right-0 mx-auto w-[70%] h-full">
                    {/* Income bar */}
                    <div 
                      className="absolute bottom-[20%] w-1/2"
                      style={{
                        height: `${incomeHeight}%`,
                      }}
                    >
                      <div className="bg-blue-500 w-full h-full rounded-t-sm hover:bg-blue-600 transition-colors"></div>
                    </div>
                    
                    {/* Expense bar */}
                    <div 
                      className="absolute bottom-[20%] w-1/2 right-0"
                      style={{
                        height: `${expenseHeight}%`,
                      }}
                    >
                      <div className="bg-blue-900 w-full h-full rounded-t-sm hover:bg-blue-800 transition-colors"></div>
                    </div>
                  </div>
                  
                  {/* Month label */}
                  <div className="absolute bottom-[-20px] w-full text-center text-xs text-gray-500">
                    {month}
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Tooltip */}
          {tooltip.visible && (
            <div 
              className="absolute bg-white p-3 rounded-md shadow-lg text-xs z-10 border border-gray-200 pointer-events-none"
              style={{ 
                left: `${Math.min(tooltip.x + 10, 200)}px`, 
                top: `${Math.max(tooltip.y - 100, 10)}px`,
                maxWidth: '180px'
              }}
            >
              <div className="font-bold text-gray-900 mb-2">{tooltip.month}</div>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-blue-500">Income:</span>
                  <span className="font-medium">${tooltip.income.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-900">Expense:</span>
                  <span className="font-medium">${tooltip.expense.toLocaleString()}</span>
                </div>
                <div className="border-t pt-1">
                  <div className="flex justify-between">
                    <span className={tooltip.net >= 0 ? "text-green-600" : "text-red-600"}>Net:</span>
                    <span className={`font-semibold ${tooltip.net >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {tooltip.net >= 0 ? '+' : '-'}${Math.abs(tooltip.net).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="mt-8 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <p className="text-sm text-green-600 font-medium">Total Income</p>
            <p className="text-lg font-bold text-green-700">
              ${totalIncome.toLocaleString()}
            </p>
          </div>
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <p className="text-sm text-red-600 font-medium">Total Expenses</p>
            <p className="text-lg font-bold text-red-700">
              ${totalExpenses.toLocaleString()}
            </p>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-600 font-medium">Net Cash Flow</p>
            <p className={`text-lg font-bold ${totalNetFlow >= 0 ? 'text-green-700' : 'text-red-700'}`}>
              {totalNetFlow >= 0 ? '+' : '-'}${Math.abs(totalNetFlow).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Additional insights */}
        {periods.length > 0 && currentPeriod && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {currentPeriod.budget_amount && currentPeriod.budget_amount > 0 && (
              <div className="p-2 bg-orange-50 rounded border border-orange-200">
                <p className="text-orange-700">
                  <strong>Budget:</strong> ${currentPeriod.budget_amount.toLocaleString()}
                </p>
                <p className="text-orange-600">
                  vs Actual Expenses: ${totalExpenses.toLocaleString()}
                </p>
              </div>
            )}
            {currentPeriod.income_goal && currentPeriod.income_goal > 0 && (
              <div className="p-2 bg-purple-50 rounded border border-purple-200">
                <p className="text-purple-700">
                  <strong>Income Goal:</strong> ${currentPeriod.income_goal.toLocaleString()}
                </p>
                <p className="text-purple-600">
                  vs Actual Income: ${totalIncome.toLocaleString()}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default CashFlow;