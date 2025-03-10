import React, { useState } from 'react';

interface CurrencyRate {
  currency: string;
  code: string;
  value: number;
  change: number;
  icon: string;
}

const CurrencyRates: React.FC = () => {
  // Sample currency data with rates against USD
  const [rates] = useState<CurrencyRate[]>([
    { 
      currency: "Euro", 
      code: "EUR", 
      value: 0.91, 
      change: -0.02, 
      icon: "€" 
    },
    { 
      currency: "British Pound", 
      code: "GBP", 
      value: 0.78, 
      change: 0.01, 
      icon: "£" 
    },
    { 
      currency: "Japanese Yen", 
      code: "JPY", 
      value: 143.62, 
      change: -1.54, 
      icon: "¥" 
    },
    { 
      currency: "Canadian Dollar", 
      code: "CAD", 
      value: 1.34, 
      change: 0.03, 
      icon: "C$" 
    },
  ]);

  return (
    <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-800">Currency Rates</h2>
        <div className="bg-blue-50 text-blue-600 px-2 py-1 rounded-md text-xs font-medium">
          vs USD
        </div>
      </div>

      <div className="space-y-3">
        {rates.map((rate) => (
          <div 
            key={rate.code} 
            className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors duration-150"
          >
            <div className="flex items-center">
              <div className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-100 mr-3">
                <span className="text-lg font-medium">{rate.icon}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">{rate.currency}</p>
                <p className="text-xs text-gray-500">{rate.code}</p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-sm font-semibold">{rate.value}</div>
              <div className={`flex items-center text-xs ${rate.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {rate.change >= 0 ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
                {Math.abs(rate.change).toFixed(2)}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-3 border-t border-gray-100">
        <button 
          className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 flex items-center justify-center"
        >
          <span>See all currencies</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      
      <div className="pt-2 text-xs text-gray-400 text-center">
        <p>Last updated: {new Date().toLocaleString()}</p>
      </div>
    </div>
  );
};

export default CurrencyRates;