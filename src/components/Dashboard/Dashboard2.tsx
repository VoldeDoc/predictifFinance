import { BanknotesIcon, CreditCardIcon, WalletIcon } from "@heroicons/react/24/solid"
import { AuthLayout } from "../Layout/layout"
import { Card } from "./Tools/card"
import CreditCard from "./Tools/CreditCard"
import CreditCardBtn from "./Tools/CreditCardBtn"
import DailyLimit from "./Tools/DailyLimit"
import SavingPlan from "./Tools/SavingsPlan"
import CashFlow from "./Tools/Cashflow"
import TransactionTable from "./Tools/TransactionTable"
import PieChart from "./Tools/PieChart"
import RecentActivity from "./Tools/RecentActivity"
import AnalyticsSparkline from "./Tools/AnalyticsChart"

const Dashboard2 = () => {
    return (
        <AuthLayout>
            <div className="px-4 sm:px-6">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* First Column - 32% */}
                    <div className="w-full lg:w-[32%]">
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                            <CreditCard
                                cardNumber="1234567890123456"
                                cardholderName="John Doe"
                                expiryDate="12/23"
                                cvv="1234"
                                cardType="VISA"
                            size="sm"
                            />
                            <CreditCardBtn />
                        </div>
                        <div className="mt-6">
                            <DailyLimit />
                        </div>
                        <div className="mt-6">
                            <SavingPlan />
                        </div>
                    </div>

                    {/* Second Column - 45% */}
                    <div className="w-full lg:w-[45%]">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Card
                                icon={<BanknotesIcon className="h-6 w-6 text-white" />}
                                title="Total Income"
                                amount={5840.75}
                                percentageChange={3.2}
                            />
                            <Card
                                icon={<WalletIcon className="h-6 w-6 text-white" />}
                                title="Total Expense"
                                amount={2350.00}
                                percentageChange={1.8}
                            />
                            <Card
                                icon={<CreditCardIcon className="h-6 w-6 text-white" />}
                                title="Total Savings"
                                amount={1490.25}
                                percentageChange={-0.7}
                            />
                        </div>
                        <div>
                            <CashFlow />
                        </div>

                        <TransactionTable
                            initialPageSize={4}
                            maxHeight="350px"
                        />
                    </div>

                    {/* Third Column - 22% */}
                    <div className="w-full lg:w-[22%]">
                        {/* Pie Chart with tabs */}
                        <PieChart />

                        <RecentActivity />
                    </div>
                </div>
                <div className="px-4 md:px-6 lg:px-4">
                    <AnalyticsSparkline
                        title="Analytics"
                        maxY={50000}
                        lineColor="#3B82F6"
                        fillColor="#93C5FD"
                    />

                </div>
            </div>
        </AuthLayout>
    )
}

export default Dashboard2