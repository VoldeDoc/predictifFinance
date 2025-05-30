import { useState, useEffect } from "react";
import UseFinanceHook from "@/hooks/UseFinance";
import {
  PlusIcon,
  EllipsisVerticalIcon,
  HomeIcon,
  PuzzlePieceIcon,
} from "@heroicons/react/24/outline";
import { CiWarning } from "react-icons/ci";
import { PiAirplaneTilt } from "react-icons/pi";
import { Savings, SavingPlanItem } from "@/types/index";

export default function SavingPlan({ currency = "$" }: Savings) {
  const {
    getBudgetPlans,
    createBudgetPlan,
    updateBudgetPlan,
    deleteBudgetPlan,
  } = UseFinanceHook();

  const [plans, setPlans] = useState<
    (SavingPlanItem & { startDate?: string; endDate?: string })[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [activePlanMenu, setActivePlanMenu] = useState<string | null>(null);

  // modal states
  const [showAddPlanModal, setShowAddPlanModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // form fields
  const [formId, setFormId] = useState<string | null>(null);
  const [formName, setFormName] = useState("");
  const [formTarget, setFormTarget] = useState("");
  const [formStartDate, setFormStartDate] = useState("");
  const [formEndDate, setFormEndDate] = useState("");

  useEffect(() => {
    (async () => {
      const apiPlans = await getBudgetPlans();
      setPlans(
        apiPlans.map((p: any) => ({
          id: p.id,
          name: p.label,
          target: p.budget_amount,
          current: 0,
          icon: "default",
          startDate: p.startDate || "",
          endDate: p.endDate || "",
        }))
      );
    })();
  }, []);

  const totalSavings = plans.reduce((sum, plan) => sum + plan.target, 0);
  const formatCurrency = (amount: number) =>
    `${currency}${amount.toLocaleString()}`;

  const openAdd = () => {
    setFormId(null);
    setFormName("");
    setFormTarget("");
    setFormStartDate("");
    setFormEndDate("");
    setShowAddPlanModal(true);
    setShowEditModal(false);
  };

  const openEdit = (plan: any) => {
    setFormId(plan.id);
    setFormName(plan.name);
    setFormTarget(String(plan.target));
    setFormStartDate(plan.startDate || "");
    setFormEndDate(plan.endDate || "");
    setShowEditModal(true);
    setShowAddPlanModal(false);
    setActivePlanMenu(null);
  };

  const handleSave = async () => {
    if (!formName || !formTarget) return;
    setLoading(true);
    try {
      if (formId) {
        // Update existing
        await updateBudgetPlan({
          id: formId,
          label: formName,
          budget_amount: formTarget,
          detail: "",
          startDate: formStartDate,
          endDate: formEndDate,
        });
        setPlans((prev) =>
          prev.map((p) =>
            p.id === formId
              ? {
                  ...p,
                  name: formName,
                  target: Number(formTarget),
                  startDate: formStartDate,
                  endDate: formEndDate,
                }
              : p
          )
        );
      } else {
        // Create new
        const created: any = await createBudgetPlan({
          label: formName,
          budget_amount: formTarget,
          startDate: formStartDate,
          endDate: formEndDate,
        });
        setPlans((prev) => [
          ...prev,
          {
            id: created.id,
            name: created.label,
            target: +created.budget_amount,
            current: 0,
            icon: "default",
            startDate: formStartDate,
            endDate: formEndDate,
          },
        ]);
      }
      setShowAddPlanModal(false);
      setShowEditModal(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      await deleteBudgetPlan(id);
      setPlans((prev) => prev.filter((p) => p.id !== id));
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
      setActivePlanMenu(null);
    }
  };

  const getIcon = (iconType?: string) => {
    switch (iconType) {
      case "bank":
        return <CiWarning className="w-7 h-7 mr-2 p-1 bg-blue-500" />;
      case "travel":
        return <PiAirplaneTilt className="w-7 h-7 mr-2 p-1 bg-blue-500" />;
      case "home":
        return <HomeIcon className="w-7 h-7 mr-2 p-1 bg-blue-500" />;
      default:
        return <PuzzlePieceIcon className="w-4 h-4 mr-2 text-gray-500" />;
    }
  };

  const togglePlanMenu = (planId: string) => {
    setActivePlanMenu((cur) => (cur === planId ? null : planId));
  };

  return (
    <>
      <div className="bg-gray-50 p-5 rounded-lg mt-5 shadow-sm">
        <div className="flex justify-between">
          <div>
            <h3 className="font-bold text-gray-800 text-base">Savings Plan</h3>
            <h5 className="text-gray-800 text-xs">Total savings</h5>
            <h1 className="font-bold">{formatCurrency(totalSavings)}</h1>
          </div>
          <button
            onClick={openAdd}
            className="text-xs text-gray-800 flex items-center hover:text-blue-600"
          >
            <PlusIcon className="w-4 h-4 mr-1" />
            {loading ? "..." : "Add Plan"}
          </button>
        </div>

        <div className="mt-5 space-y-4">
          {plans.map((plan) => {
            const pct = Math.round((plan.current / plan.target) * 100);
            return (
              <div
                key={plan.id}
                className="bg-gray-50 p-3 rounded-md shadow"
              >
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center">
                    {getIcon(plan.icon)}
                    <span className="font-medium text-sm">{plan.name}</span>
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => togglePlanMenu(plan.id)}
                      className="p-1 rounded-full hover:bg-gray-100"
                    >
                      <EllipsisVerticalIcon className="h-5 w-5 text-gray-600" />
                    </button>
                    {activePlanMenu === plan.id && (
                      <div className="absolute right-0 mt-1 w-40 bg-white rounded-md shadow-lg z-10">
                        <button
                          onClick={() => openEdit(plan)}
                          className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Edit Plan
                        </button>
                        <button
                          onClick={() => handleDelete(plan.id)}
                          className="block w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                {/* progress */}
                <div className="w-full h-2 bg-blue-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="flex justify-between mt-1 text-xs text-gray-500">
                  <span>{formatCurrency(plan.current)}</span>
                  <span>{pct}%</span>
                  <span>Target: {formatCurrency(plan.target)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {(showAddPlanModal || showEditModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-80">
            <h3 className="text-lg font-semibold mb-4">
              {showEditModal ? "Edit Plan" : "Add Plan"}
            </h3>

            {/* Name */}
            <label className="block text-sm mb-1">Plan Name</label>
            <input
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="w-full mb-4 p-2 border rounded"
            />

            {/* Target */}
            <label className="block text-sm mb-1">Target Amount</label>
            <input
              type="number"
              value={formTarget}
              onChange={(e) => setFormTarget(e.target.value)}
              className="w-full mb-4 p-2 border rounded"
            />

            {/* Start Date */}
            <label className="block text-sm mb-1">Start Date</label>
            <input
              type="date"
              value={formStartDate}
              onChange={(e) => setFormStartDate(e.target.value)}
              className="w-full mb-4 p-2 border rounded"
            />

            {/* End Date */}
            <label className="block text-sm mb-1">End Date</label>
            <input
              type="date"
              value={formEndDate}
              onChange={(e) => setFormEndDate(e.target.value)}
              className="w-full mb-4 p-2 border rounded"
            />

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowAddPlanModal(false);
                  setShowEditModal(false);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
