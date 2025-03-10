import React, { useState } from 'react';
import { 
  EllipsisVerticalIcon,
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon, 
  CreditCardIcon,
} from '@heroicons/react/24/outline';
import { CardProps } from '@/types';



// Single card component
export function Card({
  icon = <CreditCardIcon className="h-3 w-3 text-white" />,
  title = "Card Title",
  amount = 1250.50,
  percentageChange = 2.5,
  currency = "$"
}: CardProps) {
  const [showMenu, setShowMenu] = useState(false);

  // Format currency
  const formatCurrency = (value: number) => {
    return `${currency}${value.toLocaleString()}`;
  };

  // Determine if trend is up or down
  const isPositiveTrend = percentageChange >= 0;
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      {/* Top row with icon and menu */}
      <div className="flex justify-between items-center mb-4">
        <div className="bg-blue-500 p-1.5 rounded-md">
          {React.cloneElement(icon as React.ReactElement, { className: "h-3 w-3 text-white" })}
        </div>
        
        <div className="relative">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <EllipsisVerticalIcon className="h-5 w-5 text-gray-600" />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 mt-1 w-40 bg-white rounded-md shadow-lg z-10">
              <div className="py-1">
                <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  View Details
                </button>
                <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Edit
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Trending indicator */}
      <div className="flex items-center mb-2">
        <div className={`flex items-center ${isPositiveTrend ? 'text-green-500' : 'text-red-500'}`}>
          {isPositiveTrend ? 
            <ArrowTrendingUpIcon className="h-4 w-4 mr-1" /> : 
            <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />
          }
          <span className="text-sm font-medium">{Math.abs(percentageChange)}%</span>
        </div>
      </div>
      
      {/* Price/Amount */}
      <div className="mb-1">
        <span className="text-xl font-bold text-gray-800">{formatCurrency(amount)}</span>
      </div>
      
      {/* Title */}
      <div>
        <h3 className="text-sm text-gray-500">{title}</h3>
      </div>
    </div>
  );
}