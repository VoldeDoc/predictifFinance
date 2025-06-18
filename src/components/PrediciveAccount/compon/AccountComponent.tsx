import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AccountCard from './AccountCard';
import CurrencyConverter from './CurrencyConverter';
import CurrencyRates from './CurrencyRate';
import UseFinanceHook from '@/hooks/UseFinance';
import { toast } from 'react-toastify';
import { ArrowRightIcon, BanknotesIcon} from '@heroicons/react/24/outline';

interface WalletData {
  balance: number;
  type: string;
  status: string;
}

interface WalletResponse {
  data: WalletData[];
}

export const AccountsComponent: React.FC = () => {
  const { getAllWallets } = UseFinanceHook();
  const navigate = useNavigate();
  const [wallets, setWallets] = useState<WalletData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWallets();
  }, []);

  const fetchWallets = async () => {
    try {
      setLoading(true);
      const response: WalletResponse = await getAllWallets();
      console.log(response);
      
      setWallets(response.data || []);
    } catch (error: any) {
      console.error('Error fetching wallets:', error);
      toast.error(error.message || 'Failed to fetch wallet data');
    } finally {
      setLoading(false);
    }
  };

  // Function to get wallet display data
  const getWalletDisplayData = (wallet: WalletData, index: number) => {
    const walletTypes = {
      main: {
        title: 'Main Account',
        currency: 'USD',
        cardColor: { from: '#82A6CB', to: '#82A6CF' }
      },
      saving: {
        title: 'Savings Account',
        currency: 'USD',
        cardColor: { from: '#FFE26F', to: '#FFE26F' }
      },
      investment: {
        title: 'Investment Account',
        currency: 'USD',
        cardColor: { from: '#FFC97C', to: '#FFC97C' }
      },
      loan: {
        title: 'Loan Account',
        currency: 'USD',
        cardColor: { from: '#90CAF9', to: '#90CAF9' }
      }
    };

    const typeConfig = walletTypes[wallet.type as keyof typeof walletTypes] || {
      title: `${wallet.type.charAt(0).toUpperCase() + wallet.type.slice(1)} Account`,
      currency: 'USD',
      cardColor: { from: '#B0BEC5', to: '#B0BEC5' }
    };

    return {
      title: typeConfig.title,
      amount: `$${wallet.balance.toFixed(2)}`,
      currency: typeConfig.currency,
      cardNumber: `•••• •••• •••• ${String(1000 + index).slice(-4)}`,
      status: wallet.status as 'active' | 'closed',
      cardColor: typeConfig.cardColor
    };
  };

  const navigateToAllWallets = () => {
    navigate('/accounts/all');
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-800">Accounts</h1>
        <div className="mt-6 flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading wallets...</span>
        </div>
      </div>
    );
  }

  const displayedWallets = wallets.slice(0, 4);
  const hasMoreWallets = wallets.length > 4;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Accounts</h1>
          <p className="text-lg md:text-xl font-normal text-gray-800">Track your finances and achieve your financial goals</p>
        </div>
        <div className="flex flex-wrap gap-2">
        <button
          onClick={navigateToAllWallets}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm sm:text-base"
        >
          <BanknotesIcon className="w-4 h-4" />
          View All ({wallets.length})
        </button>
          
        
        </div>
      </div>
      
      <div className="mt-6 flex flex-wrap">
        {/* Left half - Account cards in 2x2 grid */}
        <div className="w-full lg:w-3/5 pr-0 lg:pr-4">
          {wallets.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-64">
              <div className="col-span-full flex flex-col items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <BanknotesIcon className="w-12 h-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Wallets Found</h3>
                <p className="text-gray-500 text-center">
                  You don't have any wallets yet. Contact support to set up your accounts.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {displayedWallets.map((wallet, index) => {
                  const displayData = getWalletDisplayData(wallet, index);
                  return (
                    <div key={`${wallet.type}-${index}`}>
                      <AccountCard
                        title={displayData.title}
                        amount={displayData.amount}
                        currency={displayData.currency}
                        cardNumber={displayData.cardNumber}
                        status={displayData.status}
                        cardColor={displayData.cardColor}
                      />
                    </div>
                  );
                })}
              </div>
              
              {/* Show "View All" button if more than 4 wallets */}
              {hasMoreWallets && (
                <div className="mt-4 text-center">
                  <button
                    onClick={navigateToAllWallets}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                  >
                    <span>View All {wallets.length} Wallets</span>
                    <ArrowRightIcon className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
          
          <div className="py-4">
            <CurrencyConverter />
          </div>
        </div>
        
        <div className="w-full lg:w-2/5 mt-4 lg:mt-0 pl-0 lg:pl-4">
          <CurrencyRates />
        </div>
      </div>
    </div>
  );
};