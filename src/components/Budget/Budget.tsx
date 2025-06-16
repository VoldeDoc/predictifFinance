import { useState, useEffect } from "react";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from "react-toastify";
import { Link, useNavigate } from 'react-router-dom';
import UseFinanceHook from "@/hooks/UseFinance";
import {
  PlusIcon,
  EllipsisVerticalIcon,
  HomeIcon,
  PuzzlePieceIcon,
  XMarkIcon,
  ArrowLeftIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { CiWarning } from "react-icons/ci";
import { PiAirplaneTilt } from "react-icons/pi";
import { BudgetPlanItem } from "@/types/index";
import { AuthLayout } from "../Layout/layout";
import { MdSavings } from "react-icons/md";

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
    function (value) {
      if (!value) return true;
      const today = new Date().toISOString().split('T')[0];
      return value >= today;
    }
  ),
  endDate: yup.string().required('End date is required').test(
    'is-after-start',
    'End date must be after start date',
    function (value) {
      const { startDate } = this.parent;
      if (!startDate || !value) return true;
      return new Date(value) > new Date(startDate);
    }
  ),
});

export default function BudgetPlans() {
  const {
    getBudgetPlans,
    createBudgetPlan,
    updateBudgetPlan,
    deleteBudgetPlan,
  } = UseFinanceHook();

  const [plans, setPlans] = useState<
    (BudgetPlanItem & { startDate?: string; endDate?: string })[]
  >([]);
  const [filteredPlans, setFilteredPlans] = useState<
    (BudgetPlanItem & { startDate?: string; endDate?: string })[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [activePlanMenu, setActivePlanMenu] = useState<string | null>(null);

  // modal states
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    loadPlans();
  }, []);

  useEffect(() => {
    // Filter plans based on search term
    const filtered = plans.filter(plan =>
      plan.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPlans(filtered);
  }, [plans, searchTerm]);

  const loadPlans = async () => {
    setLoading(true);
    try {
      const apiPlans = await getBudgetPlans();
      setPlans(
        apiPlans.map((p: any) => ({
          id: p.id,
          name: p.label,
          target: Number(p.budget_amount),
          current: 0,
          icon: "default",
          startDate: p.startDate || "",
          endDate: p.endDate || "",
        }))
      );
    } catch (error) {
      console.error('Error loading plans:', error);
      toast.error('Failed to load budget plans. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const totalBudget = plans.reduce((sum, plan) => sum + plan.target, 0);
  const formatCurrency = (amount: number) => `$${amount.toLocaleString()}`;
  const router = useNavigate()
  const openAddModal = () => {
    setIsEditing(false);
    setEditingId(null);
    reset({
      name: "",
      target: "",
      startDate: "",
      endDate: "",
    });
    setShowModal(true);
  };

  const openEditModal = (plan: any) => {
    setIsEditing(true);
    setEditingId(plan.id);
    reset({
      name: plan.name,
      target: String(plan.target),
      startDate: plan.startDate || "",
      endDate: plan.endDate || "",
    });
    setShowModal(true);
    setActivePlanMenu(null);
  };

  const onSubmit = async (data: FormData) => {
    setSaveLoading(true);
    try {
      if (isEditing && editingId) {
        // Update existing
        await updateBudgetPlan({
          id: editingId,
          label: data.name,
          budget_amount: data.target,
          detail: "",
          startDate: data.startDate,
          endDate: data.endDate,
        });

        setPlans((prev) =>
          prev.map((p) =>
            p.id === editingId
              ? {
                ...p,
                name: data.name,
                target: parseFloat(data.target),
                startDate: data.startDate,
                endDate: data.endDate,
              }
              : p
          )
        );

        toast.success('Budget plan updated successfully!');
      } else {
        // Create new
        const created: any = await createBudgetPlan({
          label: data.name,
          budget_amount: data.target,
          startDate: data.startDate,
          endDate: data.endDate,
        });

        const newPlan = {
          id: created.id || created._id || `temp_${Date.now()}`,
          name: data.name,
          target: parseFloat(data.target),
          current: 0,
          icon: "default" as const,
          startDate: data.startDate,
          endDate: data.endDate,
        };

        setPlans((prev) => [...prev, newPlan]);
        toast.success('Budget plan created successfully!');
      }

      closeModal();
    } catch (error) {
      console.error('Error saving plan:', error);
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} budget plan. Please try again.`);
    } finally {
      setSaveLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setEditingId(null);
    reset();
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      await deleteBudgetPlan(id);
      setPlans((prev) => prev.filter((p) => p.id !== id));
      toast.success('Budget plan deleted successfully!');
    } catch (error) {
      console.error('Error deleting plan:', error);
      toast.error('Failed to delete budget plan. Please try again.');
    } finally {
      setLoading(false);
      setActivePlanMenu(null);
    }
  };

  const getIcon = (iconType?: string) => {
    switch (iconType) {
      case "bank":
        return <CiWarning className="w-7 h-7 mr-2 p-1 bg-blue-500 text-white rounded" />;
      case "travel":
        return <PiAirplaneTilt className="w-7 h-7 mr-2 p-1 bg-blue-500 text-white rounded" />;
      case "home":
        return <HomeIcon className="w-7 h-7 mr-2 p-1 bg-blue-500 text-white rounded" />;
      default:
        return <PuzzlePieceIcon className="w-4 h-4 mr-2 text-gray-500" />;
    }
  };

  const togglePlanMenu = (planId: string) => {
    setActivePlanMenu((cur) => (cur === planId ? null : planId));
  };

  return (
    <AuthLayout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <Link
                to="/dashboard"
                className="flex items-center text-indigo-600 hover:text-indigo-700 mr-4"
              >
                <ArrowLeftIcon className="w-5 h-5 mr-1" />
                Back to Dashboard
              </Link>
            </div>

            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">All Budget Plans</h1>
                <p className="text-gray-600 mt-2">Manage all your budget plans</p>
                <p className="text-sm text-gray-500 mt-1">
                  Total Budget: <span className="font-semibold">{formatCurrency(totalBudget)}</span>
                </p>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => router('/budget-summary')}
                  className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  <MdSavings className="w-5 h-5 mr-2" />
                  Budget Summary
                </button>
                <button
                  onClick={openAddModal}
                  disabled={loading}
                  className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  <PlusIcon className="w-5 h-5 mr-2" />
                  Add New Plan
                </button>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search budget plans..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Plans Grid */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            {loading ? (
              <div className="text-center py-12 text-gray-500">Loading budget plans...</div>
            ) : filteredPlans.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <PuzzlePieceIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                {searchTerm ? (
                  <p>No budget plans found matching "{searchTerm}"</p>
                ) : (
                  <p>No budget plans yet. Create your first plan!</p>
                )}
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredPlans.map((plan) => {
                  const pct = plan.target > 0 ? Math.round((plan.current / plan.target) * 100) : 0;
                  return (
                    <div
                      key={plan.id}
                      className="bg-gray-50 p-4 rounded-lg border hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center">
                          {getIcon(plan.icon)}
                          <div>
                            <span className="font-medium text-gray-900">{plan.name}</span>
                            {(plan.startDate || plan.endDate) && (
                              <p className="text-xs text-gray-500 mt-1">
                                {plan.startDate && plan.endDate
                                  ? `${new Date(plan.startDate).toLocaleDateString()} - ${new Date(plan.endDate).toLocaleDateString()}`
                                  : plan.startDate
                                    ? `From ${new Date(plan.startDate).toLocaleDateString()}`
                                    : `Until ${new Date(plan.endDate!).toLocaleDateString()}`
                                }
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="relative">
                          <button
                            onClick={() => togglePlanMenu(plan.id)}
                            className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                          >
                            <EllipsisVerticalIcon className="h-5 w-5 text-gray-600" />
                          </button>
                          {activePlanMenu === plan.id && (
                            <div className="absolute right-0 mt-1 w-40 bg-white rounded-md shadow-lg border z-10">
                              <button
                                onClick={() => openEditModal(plan)}
                                className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 rounded-t-md"
                              >
                                Edit Plan
                              </button>
                              <button
                                onClick={() => handleDelete(plan.id)}
                                className="block w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-gray-100 rounded-b-md"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-3">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(pct, 100)}%` }}
                        />
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">{formatCurrency(plan.current)}</span>
                        <span className="font-medium text-gray-900">{pct}%</span>
                        <span className="text-gray-600">Target: {formatCurrency(plan.target)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Modal */}
          {showModal && (
            <div className="fixed inset-0 z-50 overflow-y-auto">
              <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={closeModal}></div>

                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {isEditing ? "Edit Budget Plan" : "Add Budget Plan"}
                        </h3>
                        <button
                          type="button"
                          onClick={closeModal}
                          className="text-gray-400 hover:text-gray-600 focus:outline-none"
                        >
                          <XMarkIcon className="h-6 w-6" />
                        </button>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Plan Name
                          </label>
                          <input
                            type="text"
                            {...register('name')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="e.g., Emergency Fund, Vacation"
                          />
                          {errors.name && (
                            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Target Amount
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            {...register('target')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="0.00"
                          />
                          {errors.target && (
                            <p className="mt-1 text-sm text-red-600">{errors.target.message}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Start Date
                          </label>
                          <input
                            type="date"
                            min={new Date().toISOString().split('T')[0]}
                            {...register('startDate')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          />
                          {errors.startDate && (
                            <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            End Date
                          </label>
                          <input
                            type="date"
                            min={new Date().toISOString().split('T')[0]}
                            {...register('endDate')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          />
                          {errors.endDate && (
                            <p className="mt-1 text-sm text-red-600">{errors.endDate.message}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                      <button
                        type="submit"
                        disabled={saveLoading}
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {saveLoading ? 'Saving...' : isEditing ? 'Update Plan' : 'Create Plan'}
                      </button>
                      <button
                        type="button"
                        onClick={closeModal}
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AuthLayout>
  );
}