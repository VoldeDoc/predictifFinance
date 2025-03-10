import React, { useState, useRef } from 'react';

interface YearData {
  incomeData: number[];
  expenseData: number[];
}

interface TooltipInfo {
  visible: boolean;
  x: number;
  y: number;
  month: string;
  income: number;
  expense: number;
  net: number;
}

export function CashFlow() {
  const [selectedYear, setSelectedYear] = useState('2024');
  const [tooltip, setTooltip] = useState<TooltipInfo>({
    visible: false,
    x: 0,
    y: 0,
    month: '',
    income: 0,
    expense: 0,
    net: 0
  });
  
  const chartRef = useRef<HTMLDivElement>(null);
  
  // Data for different years
  const yearlyData: Record<string, YearData> = {
    '2023': {
      incomeData: [4200, 4500, 5100, 5000, 5400, 5800, 5900, 6100, 6000, 6200, 6300, 6500],
      expenseData: [3200, 3100, 3800, 4000, 3900, 4200, 4500, 4600, 4300, 4800, 4700, 5000]
    },
    '2024': {
      incomeData: [6800, 7000, 7200, 7500, 8000, 8200, 8500, 9000, 9200, 9500, 9800, 10000],
      expenseData: [5200, 5500, 5800, 6000, 6200, 6500, 6800, 7000, 7200, 7500, 7800, 8000]
    },
    '2025': {
      incomeData: [10500, 10800, 11000, 11500, 12000, 12500, 13000, 13500, 14000, 14500, 15000, 15500],
      expenseData: [8500, 8800, 9000, 9500, 9800, 10000, 10200, 10500, 10800, 11000, 11500, 12000]
    }
  };
  
  // Months labels for x-axis
  const monthLabels = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  // Get current year's data
  const currentData = yearlyData[selectedYear];
  
  // Calculate net cash flow
  const netCashFlow = currentData.incomeData.map((income, index) => 
    income - currentData.expenseData[index]
  );

  // Handle mouse over for tooltips
  const handleMouseOver = (event: React.MouseEvent, index: number) => {
    if (!chartRef.current) return;
    
    const rect = chartRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    setTooltip({
      visible: true,
      x: x,
      y: y,
      month: monthLabels[index],
      income: currentData.incomeData[index],
      expense: currentData.expenseData[index],
      net: currentData.incomeData[index] - currentData.expenseData[index]
    });
  };

  const handleMouseOut = () => {
    setTooltip({ ...tooltip, visible: false });
  };
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mt-6 overflow-hidden">
      {/* Header with title, legend and year selector */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">Cash Flow</h2>
          <select 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(e.target.value)}
            className="py-1 px-3 border border-gray-300 rounded-md text-sm"
          >
            <option value="2023">2023</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
          </select>
        </div>
        
        {/* Legend */}
        <div className="flex items-center">
          <div className="flex items-center mr-4">
            <div className="w-3 h-3 bg-blue-500 mr-1"></div>
            <span className="text-xs">Income</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-900 mr-1"></div>
            <span className="text-xs">Expense</span>
          </div>
        </div>
      </div>
      
      {/* Chart container with fixed height */}
      <div className="flex w-full mt-3">
        {/* Y-axis labels */}
        <div className="flex flex-col justify-between h-[250px] pr-2 text-xs text-gray-500 flex-shrink-0">
          <div>$15,000</div>
          <div>$10,000</div>
          <div>$5,000</div>
          <div>$0</div>
          <div>-$5,000</div>
          <div>-$10,000</div>
        </div>
        
        {/* Bar chart */}
        <div className="flex-1 relative" ref={chartRef}>
          {/* Zero line */}
          <div 
            className="absolute w-full h-[1px] bg-gray-400" 
            style={{ top: '60%' }}
          ></div>
          
          <div className="h-[250px] flex items-center">
            {monthLabels.map((month, index) => (
              <div 
                key={month} 
                className="flex-1 h-full relative"
                onMouseOver={(e) => handleMouseOver(e, index)}
                onMouseOut={handleMouseOut}
              >
                <div className="absolute left-0 right-0 mx-auto w-[60%] h-full">
                  {/* Income bar */}
                  <div 
                    className="absolute bottom-[60%] w-full"
                    style={{
                      height: `${(currentData.incomeData[index] / 15000) * 60}%`,
                    }}
                  >
                    <div className="bg-blue-500 w-full h-full rounded-t-sm"></div>
                  </div>
                  
                  {/* Expense bar - positioned directly below income bar */}
                  <div 
                    className="absolute top-[60%] w-full"
                    style={{
                      height: `${(currentData.expenseData[index] / 10000) * 40}%`,
                    }}
                  >
                    <div className="bg-blue-900 w-full h-full rounded-b-sm"></div>
                  </div>
                </div>
                
                {/* Month label */}
                <div className="absolute bottom-[-20px] w-full text-center text-xs text-gray-500">
                  {month}
                </div>
              </div>
            ))}
          </div>
          
          {/* Tooltip */}
          {tooltip.visible && (
            <div 
              className="absolute bg-white p-2 rounded-md shadow-lg text-xs z-10 border border-gray-200"
              style={{ 
                left: `${tooltip.x + 10}px`, 
                top: `${tooltip.y - 80}px`,
                maxWidth: '150px'
              }}
            >
              <div className="font-bold">{tooltip.month}</div>
              <div className="text-blue-500">Income: ${tooltip.income.toLocaleString()}</div>
              <div className="text-blue-900">Expense: ${tooltip.expense.toLocaleString()}</div>
              <div className={tooltip.net >= 0 ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                Net: ${tooltip.net.toLocaleString()}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="mt-8 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-500">Total Income</p>
            <p className="font-semibold">${currentData.incomeData.reduce((a, b) => a + b, 0).toLocaleString()}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Total Expenses</p>
            <p className="font-semibold">${currentData.expenseData.reduce((a, b) => a + b, 0).toLocaleString()}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Net Cash Flow</p>
            <p className="font-semibold">${netCashFlow.reduce((a, b) => a + b, 0).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CashFlow;