import { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

// Define expense category type
interface Category {
  name: string;
  amount: number;
  color: string;
  percentage: number;
}

// Extended type for internal calculations
interface CategoryWithAngles extends Category {
  startAngle: number;
  endAngle: number;
}

interface PieChartProps {
  expenseData?: Category[];
  incomeData?: Category[];
}

export default function PieChart({ expenseData, incomeData }: PieChartProps) {
  const [activeTab, setActiveTab] = useState<'expense' | 'income'>('expense');
  const [selectedMonth, setSelectedMonth] = useState('March');
  
  // Default expense data if none provided
  const defaultExpenseData: Category[] = [
    { name: 'Rent & Living', amount: 2100, color: '#ECF4E9', percentage: 60 },
    { name: 'Investment', amount: 525, color: '#E5E6E6', percentage: 15 },
    { name: 'Education', amount: 420, color: '#002072', percentage: 12 },
    { name: 'Food & Drink', amount: 280, color: '#BCBEBD', percentage: 8 },
    { name: 'Entertainment', amount: 175, color: '#4FB7EF', percentage: 5 }
  ];

  // Default income data
  const defaultIncomeData: Category[] = [
    { name: 'Salary', amount: 3500, color: '#ECF4E9', percentage: 70 },
    { name: 'Freelance', amount: 750, color: '#002072', percentage: 15 },
    { name: 'Investments', amount: 500, color: '#4FB7EF', percentage: 10 },
    { name: 'Other', amount: 250, color: '#BCBEBD', percentage: 5 }
  ];

  // Use provided data or fallback to defaults
  const expenses = expenseData || defaultExpenseData;
  const incomes = incomeData || defaultIncomeData;
  
  // Get current data based on active tab
  const currentData = activeTab === 'expense' ? expenses : incomes;
  const totalAmount = currentData.reduce((sum, item) => sum + item.amount, 0);

  // Calculate angles for each segment
  const dataWithAngles: CategoryWithAngles[] = currentData.map((item, idx) => {
    const previousEndAngle = currentData
      .slice(0, idx)
      .reduce((sum, e) => sum + (e.percentage * 3.6), 0);
    
    return {
      ...item,
      startAngle: previousEndAngle,
      endAngle: previousEndAngle + (item.percentage * 3.6) // Convert to degrees (percentage * 360/100)
    };
  });

  // Generate SVG path for each segment with spacing
  const generatePieSegment = (startAngle: number, endAngle: number, radius: number, innerRadius: number) => {
    // Add spacing between segments (2 degrees)
    const spacingAngle = 2;
    const adjustedStartAngle = startAngle + spacingAngle / 2;
    const adjustedEndAngle = endAngle - spacingAngle / 2;
    
    // Convert angles from degrees to radians
    const startRad = (adjustedStartAngle - 90) * Math.PI / 180;
    const endRad = (adjustedEndAngle - 90) * Math.PI / 180;
    
    const x1 = radius * Math.cos(startRad);
    const y1 = radius * Math.sin(startRad);
    const x2 = radius * Math.cos(endRad);
    const y2 = radius * Math.sin(endRad);
    
    // Inner circle coordinates
    const x3 = innerRadius * Math.cos(endRad);
    const y3 = innerRadius * Math.sin(endRad);
    const x4 = innerRadius * Math.cos(startRad);
    const y4 = innerRadius * Math.sin(startRad);
    
    // Determine if the arc should be drawn as a large arc (> 180 degrees)
    const largeArcFlag = adjustedEndAngle - adjustedStartAngle > 180 ? 1 : 0;
    
    // Create the SVG path for a donut segment
    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4} Z`;
  };

  // Available months for filter
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mt-6">
      {/* Header with tabs and filter */}
      <div className="flex flex-col mb-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold">Statistics</h2>
          
          <div className="relative">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="appearance-none bg-gray-50 px-3 py-1 pr-8 rounded-md text-sm border border-gray-300"
            >
              {months.map(month => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
            <ChevronDownIcon className="absolute right-2 top-2 h-4 w-4 text-gray-500" />
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            className={`py-2 px-4 font-medium text-sm ${
              activeTab === 'expense'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('expense')}
          >
            Expense
          </button>
          <button
            className={`py-2 px-4 font-medium text-sm ${
              activeTab === 'income'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('income')}
          >
            Income
          </button>
        </div>
      </div>
      
      <div className="flex flex-col items-center">
        {/* Pie chart */}
        <div className="relative w-56 h-56 mb-8">
          {/* Center circle with total */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 rounded-full bg-white w-28 h-28 m-auto">
            <p className="text-sm text-gray-500">Total {activeTab === 'expense' ? 'Expense' : 'Income'}</p>
            <p className="font-bold text-lg">${totalAmount.toLocaleString()}</p>
          </div>
          
          {/* SVG for pie chart with increased spacing between segments */}
          <svg viewBox="-100 -100 200 200" className="w-full h-full">
            {dataWithAngles.map((item) => (
              <path
                key={item.name}
                d={generatePieSegment(item.startAngle, item.endAngle, 90, 40)}
                fill={item.color}
                stroke="#fff"
                strokeWidth="2"
              />
            ))}
          </svg>
        </div>
        
        {/* Legend */}
        <div className="w-full space-y-4">
          {dataWithAngles.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="relative mr-3">
                  <div 
                    className="w-8 h-8 rounded-md flex items-center justify-center text-xs font-medium text-gray-700"
                    style={{ backgroundColor: item.color }}
                  >
                    {item.percentage}%
                  </div>
                </div>
                <span className="text-sm font-medium">{item.name}</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-semibold">
                  ${item.amount.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}