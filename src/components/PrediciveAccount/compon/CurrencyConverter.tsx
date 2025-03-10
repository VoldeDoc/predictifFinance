import React, { useState, useEffect } from 'react';

interface ExchangeRates {
  [key: string]: number;
}

// Currency symbols/icons mapping
const currencyIcons: {[key: string]: string} = {
  "USD": "$",
  "EUR": "€",
  "GBP": "£",
  "JPY": "¥",
  "CAD": "C$",
  "AUD": "A$",
  "CNY": "¥"
};

const CurrencyConverter: React.FC = () => {
  const [amount, setAmount] = useState<number>(1);
  const [fromCurrency, setFromCurrency] = useState<string>("USD");
  const [toCurrency, setToCurrency] = useState<string>("EUR");
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const exchangeRates: ExchangeRates = {
    "USD": 1,
    "EUR": 0.91,
    "GBP": 0.78,
    "JPY": 143.62,
    "CAD": 1.34,
    "AUD": 1.48,
    "CNY": 7.23,
  };
  
  const currencies = Object.keys(exchangeRates);
  
  useEffect(() => {
    convertCurrency();
  }, [fromCurrency, toCurrency, amount]);
  
  const convertCurrency = () => {
    if (!amount || isNaN(amount)) {
      setConvertedAmount(null);
      return;
    }
    
    try {
      const fromRate = exchangeRates[fromCurrency];
      const toRate = exchangeRates[toCurrency];
      
      if (!fromRate || !toRate) {
        throw new Error("Invalid currency selection");
      }
      
      // Convert to USD first, then to target currency
      const valueInUSD = amount / fromRate;
      const result = valueInUSD * toRate;
      
      setConvertedAmount(parseFloat(result.toFixed(2)));
      setError(null);
    } catch (err) {
      setError("Error converting currency");
      setConvertedAmount(null);
    }
  };
  
  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };
  
  return (
    <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-800">Currency Converter</h2>
        <div className="bg-blue-50 text-blue-600 px-2 py-1 rounded-md text-xs font-medium">
          Real-time rates
        </div>
      </div>
      
      {error && (
        <div className="text-red-500 text-sm mb-3 bg-red-50 p-2 rounded-md flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {error}
        </div>
      )}
      
      <div className="flex flex-col space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Amount</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500">{currencyIcons[fromCurrency]}</span>
            </div>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Enter amount"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-11 gap-2">
          <div className="md:col-span-5">
            <label className="block text-sm font-medium text-gray-600 mb-1">From</label>
            <div className="relative">
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none"
              >
                {currencies.map(currency => (
                  <option key={`from-${currency}`} value={currency}>
                    {currencyIcons[currency]} {currency}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center items-center md:col-span-1">
            <button 
              onClick={swapCurrencies}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </button>
          </div>
          
          <div className="md:col-span-5">
            <label className="block text-sm font-medium text-gray-600 mb-1">To</label>
            <div className="relative">
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none"
              >
                {currencies.map(currency => (
                  <option key={`to-${currency}`} value={currency}>
                    {currencyIcons[currency]} {currency}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        <button 
          onClick={convertCurrency}
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
        >
          <div className="flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            Convert
          </div>
        </button>
        
        <div className="mt-2 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Converted Amount</p>
              <div className="flex items-center">
                <span className="text-2xl font-semibold text-gray-800">
                  {currencyIcons[toCurrency]} {convertedAmount !== null ? convertedAmount.toLocaleString() : '-'}
                </span>
                <span className="ml-2 text-sm text-gray-500">{toCurrency}</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-400">Exchange Rate</p>
              <p className="text-sm font-medium">
                1 {fromCurrency} = {(exchangeRates[toCurrency] / exchangeRates[fromCurrency]).toFixed(4)} {toCurrency}
              </p>
            </div>
          </div>
        </div>
        
        <div className="pt-2 text-xs text-gray-400 text-center">
          <p>Last updated: {new Date().toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverter;