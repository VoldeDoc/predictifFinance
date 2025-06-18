import  { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '@/components/Layout/layout';
import AccountCard from '@/components/PrediciveAccount/compon/AccountCard';
import UseFinanceHook from '@/hooks/UseFinance';
import { toast } from 'react-toastify';
import { 
  ArrowLeftIcon, 
  BanknotesIcon, 
  PlusIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  CreditCardIcon,
  WalletIcon
} from '@heroicons/react/24/outline';

interface WalletData {
  balance: number;
  type: string;
  status: string;
}

export default function AllAccountsPage() {
  const { getAllWallets } = UseFinanceHook();
  const navigate = useNavigate();
  const [wallets, setWallets] = useState<WalletData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'closed'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'main' | 'saving' | 'investment' | 'loan'>('all');
  const [sortBy, setSortBy] = useState<'balance' | 'type' | 'status'>('balance');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchWallets();
  }, []);

  const fetchWallets = async () => {
    try {
      setLoading(true);
      const response = await getAllWallets();
      
      let walletsData: WalletData[] = [];
      
      if (Array.isArray(response)) {
        walletsData = response;
      } else if (response?.data && Array.isArray(response.data)) {
        walletsData = response.data;
      }
      
      setWallets(walletsData);
    } catch (error: any) {
      console.error('Error fetching wallets:', error);
      toast.error(error.message || 'Failed to fetch wallet data');
    } finally {
      setLoading(false);
    }
  };

  const getWalletDisplayData = (wallet: WalletData, index: number) => {
    const walletTypes = {
      main: {
        title: 'Main Account',
        currency: 'USD',
        cardColor: { from: '#82A6CB', to: '#82A6CF' },
        icon: <CreditCardIcon className="w-6 h-6" />
      },
      saving: {
        title: 'Savings Account',
        currency: 'USD',
        cardColor: { from: '#FFE26F', to: '#FFE26F' },
        icon: <BanknotesIcon className="w-6 h-6" />
      },
      investment: {
        title: 'Investment Account',
        currency: 'USD',
        cardColor: { from: '#FFC97C', to: '#FFC97C' },
        icon: <WalletIcon className="w-6 h-6" />
      },
      loan: {
        title: 'Loan Account',
        currency: 'USD',
        cardColor: { from: '#90CAF9', to: '#90CAF9' },
        icon: <CreditCardIcon className="w-6 h-6" />
      }
    };

    const typeConfig = walletTypes[wallet.type as keyof typeof walletTypes] || {
      title: `${wallet.type.charAt(0).toUpperCase() + wallet.type.slice(1)} Account`,
      currency: 'USD',
      cardColor: { from: '#B0BEC5', to: '#B0BEC5' },
      icon: <WalletIcon className="w-6 h-6" />
    };

    return {
      title: typeConfig.title,
      amount: `$${wallet.balance.toFixed(2)}`,
      currency: typeConfig.currency,
      cardNumber: `•••• •••• •••• ${String(1000 + index).slice(-4)}`,
      status: wallet.status as 'active' | 'closed',
      cardColor: typeConfig.cardColor,
      icon: typeConfig.icon
    };
  };

  // Filter and search wallets
  const filteredWallets = wallets.filter(wallet => {
    const matchesStatusFilter = filter === 'all' || wallet.status === filter;
    const matchesTypeFilter = typeFilter === 'all' || wallet.type === typeFilter;
    const matchesSearch = searchQuery === '' || 
      wallet.type.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatusFilter && matchesTypeFilter && matchesSearch;
  });

  // Sort wallets
  const sortedWallets = [...filteredWallets].sort((a, b) => {
    switch (sortBy) {
      case 'balance':
        return b.balance - a.balance;
      case 'type':
        return a.type.localeCompare(b.type);
      case 'status':
        return a.status.localeCompare(b.status);
      default:
        return 0;
    }
  });

  const totalBalance = wallets.reduce((sum, wallet) => sum + wallet.balance, 0);
  const activeAccounts = wallets.filter(w => w.status === 'active').length;
  const accountTypes = [...new Set(wallets.map(w => w.type))].length;

  return (
    <AuthLayout>
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/predictive-account')}
            className="flex items-center text-blue-600 hover:text-blue-700 mb-4 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to Dashboard
          </button>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">All Accounts</h1>
              <p className="text-gray-600 mt-1">Manage and monitor all your financial accounts</p>
            </div>
            <button 
              onClick={() => navigate('/predictive-account?tab=send')}
              className="mt-4 sm:mt-0 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PlusIcon className="w-4 h-4" />
              Add New Account
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <BanknotesIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Total Balance</h3>
                <p className="text-2xl font-bold text-gray-900">${totalBalance.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <CreditCardIcon className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Active Accounts</h3>
                <p className="text-2xl font-bold text-gray-900">{activeAccounts}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <WalletIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Account Types</h3>
                <p className="text-2xl font-bold text-gray-900">{accountTypes}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg p-6 shadow-sm border mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            <div className="flex items-center gap-2">
              <FunnelIcon className="w-5 h-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filters:</span>
            </div>
            
            <div className="flex flex-wrap gap-4 flex-1">
              {/* Search */}
              <div className="relative">
                <MagnifyingGlassIcon className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search accounts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
                />
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              
              {/* Type Filter */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Type</label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Types</option>
                  <option value="main">Main</option>
                  <option value="saving">Savings</option>
                  <option value="investment">Investment</option>
                  <option value="loan">Loan</option>
                </select>
              </div>
              
              {/* Sort */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Sort by</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="balance">Balance</option>
                  <option value="type">Type</option>
                  <option value="status">Status</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {sortedWallets.length} of {wallets.length} accounts
            {searchQuery && ` for "${searchQuery}"`}
          </p>
        </div>

        {/* Accounts Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading accounts...</span>
          </div>
        ) : sortedWallets.length === 0 ? (
          <div className="text-center py-12">
            <BanknotesIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Accounts Found</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery || filter !== 'all' || typeFilter !== 'all' ? 
                "No accounts match your current filters." : 
                "You don't have any accounts yet."
              }
            </p>
            {(!searchQuery && filter === 'all' && typeFilter === 'all') && (
              <button 
                onClick={() => navigate('/predictive-account?tab=send')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Your First Account
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedWallets.map((wallet, index) => {
              const displayData = getWalletDisplayData(wallet, index);
              
              return (
                <div key={`${wallet.type}-${index}`} className="relative group">
                  <AccountCard
                    title={displayData.title}
                    amount={displayData.amount}
                    currency={displayData.currency}
                    cardNumber={displayData.cardNumber}
                    status={displayData.status}
                    cardColor={displayData.cardColor}
                  />
                  
                  {/* Account Info Overlay */}
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {displayData.icon}
                        <span className="text-sm font-medium text-gray-700 capitalize">
                          {wallet.type} Account
                        </span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        wallet.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {wallet.status}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Balance: <span className="font-semibold text-gray-700">${wallet.balance.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  {/* Hover Actions */}
                  {/* <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <div className="flex gap-2">
                      <button className="bg-white text-gray-900 px-3 py-1 rounded text-xs font-medium hover:bg-gray-100">
                        View Details
                      </button>
                      <button className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-blue-700">
                        Manage
                      </button>
                    </div>
                  </div> */}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AuthLayout>
  );
}