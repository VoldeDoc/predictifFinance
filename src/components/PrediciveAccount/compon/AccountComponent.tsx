import React from 'react';
import AccountCard, { cardData } from './AccountCard';
import SubscrptionCards from './subscriptions';
import CurrencyConverter from './CurrencyConverter';
import CurrencyRates from './CurrencyRate';

export const AccountsComponent: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-800">Accounts</h1>
      <h1 className="text-xl font-normal text-gray-800">Track your finances and achieve your financial goals</h1>
      
      <div className="mt-6 flex flex-wrap">
        {/* Left half - Account cards in 2x2 grid */}
        <div className="w-full lg:w-3/5 pr-0 lg:pr-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
            <div>
              <AccountCard
                title={cardData[0].title}
                amount={cardData[0].amount}
                currency={cardData[0].currency}
                cardNumber={cardData[0].cardNumber}
                status={cardData[0].status}
                cardColor={cardData[0].cardColor}
              />
            </div>
            <div>
              <AccountCard
                title={cardData[1].title}
                amount={cardData[1].amount}
                currency={cardData[1].currency}
                cardNumber={cardData[1].cardNumber}
                status={cardData[1].status}
                cardColor={cardData[1].cardColor}
              />
            </div>
            <div>
              <AccountCard
                title={cardData[2].title}
                amount={cardData[2].amount}
                currency={cardData[2].currency}
                cardNumber={cardData[2].cardNumber}
                status={cardData[2].status}
                cardColor={cardData[2].cardColor}
              />
            </div>
            <div>
              <AccountCard
                title={cardData[3].title}
                amount={cardData[3].amount}
                currency={cardData[3].currency}
                cardNumber={cardData[3].cardNumber}
                status={cardData[3].status}
                cardColor={cardData[3].cardColor}
              />
            </div>
          </div>
          <div className='py-4'>
            <SubscrptionCards/>
          </div>
          <div className="py-4">
            <CurrencyConverter />
          </div>
        </div>
        
        <div className="w-full lg:w-2/5 mt-4 lg:mt-0 pl-0 lg:pl-4">
         <CurrencyRates/>
        </div>
      </div>
      
    
    </div>
  );
};