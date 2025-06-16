import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Link } from 'react-router-dom';
import UseFinanceHook from "@/hooks/UseFinance";
import {
  PlusIcon,
  EllipsisVerticalIcon,
  HomeIcon,
  PuzzlePieceIcon,
  ArrowRightIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { CiWarning } from "react-icons/ci";
import { PiAirplaneTilt } from "react-icons/pi";
import { BudgetPlanItem, Budgets } from "@/types/index";

interface ExtendedBudgetPlan extends BudgetPlanItem {
  startDate?: string;
  endDate?: string;
  income: number;
  expenses: number;
  netAmount: number;
}

export default function SavingPlan({ currency = "$" }: Budgets) {
  const {
    getBudgetPlans,
    deleteBudgetPlan,
    getBudgetPlansId,
  } = UseFinanceHook();

  const [plans, setPlans] = useState<ExtendedBudgetPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [activePlanMenu, setActivePlanMenu] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    planId: string;
    planName: string;
  }>({
    isOpen: false,
    planId: '',
    planName: ''
  });

  useEffect(() => {
    loadPlans();
  }, []);

  const calculateFinancialData = async (planId: string) => {
    try {
      const planDetails = await getBudgetPlansId(planId);
      
      if (!planDetails) {
        console.warn('No response received for plan:', planId);
        return { income: 0, expenses: 0, netAmount: 0 };
      }

      let incomeData = [];
      let expenseData = [];

      if (planDetails.data) {
        console.log('Found data property:', planDetails.data);
        
        if (planDetails.data["0"]) {
          const mainData = planDetails.data["0"];
          console.log('Found numbered data:', mainData);
        }
        
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

      const totalIncome = incomeData.reduce((sum: number, item: any) => {
        const amount = Number(item.amount || item.value || 0);
        return sum + amount;
      }, 0);

      const totalExpenses = expenseData.reduce((sum: number, item: any) => {
        const amount = Number(item.amount || item.value || 0);
        return sum + amount;
      }, 0);

      const netAmount = totalIncome - totalExpenses;

      return {
        income: totalIncome,
        expenses: totalExpenses,
        netAmount
      };
    } catch (error) {
      console.error('Error fetching plan details for ID:', planId, error);
      return { income: 0, expenses: 0, netAmount: 0 };
    }
  };

  const loadPlans = async () => {
    setLoading(true);
    try {
      const apiPlans = await getBudgetPlans();
      
      if (!apiPlans || !Array.isArray(apiPlans)) {
        console.warn('Invalid plans data received:', apiPlans);
        setPlans([]);
        return;
      }
      
      const plansWithFinancials: ExtendedBudgetPlan[] = [];
      
      for (const p of apiPlans) {
        try {
          const basicPlan: ExtendedBudgetPlan = {
            id: p.id,
            name: p.label || p.name || 'Unnamed Plan',
            target: Number(p.budget_amount || p.target || 0),
            current: 0,
            icon: "default",
            startDate: p.startDate || "",
            endDate: p.endDate || "",
            income: 0,
            expenses: 0,
            netAmount: 0,
          };
          
          try {
            const financialData = await calculateFinancialData(p.id);
            basicPlan.income = financialData.income;
            basicPlan.expenses = financialData.expenses;
            basicPlan.netAmount = financialData.netAmount;
            basicPlan.current = financialData.netAmount;
          } catch (financialError) {
            console.warn('Could not fetch financial data for plan:', p.id, financialError);
          }
          
          plansWithFinancials.push(basicPlan);
        } catch (error) {
          console.error('Error processing plan:', p.id, error);
          plansWithFinancials.push({
            id: p.id,
            name: p.label || 'Error Loading Plan',
            target: Number(p.budget_amount || 0),
            current: 0,
            icon: "default",
            startDate: p.startDate || "",
            endDate: p.endDate || "",
            income: 0,
            expenses: 0,
            netAmount: 0,
          });
        }
      }
      
      setPlans(plansWithFinancials);
    } catch (error) {
      console.error('Error loading plans:', error);
      toast.error('Failed to load budget plans. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Show only first 3 plans for dashboard
  const displayedPlans = plans.slice(0, 3);
  const hasMorePlans = plans.length > 3;

  const totalBudget = plans.reduce((sum, plan) => sum + plan.target, 0);
  const formatCurrency = (amount: number) => {
    const sign = amount < 0 ? '-' : '';
    return `${sign}${currency}${Math.abs(amount).toLocaleString()}`;
  };

  const getProgressInfo = (plan: ExtendedBudgetPlan) => {
    const progressPercent = plan.target > 0 ? (plan.netAmount / plan.target) * 100 : 0;
    const isNegative = plan.netAmount < 0;
    const isOverTarget = plan.netAmount > plan.target && plan.netAmount > 0;
    const remaining = plan.target - plan.netAmount;

    let progressColor = 'bg-gray-300';
    let status = 'No Data';
    
    if (plan.income === 0 && plan.expenses === 0) {
      progressColor = 'bg-gray-300';
      status = 'No Data';
    } else if (isNegative) {
      progressColor = 'bg-black';
      status = 'Budget';
    } else if (isOverTarget) {
      progressColor = 'bg-blue-500';
      status = 'Gain';
    } else {
      progressColor = 'bg-blue-500';
      status = 'Gain';
    }

    return {
      progressPercent: Math.abs(progressPercent),
      isNegative,
      isOverTarget,
      remaining,
      progressColor,
      status
    };
  };

  const handleDeleteClick = (id: string, name: string) => {
    setDeleteModal({
      isOpen: true,
      planId: id,
      planName: name
    });
    setActivePlanMenu(null);
  };

  const handleDeleteConfirm = async () => {
    setLoading(true);
    try {
      await deleteBudgetPlan(deleteModal.planId);
      setPlans((prev) => prev.filter((p) => p.id !== deleteModal.planId));
      toast.success('Budget plan deleted successfully!');
      setDeleteModal({ isOpen: false, planId: '', planName: '' });
    } catch (error) {
      console.error('Error deleting plan:', error);
      toast.error('Failed to delete budget plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, planId: '', planName: '' });
  };

  const getIcon = (iconType?: string) => {
    const iconClass = "w-4 h-4 mr-2 text-gray-500";
    switch (iconType) {
      case "bank":
        return <CiWarning className={iconClass} />;
      case "travel":
        return <PiAirplaneTilt className={iconClass} />;
      case "home":
        return <HomeIcon className={iconClass} />;
      default:
        return <PuzzlePieceIcon className={iconClass} />;
    }
  };

  const togglePlanMenu = (planId: string) => {
    setActivePlanMenu((cur) => (cur === planId ? null : planId));
  };

  return (
    <>
      <div className="bg-white p-5 rounded-lg shadow-sm border">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-gray-800 text-lg">Budget Plan</h3>
            <p className="text-gray-600 text-sm mt-1">Total budget</p>
            <h1 className="font-bold text-2xl text-gray-900 mt-1">
              {formatCurrency(totalBudget)}
            </h1>
          </div>
          <Link
            to="/add-budget"
            className="flex items-center px-3 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <PlusIcon className="w-4 h-4 mr-1" />
            Add Plan
          </Link>
        </div>

        <div className="mt-6 space-y-4">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading budget...</div>
          ) : displayedPlans.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <PuzzlePieceIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No Budget plans yet. Create your first plan!</p>
            </div>
          ) : (
            <>
              {displayedPlans.map((plan) => {
                const progressInfo = getProgressInfo(plan);
                const hasFinancialData = plan.income > 0 || plan.expenses > 0;
                
                return (
                  <div
                    key={plan.id}
                    className="bg-gray-50 p-4 rounded-lg border hover:shadow-sm transition-shadow"
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
                            <Link
                              to={`/edit-budget/${plan.id}`}
                              className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 rounded-t-md"
                              onClick={() => setActivePlanMenu(null)}
                            >
                              Edit Plan
                            </Link>
                            <button
                              onClick={() => handleDeleteClick(plan.id, plan.name)}
                              className="block w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-gray-100 rounded-b-md"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Simple Financial Summary */}
                    {hasFinancialData ? (
                      <div className="grid grid-cols-3 gap-3 mb-3 text-sm">
                        <div className="text-center">
                          <p className="text-gray-500">Income</p>
                          <p className="font-semibold text-green-600">{formatCurrency(plan.income)}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-500">Expenses</p>
                          <p className="font-semibold text-red-600">{formatCurrency(plan.expenses)}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-500">Net</p>
                          <p className={`font-semibold ${plan.netAmount >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                            {formatCurrency(plan.netAmount)}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-3 text-sm text-gray-500 bg-gray-50 rounded mb-3">
                        No financial data yet
                      </div>
                    )}
                    
                    {/* Simple Progress Bar */}
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
                      <div
                        className={`h-full ${progressInfo.progressColor} rounded-full`}
                        style={{ width: `${Math.min(progressInfo.progressPercent, 100)}%` }}
                      />
                    </div>
                    
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center space-x-2">
                        <span className={`font-medium ${progressInfo.isNegative ? 'text-black' : 'text-gray-900'}`}>
                          {formatCurrency(plan.netAmount)}
                        </span>
                        {progressInfo.status !== 'No Data' && (
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            progressInfo.status === 'Budget' 
                              ? 'bg-black text-white' 
                              : progressInfo.status === 'Gain'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {progressInfo.status}
                          </span>
                        )}
                      </div>
                      <span className="text-gray-500">
                        {progressInfo.progressPercent.toFixed(1)}% of {formatCurrency(plan.target)}
                      </span>
                    </div>
                  </div>
                );
              })}
              
              {/* View All Link */}
              {hasMorePlans && (
                <Link 
                  to="/user-budgets"
                  className="flex items-center justify-center py-3 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-md transition-colors border border-indigo-200"
                >
                  View All Budget Plans ({plans.length})
                  <ArrowRightIcon className="w-4 h-4 ml-1" />
                </Link>
              )}
            </>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-500 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Delete Budget Plan
                </h3>
              </div>
              <button
                onClick={handleDeleteCancel}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete the budget plan 
                <span className="font-semibold text-gray-900"> "{deleteModal.planName}"</span>?
              </p>
              <p className="text-sm text-red-600">
                This action cannot be undone. All associated data will be permanently removed.
              </p>
            </div>

            <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50 rounded-b-lg">
              <button
                onClick={handleDeleteCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Deleting...' : 'Delete Plan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}