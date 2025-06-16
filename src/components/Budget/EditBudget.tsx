import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from "react-toastify";
import { useNavigate, useParams } from 'react-router-dom';
import UseFinanceHook from "@/hooks/UseFinance";
import {
  ArrowLeftIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  TrashIcon,
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
  startDate: yup.string().required('Start date is required'),
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

export default function EditBudget() {
  const [saveLoading, setSaveLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { getBudgetPlansId, updateBudgetPlan, deleteBudgetPlan } = UseFinanceHook();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    if (id) {
      loadPlanData();
    } else {
      console.error('No ID provided in URL params');
      toast.error('No plan ID provided');
      navigate('/dashboard');
    }
  }, [id]);

  const loadPlanData = async () => {
    if (!id) {
      toast.error('No plan ID provided');
      navigate('/dashboard');
      return;
    }

    try {
      const planData = await getBudgetPlansId(id);
      console.log('Plan data received:', planData);
      
      if (!planData) {
        console.error('No plan data received for ID:', id);
        toast.error('Plan not found');
        navigate('/dashboard');
        return;
      }

      // Extract plan information from the response
      // The budget plan data is at the root level under key "0"
      let plan = null;
      
      // Check if the data has a "0" key (which contains the budget plan)
      if (planData["0"]) {
        plan = planData["0"];
      } else if (planData.data && planData.data["0"]) {
        plan = planData.data["0"];
      } else {
        // Fallback to direct properties if structure is different
        plan = planData;
      }

      if (!plan) {
        console.error('No plan data found in response:', planData);
        toast.error('Plan data not found');
        navigate('/dashboard');
        return;
      }

      console.log('Extracted plan:', plan);

      // Set form data with the plan information
      const formData = {
        name: plan.label || '',
        target: String(plan.budget_amount || ''),
        startDate: plan.startDate || '',
        endDate: plan.endDate || '',
      };

      console.log('Form data to reset:', formData);
      reset(formData);

    } catch (error) {
      console.error('Error loading plan:', error);
      toast.error('Failed to load plan data');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    if (!id) {
      toast.error('No plan ID available');
      return;
    }
    
    setSaveLoading(true);
    try {
      console.log('Updating plan with ID:', id, 'Data:', data);
      
      await updateBudgetPlan({
        id,
        label: data.name,
        budget_amount: data.target,
        detail: "",
        startDate: data.startDate,
        endDate: data.endDate,
      });
      
      toast.success('Budget plan updated successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating plan:', error);
      toast.error('Failed to update budget plan. Please try again.');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) {
      toast.error('No plan ID available');
      return;
    }
    
    setDeleteLoading(true);
    try {
      await deleteBudgetPlan(id);
      toast.success('Budget plan deleted successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error deleting plan:', error);
      toast.error('Failed to delete budget plan. Please try again.');
    } finally {
      setDeleteLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <AuthLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading plan data...</p>
          </div>
        </div>
      </AuthLayout>
    );
  }

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
            <h1 className="text-3xl font-bold text-gray-900">Edit Budget Plan</h1>
            <p className="text-gray-600 mt-2">Update your budget plan details</p>
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
                    {saveLoading ? 'Updating...' : 'Update Plan'}
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

          {/* Delete Section */}
          <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-red-900 mb-3">⚠️ Danger Zone</h3>
            <p className="text-sm text-red-700 mb-4">
              Deleting this budget plan will permanently remove all associated data. This action cannot be undone.
            </p>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              disabled={deleteLoading}
              className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              <TrashIcon className="w-4 h-4 mr-2" />
              Delete Plan
            </button>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                      <TrashIcon className="h-6 w-6 text-red-600" />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">Delete Budget Plan</h3>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Are you sure you want to delete this budget plan? This action cannot be undone and will permanently remove all associated data.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={deleteLoading}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                  >
                    {deleteLoading ? 'Deleting...' : 'Delete'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}