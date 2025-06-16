import { BiTrendingUp } from "react-icons/bi";
import { AuthLayout } from "../Layout/layout";
import { PiChatCenteredTextLight } from "react-icons/pi";
import SavingPlan from "../Dashboard/Tools/BudgetPlan";
import { PiAirplaneTiltThin } from "react-icons/pi";
import TransactionsComponent from "../PrediciveAccount/compon/TransactionComponent";
import BalanceChart from "./Component/BalanceChart";
const Savings = () => {
    // Calculate the percentage for vacation fund
    const percentage = (3000 / 5000) * 100;

    return (
        <AuthLayout>
            <>
                <div className="px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-blue-300 shadow rounded-lg p-4">
                            <div className="flex justify-between">
                                <div>
                                    <h5 className="font-normal">Total Savings</h5>
                                    <div className="flex">
                                        <h4 className="text-blue-800 text-xl">$47,600</h4>
                                        <p className="bg-blue-400 rounded-xl p-1 text-xs flex items-center ml-2"><BiTrendingUp className="mr-1" /> 4.20 %</p>
                                    </div>
                                </div>
                                <div className="rounded-full bg-white p-4">
                                    <PiChatCenteredTextLight className="text-3xl " />
                                </div>
                            </div>
                        </div>
                        <div className="bg-blue-300 shadow rounded-lg p-4">
                            <div className="flex justify-between">
                                <div>
                                    <h5 className="font-normal">Total Target</h5>
                                    <div className="flex">
                                        <h4 className="text-blue-800 text-xl">$87,400</h4>
                                        <p className="bg-blue-400 rounded-xl p-1 text-xs flex items-center ml-2"><BiTrendingUp className="mr-1" /> 4.20 %</p>
                                    </div>
                                </div>
                                <div className="rounded-full bg-white p-4">
                                    <PiChatCenteredTextLight className="text-3xl " />
                                </div>
                            </div>
                        </div>
                        <div className="bg-blue-300 shadow rounded-lg p-4">
                            <div className="flex justify-between">
                                <div>
                                    <h5 className="font-normal">Total Plans</h5>
                                    <div className="flex">
                                        <h4 className="text-blue-800 text-xl">27</h4>
                                        <p className="bg-blue-400 rounded-xl p-1 text-xs flex items-center ml-2"><BiTrendingUp className="mr-1" /> 4.20 %</p>
                                    </div>
                                </div>
                                <div className="rounded-full bg-white p-4">
                                    <PiChatCenteredTextLight className="text-3xl " />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col lg:flex-row gap-6 mt-6">
                        <div className="w-full lg:w-[30%] p-4">
                            <SavingPlan />
                        </div>
                        <div className="w-full lg:w-[70%] p-4">
                            <div className="flex flex-col lg:flex-row gap-6">
                                <div className="w-full lg:w-[35%] p-4 bg-blue-300 shadow rounded-lg">
                                    <div className="flex items-center space-x-3 mb-4">
                                        <div className="rounded-full p-2 bg-white">
                                            <PiAirplaneTiltThin className="text-3xl text-blue-300" />
                                        </div>
                                        <h3 className="font-medium text-lg">Vacation Fund</h3>
                                    </div>

                                    <div>
                                        <h3><span className="text-lg">$3,000</span> / <span className="text-base text-gray-700">$5,000</span></h3>
                                    </div>

                                    <div className="w-full h-10 bg-blue-100 rounded-lg overflow-hidden mt-5">
                                        <div
                                            className="h-full bg-gray-500 rounded-lg"
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between mt-1 mb-4">
                                        <h3>In progress</h3>
                                        <h3>60%</h3>
                                    </div>

                                    <div className="border-t border-red-300 my-4"></div>

                                    <div className="flex justify-between py-3">
                                        <div>
                                            <h5 className="text-gray-800">Member</h5>
                                        </div>
                                        <div className="col-span-2">
                                            <div className="flex items-center space-x-2">
                                                <div className="bg-blue-500 p-2 rounded-full"></div>
                                                <h5 className="text-gray-800">Andrew Forbist</h5>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-between py-3">
                                        <div>
                                            <h5 className="text-gray-800">Due Date</h5>
                                        </div>
                                        <div className="col-span-2">
                                            <h5 className="text-gray-800">31,December, 2018</h5>
                                        </div>
                                    </div>

                                    <div className="flex justify-between py-3">
                                        <div>
                                            <h5 className="text-gray-800">Remaining</h5>
                                        </div>
                                        <div className="col-span-2">
                                            <h5 className="text-gray-800">95 days</h5>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full lg:w-[65%] p-4 bg-white shadow rounded-lg">
                                    <div className="border-gray-500 rounded-xl p-4 shadow-lg my-5">
                                        <h1 className="text-base ">Saving Tips </h1>
                                        <ul className="list-disc list-inside ">
                                            <li className="text-sm ">Mission: Save $21 per day for 95 days to meet goal.</li>
                                            <li className="text-sm text-gray-500">Cut unnecessary subscriptions, save more.</li>
                                            <li className="text-sm text-gray-500">Skip eating out twice a week.</li>
                                            <li className="text-sm text-gray-500">Automate savings from paycheck.</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <BalanceChart />
                                    </div>
                                </div>
                            </div>
                            <div className="py-10">
                                <TransactionsComponent />
                            </div>
                        </div>
                    </div>
                </div>
            </>
        </AuthLayout>
    );
};

export default Savings;
