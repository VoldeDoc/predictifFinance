import { useState } from 'react';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import { DailyLimitProps } from '@/types';


export default function SpendingLimit({ 
  spentAmount = 4500, 
  limit = 10000, 
  currency = '$' 
}: DailyLimitProps) {
    const [showOptions, setShowOptions] = useState(false);
    
    // Calculate percentage spent
    const percentageSpent = Math.min(Math.round((spentAmount / limit) * 100), 100);
    
    // Format currency values
    const formatCurrency = (value: number) => {
      return `${currency}${value.toLocaleString()}`;
    };
    
    return (
        <div className="bg-gray-50 p-4 rounded-lg shadow-md my-10">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-800 text-xs">Spending Limit</h3>
                
                <div className="relative">
                    <button 
                      onClick={() => setShowOptions(!showOptions)}
                      className="p-1 rounded-full hover:bg-gray-100"
                    >
                        <EllipsisVerticalIcon className="h-5 w-5 text-gray-600" />
                    </button>
                    
                    {showOptions && (
                        <div className="absolute right-0 mt-1 w-40 bg-white rounded-md shadow-lg z-10">
                            <div className="py-1">
                                <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                    Adjust Limit
                                </button>
                                <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                    View History
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            <div className="mb-2">
                <span className="text-s, font-bold text-gray-800">{formatCurrency(spentAmount)}</span>
                <span className="text-xs text-gray-500 ml-1">spent of {formatCurrency(limit)}</span>
            </div>
            
            <div className="w-full h-5 bg-[#002072] rounded-lg overflow-hidden">
                <div 
                    className="h-full bg-blue-600 rounded-lg"
                    style={{ width: `${percentageSpent}%` }}
                ></div>
            </div>
            
            <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-500">{percentageSpent}% Used</span>
                <span className="text-xs text-gray-500">{formatCurrency(limit - spentAmount)} Remaining</span>
            </div>
        </div>
    );
}