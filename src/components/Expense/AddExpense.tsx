import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import UseFinanceHook from '@/hooks/UseFinance';
import { 
  ChevronDownIcon, 
  ArrowLeftIcon, 
  ExclamationTriangleIcon,
  CurrencyDollarIcon 
} from '@heroicons/react/24/outline';
import { AuthLayout } from '../Layout/layout';

interface FormData {
  category: string;
  item: string;
  amount: string;
  date: string;
  planId: string;
}

interface BudgetPeriod {
  id: string;
  label: string;
  startDate: string;
  endDate: string;
  budget_amount?: number;
}

const validationSchema = yup.object({
  category: yup.string().required('Category is required'),
  item: yup.string().required('Item is required').min(2, 'Item must be at least 2 characters'),
  amount: yup.string().required('Amount is required').matches(/^\d+(\.\d{1,2})?$/, 'Please enter a valid amount'),
  date: yup.string().required('Date is required'),
  planId: yup.string().required('Budget plan is required'),
});

const expenseCategories = ["feeding", "rent", "entertainment", "education", "other"];

export default function AddExpense() {
  const navigate = useNavigate();
  const { getBudgetPeriods, createBudgetItem, getExpenseCategories } = UseFinanceHook();

  const [periods, setPeriods] = useState<BudgetPeriod[]>([]);
  const [loading, setLoading] = useState(false);
  const [budgetWarning, setBudgetWarning] = useState<{
    show: boolean;
    message: string;
    currentExpenses: number;
    budgetLimit: number;
    newTotal: number;
  }>({
    show: false,
    message: '',
    currentExpenses: 0,
    budgetLimit: 0,
    newTotal: 0
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      category: expenseCategories[0],
    }
  });

  const selectedPlanId = watch('planId');
  const amount = watch('amount');

  useEffect(() => {
    loadPeriods();
  }, []);

  useEffect(() => {
    if (selectedPlanId && amount) {
      checkBudgetLimit();
    } else {
      setBudgetWarning(prev => ({ ...prev, show: false }));
    }
  }, [selectedPlanId, amount]);

  const loadPeriods = async () => {
    try {
      const rawPeriods = await getBudgetPeriods();
      const mappedPeriods = rawPeriods.map((p: any) => ({
        id: p.id,
        label: p.label,
        startDate: p.startDate || "",
        endDate: p.endDate || "",
        budget_amount: p.budget_amount || 0,
      }));
      setPeriods(mappedPeriods);
      
      if (mappedPeriods.length > 0) {
        setValue('planId', mappedPeriods[0].id);
      }
    } catch (error) {
      console.error('Error loading periods:', error);
      toast.error('Failed to load budget periods');
    }
  };

  const checkBudgetLimit = async () => {
    if (!selectedPlanId || !amount) return;

    try {
      const selectedPlan = periods.find(p => p.id === selectedPlanId);
      if (!selectedPlan || !selectedPlan.budget_amount) return;

      const expenseData = await getExpenseCategories(selectedPlanId);
      const currentExpenses = expenseData.reduce((sum: number, exp: any) => sum + exp.total_amount, 0);
      const newExpenseAmount = parseFloat(amount);
      const newTotal = currentExpenses + newExpenseAmount;

      if (newTotal > selectedPlan.budget_amount) {
        setBudgetWarning({
          show: true,
          message: `Adding this expense will exceed your budget limit of $${selectedPlan.budget_amount.toLocaleString()}`,
          currentExpenses,
          budgetLimit: selectedPlan.budget_amount,
          newTotal
        });
      } else {
        setBudgetWarning(prev => ({ ...prev, show: false }));
      }
    } catch (error) {
      console.error('Error checking budget limit:', error);
    }
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      if (budgetWarning.show) {
        const confirmed = window.confirm(
          `⚠️ Budget Limit Exceeded!\n\n` +
          `Current expenses: $${budgetWarning.currentExpenses.toLocaleString()}\n` +
          `New expense: $${parseFloat(data.amount).toLocaleString()}\n` +
          `Total after: $${budgetWarning.newTotal.toLocaleString()}\n` +
          `Budget limit: $${budgetWarning.budgetLimit.toLocaleString()}\n` +
          `Exceeded by: $${(budgetWarning.newTotal - budgetWarning.budgetLimit).toLocaleString()}\n\n` +
          `Do you want to proceed anyway?`
        );
        
        if (!confirmed) {
          setLoading(false);
          return;
        }
      }

      await createBudgetItem({
        plan_id: data.planId,
        category: data.category,
        item: data.item,
        amount: data.amount,
        date: data.date,
        source: 'expense',
      });

      toast.success('Expense added successfully!');
      navigate('/dashboard'); // or wherever you want to redirect
    } catch (error) {
      console.error('Error saving expense:', error);
      toast.error('Failed to add expense. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const selectedPlan = periods.find(p => p.id === selectedPlanId);

  return (
 <AuthLayout>
       <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <CurrencyDollarIcon className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Add Expense</h1>
              <p className="text-gray-600">Record a new expense to your budget plan</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            {/* Budget Plan Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Budget Plan *
              </label>
              <div className="relative">
                <select
                  {...register('planId')}
                  className="w-full bg-white border border-gray-300 px-3 py-2 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 appearance-none"
                >
                  <option value="">Select a budget plan</option>
                  {periods.map((period) => (
                    <option key={period.id} value={period.id}>
                      {period.label}
                      {period.budget_amount && period.budget_amount > 0 && ` (Budget: $${period.budget_amount.toLocaleString()})`}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
              {errors.planId && (
                <p className="mt-1 text-sm text-red-600">{errors.planId.message}</p>
              )}
              
              {selectedPlan && (
                <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900">{selectedPlan.label}</h4>
                  {selectedPlan.startDate && selectedPlan.endDate && (
                    <p className="text-sm text-gray-500">
                      {new Date(selectedPlan.startDate).toLocaleDateString()} - {new Date(selectedPlan.endDate).toLocaleDateString()}
                    </p>
                  )}
                  {selectedPlan.budget_amount !== undefined && selectedPlan.budget_amount > 0 && (
                    <p className="text-sm text-gray-600 mt-1">
                      Budget Limit: <span className="font-medium">${selectedPlan.budget_amount.toLocaleString()}</span>
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Budget Warning */}
            {budgetWarning.show && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <ExclamationTriangleIcon className="w-5 h-5 text-red-500 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-red-800">Budget Warning</h4>
                    <p className="text-sm text-red-700 mt-1">{budgetWarning.message}</p>
                    <div className="mt-2 text-xs text-red-600 space-y-1">
                      <div className="flex justify-between">
                        <span>Current expenses:</span>
                        <span>${budgetWarning.currentExpenses.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>New expense:</span>
                        <span>${parseFloat(amount || '0').toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span>Total after:</span>
                        <span>${budgetWarning.newTotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-red-700">
                        <span>Over budget by:</span>
                        <span>${(budgetWarning.newTotal - budgetWarning.budgetLimit).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <div className="relative">
                <select
                  {...register('category')}
                  className="w-full bg-white border border-gray-300 px-3 py-2 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 appearance-none capitalize"
                >
                  {expenseCategories.map((category) => (
                    <option key={category} value={category} className="capitalize">
                      {category}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
              )}
            </div>

            {/* Item Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Item Description *
              </label>
              <input
                type="text"
                {...register('item')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="What did you spend money on?"
              />
              {errors.item && (
                <p className="mt-1 text-sm text-red-600">{errors.item.message}</p>
              )}
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">$</span>
                </div>
                <input
                  type="number"
                  step="0.01"
                  {...register('amount')}
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="0.00"
                />
              </div>
              {errors.amount && (
                <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
              )}
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date *
              </label>
              <input
                type="date"
                {...register('date')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
              {errors.date && (
                <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex space-x-3 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Adding Expense...
                  </div>
                ) : (
                  'Add Expense'
                )}
              </button>
              <Link
                to="/dashboard"
                className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors text-center"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
 </AuthLayout>
  );
}