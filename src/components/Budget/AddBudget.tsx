import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import UseFinanceHook from "@/hooks/UseFinance";
import {
  ArrowLeftIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { AuthLayout } from '../Layout/layout';

interface FormData {
  name: string;
  target: string;
  startDate: string;
  endDate: string;
}

const validationSchema = yup.object({
  name: yup.string().required('Plan name is required').min(2, 'Plan name must be at least 2 characters'),
  target: yup.string().required('Target amount is required').matches(/^\d+(\.\d{1,2})?$/, 'Please enter a valid amount'),
  startDate: yup.string().required('Start date is required').test(
    'is-not-past',
    'Start date cannot be in the past',
    function(value) {
      if (!value) return true;
      const today = new Date().toISOString().split('T')[0];
      return value >= today;
    }
  ),
  endDate: yup.string().required('End date is required').test(
    'is-after-start',
    'End date must be after start date',
    function(value) {
      const { startDate } = this.parent;
      if (!startDate || !value) return true;
      return new Date(value) > new Date(startDate);
    }
  ),
});

export default function AddBudget() {
  const [saveLoading, setSaveLoading] = useState(false);
  const navigate = useNavigate();
  const { createBudgetPlan } = UseFinanceHook();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data: FormData) => {
    setSaveLoading(true);
    try {
      await createBudgetPlan({
        label: data.name,
        budget_amount: data.target,
        startDate: data.startDate,
        endDate: data.endDate,
      });
      
      toast.success('Budget plan created successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating plan:', error);
      toast.error('Failed to create budget plan. Please try again.');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <AuthLayout>
        <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleCancel}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Create Budget Plan</h1>
          <p className="text-gray-600 mt-2">Set up a new budget plan to track your financial goals</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Plan Name */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <DocumentTextIcon className="w-4 h-4 mr-2" />
                  Plan Name
                </label>
                <input
                  type="text"
                  {...register('name')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., Emergency Fund, Vacation Savings, Car Purchase"
                />
                {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>}
              </div>

              {/* Target Amount */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <CurrencyDollarIcon className="w-4 h-4 mr-2" />
                  Target Amount
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    {...register('target')}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="0.00"
                  />
                </div>
                {errors.target && <p className="mt-2 text-sm text-red-600">{errors.target.message}</p>}
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    Start Date
                  </label>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    {...register('startDate')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  {errors.startDate && <p className="mt-2 text-sm text-red-600">{errors.startDate.message}</p>}
                </div>

                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    End Date
                  </label>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    {...register('endDate')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  {errors.endDate && <p className="mt-2 text-sm text-red-600">{errors.endDate.message}</p>}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button
                  type="submit"
                  disabled={saveLoading}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saveLoading ? 'Creating Plan...' : 'Create Budget Plan'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-3">💡 Budget Planning Tips</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• Set realistic and achievable target amounts</li>
            <li>• Choose meaningful timeframes for your goals</li>
            <li>• Consider breaking large goals into smaller milestones</li>
            <li>• Review and adjust your plans regularly</li>
          </ul>
        </div>
      </div>
    </div>
    </AuthLayout>
  );
}