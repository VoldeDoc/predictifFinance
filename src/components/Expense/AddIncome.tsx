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
  CheckCircleIcon,
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
  income_goal?: number;
}

const validationSchema = yup.object({
  category: yup.string().required('Category is required'),
  item: yup.string().required('Item is required').min(2, 'Item must be at least 2 characters'),
  amount: yup.string().required('Amount is required').matches(/^\d+(\.\d{1,2})?$/, 'Please enter a valid amount'),
  date: yup.string().required('Date is required'),
  planId: yup.string().required('Budget plan is required'),
});

const incomeCategories = ["salary", "investment", "allowance", "gift", "other"];

export default function AddIncome() {
  const navigate = useNavigate();
  const { getBudgetPeriods, createBudgetItem, getIncomeCategories } = UseFinanceHook();

  const [periods, setPeriods] = useState<BudgetPeriod[]>([]);
  const [loading, setLoading] = useState(false);
  const [incomeProgress, setIncomeProgress] = useState<{
    show: boolean;
    currentIncome: number;
    incomeGoal: number;
    newTotal: number;
    progressPercent: number;
  }>({
    show: false,
    currentIncome: 0,
    incomeGoal: 0,
    newTotal: 0,
    progressPercent: 0
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
      category: incomeCategories[0],
    }
  });

  const selectedPlanId = watch('planId');
  const amount = watch('amount');

  useEffect(() => {
    loadPeriods();
  }, []);

  useEffect(() => {
    if (selectedPlanId && amount) {
      checkIncomeProgress();
    } else {
      setIncomeProgress(prev => ({ ...prev, show: false }));
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
        income_goal: p.income_goal || 0,
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

  const checkIncomeProgress = async () => {
    if (!selectedPlanId || !amount) return;

    try {
      const selectedPlan = periods.find(p => p.id === selectedPlanId);
      if (!selectedPlan || !selectedPlan.income_goal) return;

      const incomeData = await getIncomeCategories(selectedPlanId);
      const currentIncome = incomeData.reduce((sum: number, inc: any) => sum + inc.total_amount, 0);
      const newIncomeAmount = parseFloat(amount);
      const newTotal = currentIncome + newIncomeAmount;
      const progressPercent = Math.round((newTotal / selectedPlan.income_goal) * 100);

      setIncomeProgress({
        show: true,
        currentIncome,
        incomeGoal: selectedPlan.income_goal,
        newTotal,
        progressPercent
      });
    } catch (error) {
      console.error('Error checking income progress:', error);
    }
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await createBudgetItem({
        plan_id: data.planId,
        category: data.category,
        item: data.item,
        amount: data.amount,
        date: data.date,
        source: 'income',
      });

      toast.success('Income added successfully!');
      navigate('/dashboard'); // or wherever you want to redirect
    } catch (error) {
      console.error('Error saving income:', error);
      toast.error('Failed to add income. Please try again.');
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
            <div className="p-2 bg-green-100 rounded-lg">
              <CurrencyDollarIcon className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Add Income</h1>
              <p className="text-gray-600">Record new income to your budget plan</p>
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
                  className="w-full bg-white border border-gray-300 px-3 py-2 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 appearance-none"
                >
                  <option value="">Select a budget plan</option>
                  {periods.map((period) => (
                    <option key={period.id} value={period.id}>
                      {period.label}
                      {period.income_goal !== undefined && period.income_goal > 0 && ` (Goal: $${period.income_goal.toLocaleString()})`}
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
                  {selectedPlan.income_goal !== undefined && selectedPlan.income_goal > 0 && (
                    <p className="text-sm text-gray-600 mt-1">
                      Income Goal: <span className="font-medium">${selectedPlan.income_goal.toLocaleString()}</span>
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Income Progress */}
            {incomeProgress.show && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-green-800">Income Progress</h4>
                    <p className="text-sm text-green-700 mt-1">
                      You're making great progress towards your income goal!
                    </p>
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-green-600 mb-1">
                        <span>Progress: {incomeProgress.progressPercent}%</span>
                        <span>${incomeProgress.newTotal.toLocaleString()} / ${incomeProgress.incomeGoal.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-green-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full bg-green-500 transition-all duration-300"
                          style={{ width: `${Math.min(100, incomeProgress.progressPercent)}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-green-600 space-y-1">
                      <div className="flex justify-between">
                        <span>Current income:</span>
                        <span>${incomeProgress.currentIncome.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>New income:</span>
                        <span>${parseFloat(amount || '0').toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span>Total after:</span>
                        <span>${incomeProgress.newTotal.toLocaleString()}</span>
                      </div>
                      {incomeProgress.progressPercent >= 100 && (
                        <div className="flex justify-between text-green-700 font-medium">
                          <span>🎉 Goal achieved!</span>
                          <span>Over by: ${(incomeProgress.newTotal - incomeProgress.incomeGoal).toLocaleString()}</span>
                        </div>
                      )}
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
                  className="w-full bg-white border border-gray-300 px-3 py-2 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 appearance-none capitalize"
                >
                  {incomeCategories.map((category) => (
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
                Income Source *
              </label>
              <input
                type="text"
                {...register('item')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Where did this income come from?"
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
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Adding Income...
                  </div>
                ) : (
                  'Add Income'
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