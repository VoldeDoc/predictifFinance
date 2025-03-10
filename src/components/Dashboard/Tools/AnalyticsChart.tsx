import React, { useState, useEffect, useRef } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface DataPoint {
  month: string;
  year?: number;
  value: number;
}

interface AnalyticsSparklineProps {
  title?: string;
  data?: DataPoint[];
  height?: number;
  lineColor?: string;
  fillColor?: string;
  maxY?: number;
}

export default function AnalyticsSparkline({
  title = "Analytics",
  data,
  height = 160,
  lineColor = "#3B82F6", // blue-500
  fillColor = "#93C5FD", // blue-300
  maxY = 50000
}: AnalyticsSparklineProps) {
  const [activePoint, setActivePoint] = useState<DataPoint | null>(null);
  const [filterPeriod, setFilterPeriod] = useState<'1y' | '6m' | '3m' | '1m'>('1y');
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  
  // Default data for the past year if none provided
  const defaultData: DataPoint[] = [
    { month: 'Jan', year: 2024, value: 12500 },
    { month: 'Feb', year: 2024, value: 18200 },
    { month: 'Mar', year: 2024, value: 15800 },
    { month: 'Apr', year: 2024, value: 22400 },
    { month: 'May', year: 2024, value: 36128 },
    { month: 'Jun', year: 2024, value: 46057 }, // Using your specific values
    { month: 'Jul', year: 2023, value: 32100 },
    { month: 'Aug', year: 2023, value: 27500 },
    { month: 'Sep', year: 2023, value: 35600 },
    { month: 'Oct', year: 2023, value: 41200 },
    { month: 'Nov', year: 2023, value: 38900 },
    { month: 'Dec', year: 2023, value: 47500 }
  ];

  // Filter data based on period selection
  const [filteredData, setFilteredData] = useState<DataPoint[]>(data || defaultData);

  useEffect(() => {
    const allData = data || defaultData;
    
    // Apply filter based on selected period
    let filtered: DataPoint[];
    switch (filterPeriod) {
      case '6m':
        filtered = allData.slice(-6);
        break;
      case '3m':
        filtered = allData.slice(-3);
        break;
      case '1m':
        filtered = allData.slice(-1);
        break;
      default:
        filtered = allData;
    }
    
    setFilteredData(filtered);
    setActivePoint(null); // Reset active point when filter changes
  }, [filterPeriod, data]);

  const chartWidth = filteredData.length > 1 ? 100 / (filteredData.length - 1) : 100;
  const getY = (value: number) => (1 - value / maxY) * height;
  
  // Generate SVG path for the sparkline
  const generateSparklinePath = () => {
    if (filteredData.length === 0) return '';
    
    return filteredData.reduce((path, point, index) => {
      const x = index * chartWidth;
      const y = getY(point.value);
      return path + (index === 0 ? `M ${x},${y}` : ` L ${x},${y}`);
    }, '');
  };

  // Generate fill area below the sparkline
  const generateFillPath = () => {
    if (filteredData.length === 0) return '';
    
    let path = filteredData.reduce((pathStr, point, index) => {
      const x = index * chartWidth;
      const y = getY(point.value);
      return pathStr + (index === 0 ? `M ${x},${y}` : ` L ${x},${y}`);
    }, '');
    
    // Close the path to create a filled area
    const lastX = (filteredData.length - 1) * chartWidth;
    path += ` L ${lastX},${height} L 0,${height} Z`;
    return path;
  };

  // Handle mouse interactions
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    
    const svgRect = svgRef.current.getBoundingClientRect();
    const mouseX = e.clientX - svgRect.left;
    const relativeX = mouseX / svgRect.width;
    
    // Find the closest data point
    const index = Math.min(
      Math.round(relativeX * (filteredData.length - 1)),
      filteredData.length - 1
    );
    
    if (index >= 0 && index < filteredData.length) {
      setActivePoint(filteredData[index]);
    }
  };

  const handleMouseLeave = () => {
    setActivePoint(null);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        
        <div className="relative">
          <select
            value={filterPeriod}
            onChange={(e) => setFilterPeriod(e.target.value as '1y' | '6m' | '3m' | '1m')}
            className="appearance-none bg-gray-50 px-3 py-1 pr-8 rounded-md text-sm border border-gray-300"
          >
            <option value="1y">Last 12 months</option>
            <option value="6m">Last 6 months</option>
            <option value="3m">Last 3 months</option>
            <option value="1m">Last month</option>
          </select>
          <ChevronDownIcon className="absolute right-2 top-2 h-4 w-4 text-gray-500" />
        </div>
      </div>
      
      {/* Sparkline Chart */}
      <div className="relative">
        {/* Y-axis label */}
        <div className="absolute -left-2 top-0 h-full flex flex-col justify-between text-xs text-gray-400">
          <span>50K</span>
          <span>25K</span>
          <span>0</span>
        </div>
        
        <div className="pl-6 relative">
          {/* Enhanced Tooltip */}
          {activePoint && (
            <div 
              ref={tooltipRef}
              className="absolute z-10 bg-white shadow-lg rounded-md border border-gray-200 p-3 transform -translate-x-1/2 -translate-y-full pointer-events-none"
              style={{
                left: `${(filteredData.indexOf(activePoint) * chartWidth)}%`,
                top: `-10px`,
                transition: 'transform 0.1s ease, opacity 0.1s ease',
                opacity: 1
              }}
            >
              <div className="text-center mb-1">
                <span className="font-medium">{activePoint.month} {activePoint.year || ''}</span>
              </div>
              <div className="text-center text-xl font-bold text-blue-600">
                {activePoint.value.toLocaleString('en-US', { 
                  style: 'currency', 
                  currency: 'USD',
                  maximumFractionDigits: 0 
                })}
              </div>
              {/* Tooltip arrow */}
              <div className="absolute bottom-0 left-1/2 w-3 h-3 bg-white border-r border-b border-gray-200 transform rotate-45 translate-y-1.5 -translate-x-1.5"></div>
            </div>
          )}
          
          {/* Chart SVG */}
          <svg 
            ref={svgRef}
            width="100%" 
            height={height} 
            viewBox={`0 0 100 ${height}`}
            preserveAspectRatio="none"
            className="overflow-visible"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            {/* Grid lines */}
            <line x1="0" y1={height/2} x2="100" y2={height/2} stroke="#E5E7EB" strokeWidth="1" strokeDasharray="2" />
            <line x1="0" y1={height} x2="100" y2={height} stroke="#E5E7EB" strokeWidth="1" />
            
            {/* Fill area */}
            <path 
              d={generateFillPath()} 
              fill={fillColor} 
              fillOpacity="0.2"
              className="transition-opacity duration-500 ease-in-out"
            />
            
            {/* Line */}
            <path 
              d={generateSparklinePath()} 
              fill="none" 
              stroke={lineColor} 
              strokeWidth="2.5"
              className="transition-all duration-500 ease-in-out"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            
            {/* Data points - Simplified hover effect with smaller white circle */}
            {filteredData.map((point, index) => {
              const x = index * chartWidth;
              const y = getY(point.value);
              const isActive = activePoint === point;
              
              return (
                <g key={index} className="transition-all duration-300">
                  <circle 
                    cx={x} 
                    cy={y} 
                    r={isActive ? 3 : 4} 
                    fill="white" 
                    stroke={lineColor} 
                    strokeWidth={isActive ? 1.5 : 0.004} 
                    className={`transition-all duration-300 ${
                      isActive ? 'opacity-100' : 'opacity-0 hover:opacity-100'
                    }`}
                  />
                </g>
              );
            })}
            
            {/* Removed the dotted vertical line */}
          </svg>
          
          {/* X-axis labels */}
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            {filteredData.map((point, index) => (
              <div key={index} className={`transition-colors duration-200 ${
                activePoint === point ? 'font-medium text-gray-800' : ''
              }`}>
                {point.month}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}