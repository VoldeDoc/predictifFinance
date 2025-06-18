import { useState, useEffect } from "react";
import TransactionTable from "@/components/Dashboard/Tools/TransactionTable";
import {
  BanknotesIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  FunnelIcon,
  ChevronDownIcon,
  ChartBarIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import UseFinanceHook from "@/hooks/UseFinance";

interface TransactionData {
  id: string;
  name: string;
  account?: string;
  date: string;
  time?: string;
  amount: number;
  description?: string;
  status: "completed" | "pending" | "failed";
  category?: string;
  type: "income" | "expense";
  subcategory?: string;
}

interface BudgetPeriod {
  id: string;
  label: string;
  startDate: string;
  endDate: string;
  budget_amount?: number;
  income_goal?: number;
}

export const TransactionsComponent = () => {
  const [activeFilter, setActiveFilter] = useState<"all" | "income" | "expense">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("");
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [periods, setPeriods] = useState<BudgetPeriod[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [showBudgetSummary, setShowBudgetSummary] = useState(false);

  const { 
    getDepositTransactions,
    getExpenseCategories,
    getIncomeCategories,
    getBudgetPeriods
  } = UseFinanceHook();

  // Load periods on component mount
  useEffect(() => {
    loadPeriods();
  }, []);

  // Load transactions when period or filter changes
  useEffect(() => {
    if (selectedPeriod) {
      console.log('Selected period:', selectedPeriod);
      loadTransactionsForPeriod(selectedPeriod);
    }
  }, [selectedPeriod, activeFilter]);

  const loadPeriods = async () => {
    try {
      const rawPeriods: any = await getBudgetPeriods();
      console.log('Raw periods:', rawPeriods);
      
      let periodsArray = [];
      if (Array.isArray(rawPeriods)) {
        periodsArray = rawPeriods;
      } else if (rawPeriods?.data && Array.isArray(rawPeriods.data)) {
        periodsArray = rawPeriods.data;
      }
      
      const mappedPeriods = periodsArray.map((p: any) => ({
        id: p.id || p.period_id || Math.random().toString(),
        label: p.label || p.name || p.title || `Period ${p.id}`,
        startDate: p.startDate || p.start_date || "",
        endDate: p.endDate || p.end_date || "",
        budget_amount: parseFloat(p.budget_amount || p.budgetAmount || 0),
        income_goal: parseFloat(p.income_goal || p.incomeGoal || 0),
      }));
      
      setPeriods(mappedPeriods);
      
      if (mappedPeriods.length > 0) {
        setSelectedPeriod(mappedPeriods[0].id);
      }
    } catch (error) {
      console.error('Error loading periods:', error);
    }
  };

  // Build transaction data from category summaries
  const buildTransactionData = (
    raw: { category: string; total_amount: number }[],
    type: 'expense' | 'income'
  ) => {
    const transactions: TransactionData[] = [];
    
    raw.forEach((item, index) => {
      if (item.total_amount > 0) {
        transactions.push({
          id: `${type}-${item.category}-${index}`,
          name: `${item.category} ${type === 'income' ? 'Income' : 'Expense'}`,
          account: "Budget Account",
          date: new Date().toISOString().split('T')[0],
          time: "00:00:00",
          amount: type === 'expense' ? -Math.abs(item.total_amount) : item.total_amount,
          description: `${type === 'income' ? 'Income' : 'Expense'} from ${item.category}`,
          status: "completed" as const,
          category: item.category,
          type: type,
          subcategory: undefined,
        });
      }
    });
    
    return transactions;
  };

  // Map deposit records to transaction format
  const mapIncomeRecord = (r: any, category: string = "Deposit") => {
    const [datePart, timePartRaw] = (r.created_at || r.date || new Date().toISOString()).split("T");
    const timePart = timePartRaw ? timePartRaw.split(".")[0] : "00:00:00";
    return {
      id: r.id || r.reference || Math.random().toString(),
      name: r.detail || r.description || r.title || r.name || `${category}`,
      account: r.account_type || r.account || "Main Account",
      date: datePart,
      time: timePart,
      amount: parseFloat(r.amount || 0),
      description: r.detail || r.description || r.note || "",
      status: (r.status || "completed") as "completed" | "pending" | "failed",
      category: category,
      type: "income" as const,
      subcategory: r.subcategory || r.type || undefined,
    };
  };

  const loadTransactionsForPeriod = async (periodId: string) => {
    if (!periodId) return;
    
    setLoading(true);
    setError(null);

    try {
      let allRecords: TransactionData[] = [];
      let categories = new Set<string>();

      // Fetch income transactions
      if (activeFilter === "all" || activeFilter === "income") {
        try {
          // Fetch regular deposits (these don't need period ID)
          const rawDeposits = await getDepositTransactions();
          console.log('Raw deposits:', rawDeposits);
          
          if (Array.isArray(rawDeposits) && rawDeposits.length > 0) {
            const mappedDeposits = rawDeposits.map(r => mapIncomeRecord(r, "Deposit"));
            allRecords.push(...mappedDeposits);
            categories.add("Deposit");
            console.log('Mapped deposits:', mappedDeposits);
          }

          // Fetch income categories for the period
          const incomeCategories = await getIncomeCategories(periodId) as any;
          console.log('Income categories raw:', incomeCategories);
          
          let incomeCategoriesArray = [];
          
          if (Array.isArray(incomeCategories)) {
            incomeCategoriesArray = incomeCategories;
          } else if (incomeCategories?.data && Array.isArray(incomeCategories.data)) {
            incomeCategoriesArray = incomeCategories.data;
          }

          if (incomeCategoriesArray.length > 0) {
            console.log('Processing income categories:', incomeCategoriesArray);
            const incomeTransactions = buildTransactionData(incomeCategoriesArray, 'income');
            allRecords.push(...incomeTransactions);
            
            incomeCategoriesArray.forEach((item: any) => {
              categories.add(item.category);
            });
          }
        } catch (incomeError) {
          console.error("Error fetching income transactions:", incomeError);
        }
      }

      // Fetch expense transactions
      if (activeFilter === "all" || activeFilter === "expense") {
        try {
          const expenseCategories = await getExpenseCategories(periodId) as any;
          console.log('Expense categories raw:', expenseCategories);
          
          let expenseCategoriesArray = [];
          
          if (Array.isArray(expenseCategories)) {
            expenseCategoriesArray = expenseCategories;
          } else if (expenseCategories?.data && Array.isArray(expenseCategories.data)) {
            expenseCategoriesArray = expenseCategories.data;
          }

          if (expenseCategoriesArray.length > 0) {
            console.log('Processing expense categories:', expenseCategoriesArray);
            const expenseTransactions = buildTransactionData(expenseCategoriesArray, 'expense');
            allRecords.push(...expenseTransactions);
            
            expenseCategoriesArray.forEach((item: any) => {
              categories.add(item.category);
            });
          }
        } catch (expenseError) {
          console.error("Error fetching expense transactions:", expenseError);
        }
      }

      console.log('All records before sorting:', allRecords);

      // Sort transactions by date (newest first)
      allRecords.sort((a, b) => {
        const dateA = new Date(a.date + 'T' + (a.time || '00:00:00')).getTime();
        const dateB = new Date(b.date + 'T' + (b.time || '00:00:00')).getTime();
        return dateB - dateA;
      });

      setTransactions(allRecords);
      setAvailableCategories(Array.from(categories).sort());
      
      console.log('Final transactions set:', allRecords);
      console.log('Available categories:', Array.from(categories));
      
    } catch (err: any) {
      console.error("Error fetching transactions:", err);
      setError("Unable to load transactions.");
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter transactions based on category
  const filteredTransactions = categoryFilter === "all" 
    ? transactions 
    : transactions.filter(tx => 
        tx.category === categoryFilter || 
        tx.subcategory === categoryFilter
      );

  // Get summary statistics
  const totalIncome = transactions
    .filter(tx => tx.type === "income")
    .reduce((sum, tx) => sum + tx.amount, 0);
  
  const totalExpenses = transactions
    .filter(tx => tx.type === "expense")
    .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const currentPlan = periods.find((p) => p.id === selectedPeriod);

  // Budget calculations (like in PieChart)
  const budgetAmount = currentPlan?.budget_amount || 0;
  const incomeGoal = currentPlan?.income_goal || 0;
  const budgetRemaining = Math.max(0, budgetAmount - totalExpenses);
  const isOverBudget = budgetAmount > 0 && totalExpenses > budgetAmount;
  const incomeProgress = incomeGoal > 0 ? Math.round((totalIncome / incomeGoal) * 100) : 0;
  const netAmount = totalIncome - totalExpenses;

  // Category breakdown for budget summary
  const incomeByCategory = availableCategories
    .map(category => ({
      name: category,
      amount: transactions
        .filter(tx => tx.type === "income" && tx.category === category)
        .reduce((sum, tx) => sum + tx.amount, 0)
    }))
    .filter(item => item.amount > 0);

  const expensesByCategory = availableCategories
    .map(category => ({
      name: category,
      amount: transactions
        .filter(tx => tx.type === "expense" && tx.category === category)
        .reduce((sum, tx) => sum + Math.abs(tx.amount), 0)
    }))
    .filter(item => item.amount > 0);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header with Budget Summary Button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
          Transactions
        </h1>
        {currentPlan && (
          <button
            onClick={() => setShowBudgetSummary(true)}
            className="flex items-center space-x-2 px-4 py-2 text-sm text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors border border-indigo-200"
          >
            <ChartBarIcon className="w-4 h-4" />
            <span>Budget Summary</span>
          </button>
        )}
      </div>

      {/* Period Selection */}
      <div className="bg-white rounded-lg p-4 shadow-sm border mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <label className="text-sm font-medium text-gray-700">Budget Period:</label>
          <div className="relative flex-1 max-w-xs">
            <select
              className="w-full bg-white border border-gray-300 px-3 py-2 pr-8 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
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

      {/* Summary Cards with Budget Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Income</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</p>
              {incomeGoal > 0 && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500">Goal: {formatCurrency(incomeGoal)}</p>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                    <div 
                      className="h-1.5 rounded-full bg-green-500"
                      style={{ width: `${Math.min(100, incomeProgress)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-green-600 mt-1">{incomeProgress}% of goal</p>
                </div>
              )}
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <ArrowDownTrayIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Expenses</p>
              <p className={`text-2xl font-bold ${isOverBudget ? 'text-red-600' : 'text-red-600'}`}>
                {formatCurrency(totalExpenses)}
              </p>
              {budgetAmount > 0 && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500">Budget: {formatCurrency(budgetAmount)}</p>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                    <div 
                      className={`h-1.5 rounded-full ${isOverBudget ? 'bg-red-500' : 'bg-blue-500'}`}
                      style={{ width: `${Math.min(100, (totalExpenses / budgetAmount) * 100)}%` }}
                    ></div>
                  </div>
                  <p className={`text-xs mt-1 ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}>
                    {isOverBudget 
                      ? `Over by ${formatCurrency(totalExpenses - budgetAmount)}`
                      : `${formatCurrency(budgetRemaining)} remaining`
                    }
                  </p>
                </div>
              )}
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <ArrowUpTrayIcon className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Net Balance</p>
              <p className={`text-2xl font-bold ${netAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(netAmount)}
              </p>
              <p className={`text-xs mt-2 ${netAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {netAmount >= 0 ? 'Positive balance' : 'Spending more than earning'}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <BanknotesIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <button
          className={`flex items-center justify-center gap-2 p-4 rounded-lg bg-white border ${
            activeFilter === "all"
              ? "border-blue-500 ring-2 ring-blue-200"
              : "border-gray-200"
          } hover:bg-gray-50 transition-colors`}
          onClick={() => {
            setActiveFilter("all");
            setCategoryFilter("all");
          }}
        >
          <span className="bg-blue-100 p-2 rounded-full">
            <BanknotesIcon className="h-5 w-5 text-blue-600" />
          </span>
          <span>All Transactions</span>
        </button>

        <button
          className={`flex items-center justify-center gap-2 p-4 rounded-lg bg-white border ${
            activeFilter === "income"
              ? "border-green-500 ring-2 ring-green-200"
              : "border-gray-200"
          } hover:bg-gray-50 transition-colors`}
          onClick={() => {
            setActiveFilter("income");
            setCategoryFilter("all");
          }}
        >
          <span className="bg-green-100 p-2 rounded-full">
            <ArrowDownTrayIcon className="h-5 w-5 text-green-600" />
          </span>
          <span>Income</span>
        </button>

        <button
          className={`flex items-center justify-center gap-2 p-4 rounded-lg bg-white border ${
            activeFilter === "expense"
              ? "border-red-500 ring-2 ring-red-200"
              : "border-gray-200"
          } hover:bg-gray-50 transition-colors`}
          onClick={() => {
            setActiveFilter("expense");
            setCategoryFilter("all");
          }}
        >
          <span className="bg-red-100 p-2 rounded-full">
            <ArrowUpTrayIcon className="h-5 w-5 text-red-600" />
          </span>
          <span>Expenses</span>
        </button>
      </div>

      {/* Category Filter */}
      {availableCategories.length > 0 && (
        <div className="bg-white rounded-lg p-4 shadow-sm border mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-2">
              <FunnelIcon className="h-5 w-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filter by Category:</span>
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              {availableCategories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {categoryFilter !== "all" && (
              <button
                onClick={() => setCategoryFilter("all")}
                className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors"
              >
                Clear Filter
              </button>
            )}
          </div>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading transactions...</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => selectedPeriod && loadTransactionsForPeriod(selectedPeriod)}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && selectedPeriod && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Transaction History
                {currentPlan && (
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    - {currentPlan.label}
                  </span>
                )}
              </h2>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-500">
                <span>
                  Showing {filteredTransactions.length} of {transactions.length} transactions
                </span>
                {categoryFilter !== "all" && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-lg">
                    {categoryFilter}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <TransactionTable
            data={filteredTransactions}
            title=""
            showTitle={false}
            initialPageSize={10}
            maxHeight="600px"
            renderNameWithIcon={false}
            hideCategory={false}
          />
        </div>
      )}

      {!loading && !error && !selectedPeriod && (
        <div className="text-center py-12">
          <ChevronDownIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Budget Period</h3>
          <p className="text-gray-500">
            Choose a budget period to view transactions for that timeframe
          </p>
        </div>
      )}

      {!loading && !error && selectedPeriod && filteredTransactions.length === 0 && (
        <div className="text-center py-12">
          <BanknotesIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Transactions Found</h3>
          <p className="text-gray-500">
            {categoryFilter !== "all" 
              ? `No transactions found for category "${categoryFilter}"`
              : activeFilter === "all"
              ? "No transactions available for this period"
              : `No ${activeFilter} transactions found for this period`
            }
          </p>
          {categoryFilter !== "all" && (
            <button
              onClick={() => setCategoryFilter("all")}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              View All Transactions
            </button>
          )}
        </div>
      )}

      {/* Budget Summary Modal */}
      {showBudgetSummary && currentPlan && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowBudgetSummary(false)}></div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full mx-4">
              <div className="bg-white px-6 pt-6 pb-4">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                    <ChartBarIcon className="w-5 h-5 text-indigo-600" />
                    <span>Budget Summary</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowBudgetSummary(false)}
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
                      <span className="text-green-600">{formatCurrency(totalIncome)}</span>
                    </h5>
                    
                    {incomeGoal > 0 && (
                      <div className="mb-2">
                        <div className="flex justify-between text-sm text-green-700 mb-1">
                          <span>Goal: {formatCurrency(incomeGoal)}</span>
                          <span>{incomeProgress}%</span>
                        </div>
                        <div className="w-full bg-green-200 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full bg-green-500"
                            style={{ width: `${Math.min(100, incomeProgress)}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    <div className="space-y-1 text-sm">
                      {incomeByCategory.map(item => (
                        <div key={item.name} className="flex justify-between text-green-700">
                          <span className="capitalize">{item.name}:</span>
                          <span>{formatCurrency(item.amount)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Expense Section */}
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <h5 className="font-medium text-red-800 mb-3 flex items-center justify-between">
                      <span>Expenses</span>
                      <span className="text-red-600">{formatCurrency(totalExpenses)}</span>
                    </h5>

                    {budgetAmount > 0 && (
                      <div className="mb-2">
                        <div className="flex justify-between text-sm text-red-700 mb-1">
                          <span>Budget: {formatCurrency(budgetAmount)}</span>
                          <span>{Math.round((totalExpenses / budgetAmount) * 100)}%</span>
                        </div>
                        <div className="w-full bg-red-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${isOverBudget ? 'bg-red-600' : 'bg-red-500'}`}
                            style={{ width: `${Math.min(100, (totalExpenses / budgetAmount) * 100)}%` }}
                          ></div>
                        </div>
                        {isOverBudget && (
                          <p className="text-xs text-red-600 mt-1">
                            Over budget by {formatCurrency(totalExpenses - budgetAmount)}
                          </p>
                        )}
                      </div>
                    )}

                    <div className="space-y-1 text-sm">
                      {expensesByCategory.map(item => (
                        <div key={item.name} className="flex justify-between text-red-700">
                          <span className="capitalize">{item.name}:</span>
                          <span>{formatCurrency(item.amount)}</span>
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
                        {netAmount >= 0 ? '+' : ''}{formatCurrency(Math.abs(netAmount))}
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
                  onClick={() => setShowBudgetSummary(false)}
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
};

export default TransactionsComponent;