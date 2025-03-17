import React, { useState } from 'react';
import { 
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { ChevronDownIcon } from '@heroicons/react/24/solid';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

interface BalanceChartProps {
  title?: string;
  className?: string;
}

const BalanceChart: React.FC<BalanceChartProps> = ({ 
  title = "Balance",
  className = "" 
}) => {
  const [activeFilter, setActiveFilter] = useState<'week' | 'month' | 'year'>('year');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Sample balance data for the year
  const balanceData = {
    year: [2800, 3200, 2950, 3800, 2600, 3100, 3600, 3950, 4200, 3800, 4500, 5200],
    month: [3100, 3400, 3200, 3600, 3800, 3700, 3900, 4100, 3950, 4200, 4000, 4300, 4500, 4600, 4400, 4700, 4900, 5000, 4800, 5100, 5200, 5300, 5100, 5000, 5200, 5100, 5300, 5400, 5500, 5200],
    week: [4800, 4900, 5100, 5000, 5200, 5400, 5500]
  };

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const weeks = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const monthDays = Array.from({ length: 30 }, (_, i) => (i + 1).toString());

  // Get labels based on active filter
  const getLabels = () => {
    switch (activeFilter) {
      case 'week':
        return weeks;
      case 'month':
        return monthDays;
      case 'year':
      default:
        return months;
    }
  };

  // Get data based on active filter
  const getData = () => {
    return balanceData[activeFilter];
  };

  // Custom tooltip
  const getOrCreateTooltip = (chart: any) => {
    let tooltipEl = chart.canvas.parentNode.querySelector('div.balance-tooltip');

    if (!tooltipEl) {
      tooltipEl = document.createElement('div');
      tooltipEl.classList.add('balance-tooltip');
      tooltipEl.style.opacity = 1;
      tooltipEl.style.pointerEvents = 'none';
      tooltipEl.style.position = 'absolute';
      tooltipEl.style.transform = 'translate(-50%, 0)';
      tooltipEl.style.transition = 'all .1s ease';
      tooltipEl.style.zIndex = 10;
      
      const table = document.createElement('table');
      table.style.margin = '0px';
      
      tooltipEl.appendChild(table);
      chart.canvas.parentNode.appendChild(tooltipEl);
    }

    return tooltipEl;
  };

  const externalTooltipHandler = (context: any) => {
    // Tooltip Element
    const {chart, tooltip} = context;
    const tooltipEl = getOrCreateTooltip(chart);

    // Hide if no tooltip
    if (tooltip.opacity === 0) {
      tooltipEl.style.opacity = 0;
      return;
    }

    // Set Text
    if (tooltip.body) {
      const bodyLines = tooltip.body.map((b: any) => b.lines);
      
      const tableBody = document.createElement('tbody');
      
      bodyLines.forEach((body: any, ) => {
        const value = parseFloat(body[0].split(': ')[1]);
        
        const tr = document.createElement('tr');
        tr.style.borderWidth = '0';
        
        const td = document.createElement('td');
        td.style.borderWidth = '0';
        td.classList.add('bg-blue-800', 'text-white', 'px-3', 'py-1', 'rounded');
        
        const text = document.createTextNode(`$${value.toLocaleString()}`);
        
        td.appendChild(text);
        tr.appendChild(td);
        tableBody.appendChild(tr);
      });
      
      const tableRoot = tooltipEl.querySelector('table');
      
      // Remove old children
      while (tableRoot.firstChild) {
        tableRoot.firstChild.remove();
      }
      
      // Add new children
      tableRoot.appendChild(tableBody);
    }

    const {offsetLeft: positionX, offsetTop: positionY} = chart.canvas;

    // Display, position, and set styles for font
    tooltipEl.style.opacity = 1;
    tooltipEl.style.left = positionX + tooltip.caretX + 'px';
    tooltipEl.style.top = positionY + tooltip.caretY - 40 + 'px';
  };

  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
        external: externalTooltipHandler,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 6000,
        ticks: {
          font: {
            size: 10,
          },
          color: '#6B7280',
          callback: (value: any) => {
            if (value === 0) return '0';
            if (value === 2000) return '$2k';
            if (value === 4000) return '$4k';
            if (value === 6000) return '$6k';
            return '';
          },
        },
        grid: {
          color: 'rgba(229, 231, 235, 0.5)', // light gray lines
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 10,
          },
          color: '#6B7280',
        },
      },
    },
    elements: {
      line: {
        tension: 0.4,
      },
      point: {
        radius: 0,
        hoverRadius: 4,
        hoverBorderWidth: 2,
      },
    },
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
  };

  // Chart data
  const data = {
    labels: getLabels(),
    datasets: [
      {
        label: 'Balance',
        data: getData(),
        fill: true,
        backgroundColor: (context: any) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) {
            return null;
          }
          
          // Create gradient from top of line to bottom of chart
          const gradient = ctx.createLinearGradient(
            0, chartArea.top, 0, chartArea.bottom
          );
          gradient.addColorStop(0, 'rgba(30, 72, 65, 0.16)'); // #1E484129
          gradient.addColorStop(1, 'rgba(209, 213, 219, 0.05)'); // gray-300 with low opacity
          
          return gradient;
        },
        borderColor: '#BFDBFE', // blue-200
        borderWidth: 2,
        pointBackgroundColor: '#BFDBFE',
        pointBorderColor: '#BFDBFE',
      },
    ],
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">{title}</h3>
        
        <div className="relative">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-md"
          >
            {activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)}
            <ChevronDownIcon className="h-4 w-4 ml-1" />
          </button>
          
          {isFilterOpen && (
            <div className="absolute right-0 mt-1 bg-white dark:bg-gray-800 shadow-md rounded-md py-1 z-10 min-w-[100px]">
              <button 
                onClick={() => { setActiveFilter('week'); setIsFilterOpen(false); }}
                className={`block w-full text-left px-4 py-1.5 text-sm ${activeFilter === 'week' ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              >
                Week
              </button>
              <button 
                onClick={() => { setActiveFilter('month'); setIsFilterOpen(false); }}
                className={`block w-full text-left px-4 py-1.5 text-sm ${activeFilter === 'month' ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              >
                Month
              </button>
              <button 
                onClick={() => { setActiveFilter('year'); setIsFilterOpen(false); }}
                className={`block w-full text-left px-4 py-1.5 text-sm ${activeFilter === 'year' ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              >
                Year
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="h-64">
        <Line options={options} data={data} />
      </div>
      
      <div className="mt-4 flex justify-between">
        <div className="text-sm">
          <span className="text-gray-500 dark:text-gray-400">Min</span>
          <p className="font-medium">${Math.min(...getData()).toLocaleString()}</p>
        </div>
        <div className="text-sm">
          <span className="text-gray-500 dark:text-gray-400">Max</span>
          <p className="font-medium">${Math.max(...getData()).toLocaleString()}</p>
        </div>
        <div className="text-sm">
          <span className="text-gray-500 dark:text-gray-400">Average</span>
          <p className="font-medium">${(getData().reduce((a, b) => a + b, 0) / getData().length).toFixed(2)}</p>
        </div>
      </div>
      
      {/* CSS for tooltip */}
      <style>{`
        .balance-tooltip {
          background: transparent;
          border-radius: 0.25rem;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
          font-size: 0.875rem;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
};

export default BalanceChart;