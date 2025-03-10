import { useState } from "react";
import { PlusIcon, EllipsisVerticalIcon, HomeIcon, PuzzlePieceIcon } from "@heroicons/react/24/outline";
import { CiWarning } from "react-icons/ci";
import { PiAirplaneTilt } from "react-icons/pi";
import {Savings,SavingPlanItem} from '@/types/index'

export default function SavingPlan({
    savings = 84500,
    currency = "$"
}: Savings) {
    const [showAddPlanModal, setShowAddPlanModal] = useState(false);
    const [planName, setPlanName] = useState("");
    const [planTarget, setPlanTarget] = useState("");
    const [activePlanMenu, setActivePlanMenu] = useState<string | null>(null);
    const [plans, setPlans] = useState<SavingPlanItem[]>([
        { id: "1", name: "Emergency Fund", target: 10000, current: 5000, icon: "bank" },
        { id: "2", name: "Vacation Fund", target: 5000, current: 3800, icon: "travel" },
        { id: "3", name: "Home Down Payment", target: 20000, current: 7250, icon: "home" },
    ]);

    const formatCurrency = (amount: number) => {
        return `${currency}${amount.toLocaleString()}`;
    };

    const handleAddPlan = () => {
        if (planName && planTarget) {
            const newPlan: SavingPlanItem = {
                id: Date.now().toString(),
                name: planName,
                target: Number(planTarget),
                current: 0,
                icon: "default"
            };
            setPlans([...plans, newPlan]);
            setPlanName("");
            setPlanTarget("");
            setShowAddPlanModal(false);
        }
    };

    const getIcon = (iconType: string | undefined) => {
        switch (iconType) {
            case 'bank':
                return <CiWarning className="w-7 h-7 mr-2 p-1 bg-blue-500" />;
            case 'travel':
                return <PiAirplaneTilt className="w-7 h-7 mr-2 p-1 bg-blue-500" />;
            case 'home':
                return <HomeIcon className="w-7 h-7 mr-2 p-1 bg-blue-500" />;
            default:
                return <PuzzlePieceIcon className="w-4 h-4 mr-2 text-gray-500" />;
        }
    };

    const togglePlanMenu = (planId: string) => {
        if (activePlanMenu === planId) {
            setActivePlanMenu(null);
        } else {
            setActivePlanMenu(planId);
        }
    };

    return (
        <>
            <div className="bg-gray-50 p-5 rounded-lg mt-5 shadow-sm">
                <div className="flex justify-between">
                    <div>
                        <h3 className="font-bold text-gray-800 text-base">Savings Plan</h3>
                        <h5 className="text-gray-800 text-xs">Total savings</h5>
                        <h1 className="font-bold">{formatCurrency(savings)}</h1>
                    </div>
                    <div className="relative">
                        <h1
                            onClick={() => setShowAddPlanModal(true)}
                            className="text-xs text-gray-800 cursor-pointer flex items-center hover:text-blue-600"
                        >
                            <PlusIcon className="w-4 h-4 mr-1" /> Add Plan
                        </h1>
                    </div>
                </div>

                {/* Plans List */}
                <div className="mt-5 space-y-4">
                    {plans.map(plan => {
                        const percentage = Math.round((plan.current / plan.target) * 100);

                        return (
                            <div key={plan.id} className="bg-gray-50 p-3 rounded-md shadow">
                                <div className="flex justify-between items-center mb-1">
                                    <div className="flex items-center">
                                        {getIcon(plan.icon)}
                                        <span className="font-medium text-sm">{plan.name}</span>
                                    </div>
                                    <div className="flex items-center">
                                  
                                        <div className="relative">
                                            <button
                                                onClick={() => togglePlanMenu(plan.id)}
                                                className="p-1 rounded-full hover:bg-gray-100"
                                            >
                                                <EllipsisVerticalIcon className="h-5 w-5 text-gray-600" />
                                            </button>

                                            {activePlanMenu === plan.id && (
                                                <div className="absolute right-0 mt-1 w-40 bg-white rounded-md shadow-lg z-10">
                                                    <div className="py-1">
                                                        <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                            Edit Plan
                                                        </button>
                                                        <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                            Add Funds
                                                        </button>
                                                        <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Progress bar */}
                                <div className="w-full h-2 bg-blue-900 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-blue-600 rounded-full"
                                        style={{ width: `${percentage}%` }}
                                    ></div>
                                </div>
                                <div className="flex justify-between">

                                    <div className=" mt-1 space-x-3">
                                        <span className="text-xs text-gray-500">
                                            {formatCurrency(plan.current)}
                                        </span>
                                        <span className="text-xs text-gray-500">{percentage}% </span>
                                    </div>
                                    <div>
                                        <span className="text-xs text-gray-500">
                                            Target: {formatCurrency(plan.target)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Add Plan Modal */}
            {showAddPlanModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-80">
                        <h3 className="text-lg font-semibold mb-4">Add Savings Plan</h3>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Plan Name
                            </label>
                            <input
                                type="text"
                                value={planName}
                                onChange={(e) => setPlanName(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                placeholder="e.g. New Car"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Target Amount
                            </label>
                            <input
                                type="number"
                                value={planTarget}
                                onChange={(e) => setPlanTarget(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                placeholder="5000"
                            />
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowAddPlanModal(false)}
                                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddPlan}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                            >
                                Add Plan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}