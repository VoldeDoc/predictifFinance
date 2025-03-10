import React from 'react';

interface AccountCardProps {
  title?: string;
  amount: string;
  currency?: string;
  cardNumber: string;
  status?: 'active' | 'closed';
  cardColor?: {
    from: string;
    to: string;
  };
  icon?: React.ReactNode;
  isCompact?: boolean;
}

export default function AccountCard({
  title = "Balance",
  amount,
  currency = "USD",
  cardNumber,
  status = 'active',
  cardColor = { from: '#82A6CB', to: '#82A6CF' },
  isCompact = false
}: AccountCardProps) {
  // Truncate long card numbers to prevent overflow
  const displayedCardNumber = cardNumber.length > 16 ? cardNumber.substring(0, 16) + "..." : cardNumber;
  
  // Truncate long titles
  const displayedTitle = title.length > 15 ? title.substring(0, 15) + "..." : title;
  
  return (
    <div className="bg-white p-2 sm:p-3 rounded-lg shadow-sm border border-gray-100 h-full flex flex-col overflow-hidden">
      <div className="flex justify-between w-full">
        <div className="overflow-hidden">
          <h1 className={`text-gray-600 font-medium truncate ${isCompact ? 'text-xs' : 'text-sm sm:text-base'}`}>
            {displayedTitle}
          </h1>
        </div>
        <div>
          <h5 className="text-xs text-gray-500">{currency}</h5>
        </div>
      </div>
      <div className="flex justify-between mt-1 sm:mt-2 w-full">
        <div className="space-y-1 sm:space-y-2">
          <h1 className={`font-bold ${isCompact ? 'text-base' : 'text-lg sm:text-xl'}`}>{amount}</h1>
          <div className="flex items-center">
            <div className="rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 bg-blue-500"></div>
            <span className="text-xs text-gray-500 ml-1 sm:ml-2">{status === 'active' ? 'Active' : 'Closed'}</span>
          </div>
        </div>
        <div className="flex-shrink-0">
          <div 
            className={`relative rounded-lg shadow-md ${isCompact ? 'h-12 w-20' : 'h-14 w-22 sm:h-16 sm:w-24'}`}
            style={{ 
              background: `linear-gradient(to right, ${cardColor.from}, ${cardColor.to})`,
              borderTopLeftRadius: '0.75rem' 
            }}
          >
            <div className="absolute left-1 top-1 flex">
              <div className={`${isCompact ? 'h-3 w-3' : 'h-4 w-4 sm:h-5 sm:w-5'} bg-[#DADADA] rounded-full`}></div>
              <div className={`${isCompact ? 'h-3 w-3' : 'h-4 w-4 sm:h-5 sm:w-5'} bg-[#DADADA] rounded-full -ml-1`}></div>
            </div>
            <div className="absolute bottom-1 left-1 right-1 text-[#DADADA] text-center" style={{ 
              fontSize: isCompact ? '8px' : '10px' 
            }}>
              {displayedCardNumber}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sample data for four different cards
export const cardData = [
  {
    title: "Current Account",
    amount: "$5,834.22",
    currency: "USD",
    cardNumber: "•••• •••• •••• 7421",
    status: 'active' as const,
    cardColor: { from: '#82A6CB', to: '#82A6CF' }
  },
  {
    title: "Crypto Account",
    amount: "€8,834.22",
    currency: "EUR",
    cardNumber: "•••• •••• •••• 3456",
    status: 'active' as const,
    cardColor: { from: '#FFE26F', to: '#FFE26F' }
  },
  {
    title: "Investment Account",
    amount: "¥4,834.22",
    currency: "JPY",
    cardNumber: "•••• •••• •••• 9032",
    status: 'active' as const,
    cardColor: { from: '#FFC97C', to: '#FFC97C' }
  },
  {
    title: "Loan Account",
    amount: "$8,712.34",
    currency: "USD",
    cardNumber: "•••• •••• •••• 1290",
    status: 'active' as const,
    cardColor: { from: '#90CAF9', to: '#90CAF9' }
  }
];