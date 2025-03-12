import { useState } from 'react';
import TransactionTable from "@/components/Dashboard/Tools/TransactionTable";
import { BanknotesIcon, ArrowDownTrayIcon, ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import { PiUmbrellaLight } from "react-icons/pi";
import { LiaSatelliteDishSolid } from "react-icons/lia";
import { PiGraduationCapThin } from "react-icons/pi";
import { MdOutlineWorkOutline } from 'react-icons/md';
import { BiShoppingBag } from 'react-icons/bi';
import { IoFastFoodOutline } from 'react-icons/io5';

export const TransactionsComponent = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  // Custom transaction data with the structure you need
  const customTransactionData = [
    { 
      id: '4567890135', 
      name: 'Bonus Payment',
      icon: <MdOutlineWorkOutline className="h-4 w-4 text-blue-600" />,
      account: 'Platinum Plus Visa',
      date: '2024-09-25', 
      time: '11:00 AM',
      amount: 500, 
      description: 'Annual performance bonus',
      status: 'completed' as const,
      // Keep type for filtering purposes
      type: 'income' as const
    },
    { 
      id: '4567890136', 
      name: 'Amazon Purchase',
      icon: <BiShoppingBag className="h-4 w-4 text-blue-600" />,
      account: 'Freedom Unlimited Mastercard',
      date: '2024-09-23', 
      time: '03:15 PM',
      amount: -120.45, 
      description: 'Online shopping',
      status: 'completed' as const,
      type: 'expense' as const
    },
    { 
      id: '4567890137', 
      name: 'Geico Insurance',
      icon: <PiUmbrellaLight className="h-4 w-4 text-blue-600" />,
      account: 'Premium Checking',
      date: '2024-09-20', 
      time: '09:30 AM',
      amount: -450, 
      description: 'Monthly auto insurance payment',
      status: 'completed' as const,
      type: 'expense' as const
    },
    { 
      id: '4567890138', 
      name: 'Dish Network',
      icon: <LiaSatelliteDishSolid className="h-4 w-4 text-blue-600" />,
      account: 'Platinum Plus Visa',
      date: '2024-09-18', 
      time: '02:45 PM',
      amount: -85.99, 
      description: 'Monthly subscription',
      status: 'pending' as const,
      type: 'expense' as const
    },
    { 
      id: '4567890139', 
      name: 'Coursera',
      icon: <PiGraduationCapThin className="h-4 w-4 text-blue-600" />,
      account: 'Freedom Unlimited Mastercard',
      date: '2024-09-15', 
      time: '10:15 AM',
      amount: -49.99, 
      description: 'Online course subscription',
      status: 'completed' as const,
      type: 'expense' as const
    },
    { 
      id: '4567890140', 
      name: 'Restaurant Dinner',
      icon: <IoFastFoodOutline className="h-4 w-4 text-blue-600" />,
      account: 'Premium Checking',
      date: '2024-09-10', 
      time: '08:20 PM',
      amount: -87.50, 
      description: 'Family dinner at Italian restaurant',
      status: 'failed' as const,
      type: 'expense' as const
    }
  ];

  // Filter transactions based on active filter
  const filteredData = activeFilter === 'all' 
    ? customTransactionData 
    : customTransactionData.filter(tx => 
        activeFilter === 'income' ? tx.type === 'income' : tx.type === 'expense'
      );

  // Custom table headers - explicitly excluding category and type
  const customHeaders = [
    { key: 'name', label: 'Transaction Name' },
    { key: 'account', label: 'Account' },
    { key: 'id', label: 'Transaction ID' },
    { key: 'date', label: 'Date & Time' },
    { key: 'amount', label: 'Amount' },
    { key: 'description', label: 'Note' },
    { key: 'status', label: 'Status' }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">Transactions</h1>
      
      {/* Quick action buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <button 
          className={`flex items-center justify-center gap-2 p-4 rounded-lg bg-white border ${
            activeFilter === 'all' ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
          } hover:bg-gray-50 transition-colors`}
          onClick={() => setActiveFilter('all')}
        >
          <span className="bg-blue-100 p-2 rounded-full">
            <BanknotesIcon className="h-5 w-5 text-blue-600" />
          </span>
          <span>All Transactions</span>
        </button>
        <button 
          className={`flex items-center justify-center gap-2 p-4 rounded-lg bg-white border ${
            activeFilter === 'income' ? 'border-green-500 ring-2 ring-green-200' : 'border-gray-200'
          } hover:bg-gray-50 transition-colors`}
          onClick={() => setActiveFilter('income')}
        >
          <span className="bg-green-100 p-2 rounded-full">
            <ArrowDownTrayIcon className="h-5 w-5 text-green-600" />
          </span>
          <span>Income</span>
        </button>
        <button 
          className={`flex items-center justify-center gap-2 p-4 rounded-lg bg-white border ${
            activeFilter === 'expense' ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-200'
          } hover:bg-gray-50 transition-colors`}
          onClick={() => setActiveFilter('expense')}
        >
          <span className="bg-red-100 p-2 rounded-full">
            <ArrowUpTrayIcon className="h-5 w-5 text-red-600" />
          </span>
          <span>Expenses</span>
        </button>
      </div>
      
      {/* Transaction table with customized props */}
      <TransactionTable 
        title="Transaction History"
        showTitle={true}
        initialPageSize={10}
        maxHeight="600px"
        customData={filteredData}
        customHeaders={customHeaders}
        renderNameWithIcon={true}
        hideCategory={true}  // Add this prop to explicitly hide the category
        hideType={true}      // Add this prop to explicitly hide the type
      />
    </div>
  );
};

export default TransactionsComponent;