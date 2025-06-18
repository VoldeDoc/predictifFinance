import { useState, useEffect } from 'react';
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
  FlagIcon,
  CalendarIcon,
  XMarkIcon,
  CurrencyDollarIcon,
  EyeIcon,
  ClipboardDocumentIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

interface SavingsData {
  balance: number;
  type: string;
  created_at: string;
  updated_at: string;
  label: string;
  description: string;
  target_amount: number;
  reference: string;
  status: string;
}

interface SavingDepositValues {
  reference: string;
  amount: number;
  detail: string;
}

interface WalletData {
  balance: number;
  type: string;
  status: string;
}

interface TransactionData {
  id: string;
  ref: string;
  amount: number;
  detail: string;
  type: string;
  status: string;
  user_name: string;
  user_email: string;
  created_at: string;
  updated_at: string;
}

interface SavingDetail {
  id: string | number;
  reference: string;
  label: string;
  description: string;
  balance: number;
  target_amount: number;
  status: string;
  created_at: string;
  updated_at: string;
  transactions?: TransactionData[];
}

export default function AllSavingsPage() {
  const { getSavingWallets, getAllWallets, createSavingsFundDeposit, getSavedFundByReferenceId } = UseFinanceHook();
  const navigate = useNavigate();
  const [savings, setSavings] = useState<SavingsData[]>([]);
  const [wallets, setWallets] = useState<WalletData[]>([]);
  const [loading, setLoading] = useState(true);
  const [depositLoading, setDepositLoading] = useState(false);
  const [viewLoading, setViewLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'paused'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'target' | 'progress'>('date');
  const [showDepositForm, setShowDepositForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedSaving, setSelectedSaving] = useState<SavingsData | null>(null);
  const [savingDetail, setSavingDetail] = useState<SavingDetail | null>(null);
  const [copiedReference, setCopiedReference] = useState<string | null>(null);

  // Form state
  const [depositForm, setDepositForm] = useState<SavingDepositValues>({
    reference: '',
    amount: 0,
    detail: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [savingsResponse, walletsResponse] = await Promise.all([
        getSavingWallets(),
        getAllWallets()
      ]);
      
      let savingsData: SavingsData[] = [];
      if (Array.isArray(savingsResponse)) {
        savingsData = savingsResponse;
      } else if (savingsResponse?.data && Array.isArray(savingsResponse.data)) {
        savingsData = savingsResponse.data;
      }

      let walletsData: WalletData[] = [];
      if (Array.isArray(walletsResponse)) {
        walletsData = walletsResponse;
      } else if (walletsResponse?.data && Array.isArray(walletsResponse.data)) {
        walletsData = walletsResponse.data;
      }
      
      setSavings(savingsData);
      setWallets(walletsData);
    } catch (error: any) {
      console.error('Error fetching savings:', error);
      toast.error(error.message || 'Failed to fetch savings data');
    } finally {
      setLoading(false);
    }
  };

  // Get main account balance
  const getMainAccountBalance = () => {
    const mainAccount = wallets.find(wallet => wallet.type === 'main' && wallet.status === 'active');
    return mainAccount ? mainAccount.balance : 0;
  };

  const getSavingCardColor = (index: number) => {
    const colors = [
      { from: '#10B981', to: '#059669' }, // Green
      { from: '#3B82F6', to: '#1D4ED8' }, // Blue
      { from: '#8B5CF6', to: '#7C3AED' }, // Purple
      { from: '#F59E0B', to: '#D97706' }, // Orange
      { from: '#EF4444', to: '#DC2626' }, // Red
      { from: '#06B6D4', to: '#0891B2' }, // Cyan
    ];
    return colors[index % colors.length];
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateProgress = (current: number, target: number) => {
    return target > 0 ? Math.min((current / target) * 100, 100) : 0;
  };

  const openDepositForm = (saving: SavingsData) => {
    const mainBalance = getMainAccountBalance();
    if (mainBalance <= 0) {
      toast.error('Insufficient funds in your main account');
      return;
    }

    setDepositForm({
      reference: saving.reference,
      amount: 0,
      detail: ''
    });
    setSelectedSaving(saving);
    setShowDepositForm(true);
  };

  const closeDepositForm = () => {
    setShowDepositForm(false);
    setDepositForm({
      reference: '',
      amount: 0,
      detail: ''
    });
    setSelectedSaving(null);
  };

  const openViewModal = async (saving: SavingsData) => {
    try {
      setViewLoading(true);
      setShowViewModal(true);
      setSelectedSaving(saving);
      
      // Convert string reference to number before calling the function
      let detail;
      try {
        // Try parsing as decimal first
        const numericRef = parseInt(saving.reference, 10);
        if (!isNaN(numericRef)) {
          detail = await getSavedFundByReferenceId(numericRef);
        } else {
          // Try parsing as hex if decimal fails
          const hexRef = parseInt(saving.reference, 16);
          if (!isNaN(hexRef)) {
            detail = await getSavedFundByReferenceId(hexRef);
          } else {
            throw new Error("Invalid reference format");
          }
        }
      } catch (error) {
        console.error('Error fetching with reference:', error);
        // Set a default empty response
        detail = { data: [] };
      }
      
      console.log('Saving detail:', detail);
      
      // Handle the API response structure
      if (detail && detail.data) {
        // If the response has a data array, use the first item or create a structured object
        if (Array.isArray(detail.data) && detail.data.length > 0) {
          const transaction = detail.data[0];
          setSavingDetail({
            id: transaction.id,
            reference: transaction.ref,
            label: saving.label, // Use from the original saving object
            description: transaction.detail || saving.description,
            balance: saving.balance,
            target_amount: saving.target_amount,
            status: transaction.status,
            created_at: transaction.created_at,
            updated_at: transaction.updated_at,
            transactions: detail.data
          });
        } else {
          // Use the detail object directly if it's not an array
          setSavingDetail({
            id: detail.data.id || saving.reference,
            reference: saving.reference,
            label: saving.label,
            description: saving.description,
            balance: saving.balance,
            target_amount: saving.target_amount,
            status: saving.status,
            created_at: saving.created_at,
            updated_at: saving.updated_at,
            transactions: []
          });
        }
      } else {
        // Fallback to using the original saving data
        setSavingDetail({
          id: saving.reference,
          reference: saving.reference,
          label: saving.label,
          description: saving.description,
          balance: saving.balance,
          target_amount: saving.target_amount,
          status: saving.status,
          created_at: saving.created_at,
          updated_at: saving.updated_at,
          transactions: []
        });
      }
    } catch (error: any) {
      console.error('Error fetching saving detail:', error);
      toast.error('Failed to load saving details');
      // Still show the modal with basic info
      setSavingDetail({
        id: saving.reference,
        reference: saving.reference,
        label: saving.label,
        description: saving.description,
        balance: saving.balance,
        target_amount: saving.target_amount,
        status: saving.status,
        created_at: saving.created_at,
        updated_at: saving.updated_at,
        transactions: []
      });
    } finally {
      setViewLoading(false);
    }
  };

  const closeViewModal = () => {
    setShowViewModal(false);
    setSelectedSaving(null);
    setSavingDetail(null);
  };

  const handleDepositSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const mainBalance = getMainAccountBalance();
    
    // Validation
    if (depositForm.amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    if (depositForm.amount > mainBalance) {
      toast.error(`Insufficient funds. Available balance: ${formatCurrency(mainBalance)}`);
      return;
    }
    
    if (!depositForm.detail.trim()) {
      toast.error('Please provide a description for this deposit');
      return;
    }
    
    try {
      setDepositLoading(true);
      const result = await createSavingsFundDeposit(depositForm);
      toast.success(result || 'Deposit successful!');
      closeDepositForm();
      // Refresh data after successful deposit
      await fetchData();
    } catch (error: any) {
      toast.error(error || 'Failed to process deposit');
    } finally {
      setDepositLoading(false);
    }
  };

  const handleInputChange = (field: keyof SavingDepositValues, value: string | number) => {
    setDepositForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const copyReferenceToClipboard = async (reference: string) => {
    try {
      await navigator.clipboard.writeText(reference);
      setCopiedReference(reference);
      toast.success('Reference ID copied to clipboard!');
      setTimeout(() => {
        setCopiedReference(null);
      }, 2000);
    } catch (error) {
      toast.error('Failed to copy reference ID');
    }
  };

  // Filter savings
  const filteredSavings = savings.filter(saving => {
    if (filter === 'all') return true;
    if (filter === 'completed') return calculateProgress(saving.balance, saving.target_amount) >= 100;
    return saving.status === filter;
  });

  // Sort savings
  const sortedSavings = [...filteredSavings].sort((a, b) => {
    switch (sortBy) {
      case 'amount':
        return b.balance - a.balance;
      case 'target':
        return b.target_amount - a.target_amount;
      case 'progress':
        return calculateProgress(b.balance, b.target_amount) - calculateProgress(a.balance, a.target_amount);
      case 'date':
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  const totalSaved = savings.reduce((sum, saving) => sum + saving.balance, 0);
  const totalTarget = savings.reduce((sum, saving) => sum + saving.target_amount, 0);
  const completedGoals = savings.filter(s => calculateProgress(s.balance, s.target_amount) >= 100).length;
  const mainBalance = getMainAccountBalance();

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
              <h1 className="text-3xl font-bold text-gray-900">All Savings Goals</h1>
              <p className="text-gray-600 mt-1">Manage and track all your savings goals</p>
              <p className="text-sm text-blue-600 mt-1">
                💰 Main Account Balance: <span className="font-semibold">{formatCurrency(mainBalance)}</span>
              </p>
            </div>
            <button 
              onClick={() => navigate('/predictive-account?tab=savings')}
              className="mt-4 sm:mt-0 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PlusIcon className="w-4 h-4" />
              Create New Goal
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <BanknotesIcon className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Total Saved</h3>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalSaved)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <FlagIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Total Target</h3>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalTarget)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <CalendarIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Active Goals</h3>
                <p className="text-2xl font-bold text-gray-900">{savings.filter(s => s.status === 'active').length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-full">
                <BanknotesIcon className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Completed</h3>
                <p className="text-2xl font-bold text-gray-900">{completedGoals}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Sorting */}
        <div className="bg-white rounded-lg p-6 shadow-sm border mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex items-center gap-2">
              <FunnelIcon className="w-5 h-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filters:</span>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Goals</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="paused">Paused</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Sort by</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="date">Date Created</option>
                  <option value="amount">Current Amount</option>
                  <option value="target">Target Amount</option>
                  <option value="progress">Progress</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Overall Progress */}
        <div className="bg-white rounded-lg p-6 shadow-sm border mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Overall Progress</h3>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Total Progress</span>
                <span>{totalTarget > 0 ? ((totalSaved / totalTarget) * 100).toFixed(1) : 0}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${totalTarget > 0 ? Math.min((totalSaved / totalTarget) * 100, 100) : 0}%` }}
                ></div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Remaining</p>
              <p className="text-lg font-semibold text-gray-900">{formatCurrency(Math.max(totalTarget - totalSaved, 0))}</p>
            </div>
          </div>
        </div>

        {/* Savings Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading savings...</span>
          </div>
        ) : sortedSavings.length === 0 ? (
          <div className="text-center py-12">
            <FlagIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Savings Goals Found</h3>
            <p className="text-gray-500 mb-4">
              {filter === 'all' ? 
                "You don't have any savings goals yet." : 
                `No ${filter} savings goals found.`
              }
            </p>
            <button 
              onClick={() => navigate('/predictive-account?tab=savings')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Your First Goal
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedSavings.map((saving, index) => {
              const cardColor = getSavingCardColor(index);
              const progress = calculateProgress(saving.balance, saving.target_amount);
              
              return (
                <div key={saving.reference} className="relative group">
                  <AccountCard
                    title={saving.label}
                    amount={formatCurrency(saving.balance)}
                    currency="USD"
                    cardNumber={`Goal: ${formatCurrency(saving.target_amount)}`}
                    status={saving.status as 'active' | 'closed'}
                    cardColor={cardColor}
                  />
                  
                  {/* Progress overlay */}
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-medium text-gray-600">Progress</span>
                      <span className="text-xs font-bold text-gray-900">{progress.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-full h-2 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-gray-500">
                      <span>Created: {formatDate(saving.created_at)}</span>
                      <span>{formatCurrency(Math.max(saving.target_amount - saving.balance, 0))} left</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1 truncate">{saving.description}</p>
                  </div>
                  
                  {/* Hover actions */}
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => openViewModal(saving)}
                        className="bg-white text-gray-900 px-3 py-1 rounded text-xs font-medium hover:bg-gray-100 flex items-center gap-1"
                      >
                        <EyeIcon className="w-3 h-3" />
                        View
                      </button>
                      <button 
                        onClick={() => openDepositForm(saving)}
                        disabled={mainBalance <= 0}
                        className={`px-3 py-1 rounded text-xs font-medium flex items-center gap-1 ${
                          mainBalance > 0
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                        }`}
                      >
                        <CurrencyDollarIcon className="w-3 h-3" />
                        Add Money
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Deposit Modal */}
      {showDepositForm && selectedSaving && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full animate-scale-in">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Deposit to {selectedSaving.label}
                </h3>
                <button
                  onClick={closeDepositForm}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>Available Balance:</strong> {formatCurrency(mainBalance)}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Funds will be transferred from your main account
                </p>
              </div>

              <form onSubmit={handleDepositSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reference ID
                  </label>
                  <input
                    type="text"
                    value={depositForm.reference}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600 text-sm font-mono"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      min="0.01"
                      max={mainBalance}
                      step="0.01"
                      value={depositForm.amount || ''}
                      onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0.00"
                      required
                    />
                  </div>
                  {depositForm.amount > mainBalance && (
                    <p className="text-sm text-red-600 mt-1">
                      Amount exceeds available balance
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    value={depositForm.detail}
                    onChange={(e) => handleInputChange('detail', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Add a note about this deposit..."
                    required
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeDepositForm}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={
                      depositLoading || 
                      depositForm.amount <= 0 || 
                      depositForm.amount > mainBalance || 
                      !depositForm.detail.trim()
                    }
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  >
                    {depositLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <CurrencyDollarIcon className="w-4 h-4" />
                        Deposit {formatCurrency(depositForm.amount || 0)}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {showViewModal && selectedSaving && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  {selectedSaving.label} - Details
                </h3>
                <button
                  onClick={closeViewModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              {viewLoading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-gray-600">Loading details...</span>
                </div>
              ) : savingDetail ? (
                <div className="space-y-6">
                  {/* Goal Information */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Goal Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Goal Name</p>
                        <p className="text-sm font-medium">{savingDetail.label}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Status</p>
                        <span className={`inline-block px-2 py-1 rounded-lg text-xs font-medium ${
                          savingDetail.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : savingDetail.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {savingDetail.status}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Current Balance</p>
                        <p className="text-lg font-semibold text-green-600">
                          {formatCurrency(savingDetail.balance)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Target Amount</p>
                        <p className="text-lg font-semibold text-blue-600">
                          {formatCurrency(savingDetail.target_amount)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Progress</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 rounded-full h-2"
                              style={{ 
                                width: `${calculateProgress(savingDetail.balance, savingDetail.target_amount)}%` 
                              }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">
                            {calculateProgress(savingDetail.balance, savingDetail.target_amount).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Remaining</p>
                        <p className="text-sm font-semibold text-orange-600">
                          {formatCurrency(Math.max(savingDetail.target_amount - savingDetail.balance, 0))}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Reference ID */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Reference ID</h4>
                    <div className="flex items-center gap-2">
                      <code className="bg-white px-3 py-2 rounded border text-sm font-mono flex-1">
                        {savingDetail.reference}
                      </code>
                      <button
                        onClick={() => copyReferenceToClipboard(savingDetail.reference)}
                        className="p-2 hover:bg-blue-100 rounded transition-colors"
                        title="Copy reference ID"
                      >
                        {copiedReference === savingDetail.reference ? (
                          <CheckIcon className="w-4 h-4 text-green-600" />
                        ) : (
                          <ClipboardDocumentIcon className="w-4 h-4 text-blue-600" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-blue-600 mt-2">
                      💡 Share this reference ID with others to allow them to contribute to your goal
                    </p>
                  </div>

                  {/* Description */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Description</h4>
                    <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                      {savingDetail.description || 'No description provided'}
                    </p>
                  </div>

                  {/* Transaction History */}
                  {savingDetail.transactions && savingDetail.transactions.length > 0 && (
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Recent Transactions</h4>
                      <div className="bg-gray-50 rounded-lg overflow-hidden">
                        <div className="max-h-64 overflow-y-auto">
                          <table className="w-full text-sm">
                            <thead className="bg-gray-100 sticky top-0">
                              <tr>
                                <th className="text-left p-3 font-medium text-gray-700">Date</th>
                                <th className="text-left p-3 font-medium text-gray-700">Amount</th>
                                <th className="text-left p-3 font-medium text-gray-700">Description</th>
                                <th className="text-left p-3 font-medium text-gray-700">Status</th>
                                <th className="text-left p-3 font-medium text-gray-700">User</th>
                              </tr>
                            </thead>
                            <tbody>
                              {savingDetail.transactions.map((transaction, index) => (
                                <tr key={transaction.id || index} className="border-t border-gray-200">
                                  <td className="p-3 text-gray-600">
                                    {formatDate(transaction.created_at)}
                                  </td>
                                  <td className="p-3 font-medium text-green-600">
                                    {formatCurrency(transaction.amount)}
                                  </td>
                                  <td className="p-3 text-gray-600">
                                    {transaction.detail}
                                  </td>
                                  <td className="p-3">
                                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                                      transaction.status === 'completed' || transaction.status === 'active'
                                        ? 'bg-green-100 text-green-800'
                                        : transaction.status === 'pending'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : 'bg-red-100 text-red-800'
                                    }`}>
                                      {transaction.status}
                                    </span>
                                  </td>
                                  <td className="p-3 text-gray-600 text-xs">
                                    {transaction.user_name}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Dates */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Created</p>
                      <p className="text-sm font-medium">{formatDate(savingDetail.created_at)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Last Updated</p>
                      <p className="text-sm font-medium">{formatDate(savingDetail.updated_at)}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4 border-t">
                    <button
                      onClick={closeViewModal}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => {
                        closeViewModal();
                        openDepositForm(selectedSaving);
                      }}
                      disabled={mainBalance <= 0}
                      className={`flex-1 px-4 py-2 rounded-md transition-colors flex items-center justify-center gap-2 ${
                        mainBalance > 0
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                      }`}
                    >
                      <CurrencyDollarIcon className="w-4 h-4" />
                      {mainBalance > 0 ? 'Add Money' : 'No Funds Available'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Failed to load saving details</p>
                  <button
                    onClick={() => openViewModal(selectedSaving)}
                    className="mt-2 text-blue-600 hover:text-blue-700"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add custom CSS for animations */}
      <style>{`
        @keyframes scale-in {
          0% { transform: scale(0.95); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </AuthLayout>
  );
}