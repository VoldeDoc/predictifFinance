import { useState, useEffect } from "react";
import TransactionTable from "@/components/Dashboard/Tools/TransactionTable";
import UseFinanceHook from "@/hooks/UseFinance";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { 
  BanknotesIcon, 
  PlusIcon,
  ArrowRightIcon,
  FlagIcon,
  ClipboardDocumentIcon,
  CheckIcon,
  XMarkIcon,
  CurrencyDollarIcon,
  InformationCircleIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  ExclamationTriangleIcon
} from "@heroicons/react/24/outline";
import AccountCard from "./AccountCard";

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

interface FoundGoalData {
  id: string;
  ref: string;
  amount: number;
  detail: string | null;
  type: string;
  status: string;
  item_id: string | null;
  user_ref_id: string;
  created_at: string;
  updated_at: string;
}

export const CardsComponent = () => {
  const { getSavingWallets, getAllWallets, createSavingsFundDeposit, getSavedFundByReferenceId } = UseFinanceHook();
  const navigate = useNavigate();
  const [savings, setSavings] = useState<SavingsData[]>([]);
  const [wallets, setWallets] = useState<WalletData[]>([]);
  const [selectedSaving, setSelectedSaving] = useState<SavingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedReference, setCopiedReference] = useState<string | null>(null);
  const [showDepositForm, setShowDepositForm] = useState(false);
  const [depositLoading, setDepositLoading] = useState(false);
  const [isManualReference, setIsManualReference] = useState(false);
  const [searchingGoal, setSearchingGoal] = useState(false);
  const [foundGoalData, setFoundGoalData] = useState<FoundGoalData[] | null>(null);
  const [goalSearched, setGoalSearched] = useState(false);
  const [tempReference, setTempReference] = useState('');
  
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
      // Fetch both savings and wallets data
      const [savingsResponse, walletsResponse] = await Promise.all([
        getSavingWallets(),
        getAllWallets()
      ]);
      
      console.log('Savings API Response:', savingsResponse);
      console.log('Wallets API Response:', walletsResponse);
      
      // Handle savings data
      let savingsData: SavingsData[] = [];
      if (Array.isArray(savingsResponse)) {
        savingsData = savingsResponse;
      } else if (savingsResponse?.data && Array.isArray(savingsResponse.data)) {
        savingsData = savingsResponse.data;
      }
      
      // Handle wallets data
      let walletsData: WalletData[] = [];
      if (Array.isArray(walletsResponse)) {
        walletsData = walletsResponse;
      } else if (walletsResponse?.data && Array.isArray(walletsResponse.data)) {
        walletsData = walletsResponse.data;
      }
      
      setSavings(savingsData);
      setWallets(walletsData);
      
      // Set first saving as selected by default
      if (savingsData.length > 0) {
        setSelectedSaving(savingsData[0]);
      }
      
    } catch (error: any) {
      console.error('Error fetching data:', error);
      toast.error(error.message || 'Failed to fetch data');
      setSavings([]);
      setWallets([]);
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

  const navigateToAllSavings = () => {
    navigate('/all-savings');
  };

  const navigateToCreateSaving = () => {
    navigate('/predictive-account?tab=savings');
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

  const searchGoalByReference = async (referenceId: string) => {
    if (!referenceId.trim()) {
      toast.error('Please enter a reference ID');
      return;
    }

    try {
      setSearchingGoal(true);
      setGoalSearched(false);
      setFoundGoalData(null);
      
      console.log('Searching for goal with reference:', referenceId);
      const response = await getSavedFundByReferenceId(Number(referenceId));
      console.log('Goal search response:', response);
      
      // Handle the response based on the API structure
      let goalData: FoundGoalData[] = [];
      if (Array.isArray(response)) {
        goalData = response;
      } else if (response?.data && Array.isArray(response.data)) {
        goalData = response.data;
      }
      
      setFoundGoalData(goalData);
      setGoalSearched(true);
      
      if (goalData.length > 0) {
        toast.success(`Found ${goalData.length} transaction(s) for this goal`);
      } else {
        toast.info('No transactions found for this reference ID, but you can still deposit to it');
      }
      
    } catch (error: any) {
      console.error('Error searching for goal:', error);
      setFoundGoalData(null);
      setGoalSearched(true);
      
      // Still allow deposit even if search fails
      toast.warning('Could not fetch goal details, but you can still deposit to this reference ID');
    } finally {
      setSearchingGoal(false);
    }
  };

  const openDepositForm = (saving?: SavingsData) => {
    if (saving) {
      setDepositForm({
        reference: saving.reference,
        amount: 0,
        detail: ''
      });
      setSelectedSaving(saving);
      setIsManualReference(false);
      setFoundGoalData(null);
      setGoalSearched(false);
      setTempReference('');
    } else {
      // Open form for manual reference entry
      setDepositForm({
        reference: '',
        amount: 0,
        detail: ''
      });
      setSelectedSaving(null);
      setIsManualReference(true);
      setFoundGoalData(null);
      setGoalSearched(false);
      setTempReference('');
    }
    setShowDepositForm(true);
  };

  const closeDepositForm = () => {
    setShowDepositForm(false);
    setDepositForm({
      reference: '',
      amount: 0,
      detail: ''
    });
    setIsManualReference(false);
    setFoundGoalData(null);
    setGoalSearched(false);
    setTempReference('');
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

    if (!depositForm.reference.trim()) {
      toast.error('Please provide a reference ID');
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

  const handleReferenceSearch = () => {
    if (tempReference.trim()) {
      setDepositForm(prev => ({ ...prev, reference: tempReference.trim() }));
      searchGoalByReference(tempReference.trim());
    }
  };

  const getTotalGoalAmount = (goalData: FoundGoalData[]) => {
    return goalData
      .filter(item => item.status === 'approved' && item.type === 'deposit')
      .reduce((sum, item) => sum + item.amount, 0);
  };

  const getGoalStats = (goalData: FoundGoalData[]) => {
    const approved = goalData.filter(item => item.status === 'approved').length;
    const pending = goalData.filter(item => item.status === 'pending').length;
    const totalAmount = getTotalGoalAmount(goalData);
    
    return { approved, pending, totalAmount };
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading savings...</span>
        </div>
      </div>
    );
  }

  // Show only first 4 savings
  const displayedSavings = savings.slice(0, 4);
  const hasMoreSavings = savings.length > 4;
  const mainBalance = getMainAccountBalance();

  return (
    <>
      <div className="max-w-7xl mx-auto">
        {/* Info Banner */}
        <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
          <div className="flex flex-col sm:flex-row items-start gap-3">
            <div className="flex-shrink-0">
              <InformationCircleIcon className="w-5 h-5 text-blue-600 mt-0.5" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-blue-900 mb-1">
                How to Deposit to Your Savings Goal
              </h3>
              <p className="text-sm text-blue-700">
                <span className="font-medium">Step 1:</span> Click on a savings goal card or use "Deposit to Any Goal"
                <span className="hidden sm:inline mx-2">•</span>
                <span className="block sm:inline mt-1 sm:mt-0"></span>
                <span className="font-medium">Step 2:</span> Enter reference ID and search for goal details
                <span className="hidden sm:inline mx-2">•</span>
                <span className="block sm:inline mt-1 sm:mt-0"></span>
                <span className="font-medium">Step 3:</span> Enter amount and description to complete deposit
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">My Savings Goals</h1>
            <p className="text-gray-600">Track and manage your savings goals</p>
            <p className="text-sm text-blue-600 mt-1">
              💰 Main Account Balance: <span className="font-semibold">{formatCurrency(mainBalance)}</span>
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => openDepositForm()}
              disabled={mainBalance <= 0}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg transition-all duration-300 text-sm sm:text-base ${
                mainBalance > 0
                  ? 'bg-green-100 text-green-700 hover:bg-green-200 shadow-md hover:shadow-lg transform hover:scale-105'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <CurrencyDollarIcon className="w-4 h-4" />
              {mainBalance > 0 ? '💫 Deposit to Any Goal' : 'No Funds Available'}
            </button>
            <button 
              onClick={navigateToAllSavings}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm sm:text-base"
            >
              <BanknotesIcon className="w-4 h-4" />
              View All ({savings.length})
            </button>
            <button 
              onClick={navigateToCreateSaving}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
            >
              <PlusIcon className="w-4 h-4" />
              Add New Goal
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left side - Savings cards (30%) */}
          <div className="w-full lg:w-[30%] bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl p-4">
            <h2 className="text-xl font-medium text-white mb-6">
              Savings Goals ({savings.length})
            </h2>
            
            {savings.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-white">
                <BanknotesIcon className="w-16 h-16 mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No Savings Goals</h3>
                <p className="text-center opacity-75 mb-4">Create your first savings goal to get started</p>
                <button 
                  onClick={navigateToCreateSaving}
                  className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                >
                  Create Goal
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {displayedSavings.map((saving, index) => {
                  const cardColor = getSavingCardColor(index);
                  const progress = calculateProgress(saving.balance, saving.target_amount);
                  const isSelected = selectedSaving?.reference === saving.reference;
                  
                  return (
                    <div 
                      key={saving.reference}
                      className={`cursor-pointer transition-all duration-200 ${
                        isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-blue-400' : ''
                      }`}
                      onClick={() => setSelectedSaving(saving)}
                    >
                      <AccountCard
                        title={saving.label}
                        amount={formatCurrency(saving.balance)}
                        currency="USD"
                        cardNumber={`Goal: ${formatCurrency(saving.target_amount)}`}
                        status={saving.status as 'active' | 'closed'}
                        cardColor={cardColor}
                      />
                      
                      {/* Progress indicator */}
                      <div className="mt-2 px-2">
                        <div className="bg-white bg-opacity-20 rounded-full h-2">
                          <div 
                            className="bg-white rounded-full h-2 transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between mt-1 text-xs text-white opacity-90">
                          <span>{progress.toFixed(1)}% completed</span>
                          <span>{formatCurrency(saving.target_amount - saving.balance)} to go</span>
                        </div>
                      </div>
                      
                      {/* Quick deposit button with animation */}
                      <div className="mt-2 px-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openDepositForm(saving);
                          }}
                          disabled={mainBalance <= 0}
                          className={`w-full py-2 px-3 rounded-lg text-xs font-medium transition-all duration-300 transform hover:scale-105 relative overflow-hidden ${
                            mainBalance > 0
                              ? 'bg-white bg-opacity-20 hover:bg-opacity-30 text-white shadow-lg animate-pulse hover:animate-none'
                              : 'bg-gray-500 bg-opacity-50 text-gray-300 cursor-not-allowed'
                          }`}
                        >
                          {/* Animated shine effect */}
                          {mainBalance > 0 && (
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 transform -skew-x-12 animate-shimmer"></div>
                          )}
                          
                          <div className="relative flex items-center justify-center">
                            <CurrencyDollarIcon className="w-3 h-3 mr-1" />
                            {mainBalance > 0 ? '💫 Add Money' : 'No Funds Available'}
                          </div>
                        </button>
                      </div>
                    </div>
                  );
                })}
                
                {hasMoreSavings && (
                  <button
                    onClick={navigateToAllSavings}
                    className="w-full mt-4 bg-white bg-opacity-20 hover:bg-opacity-30 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <span>View All {savings.length} Goals</span>
                    <ArrowRightIcon className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>
          
          {/* Right side - Content area (70%) */}
          <div className="w-full lg:w-[70%] bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <div className="flex flex-col gap-6">
              {/* Savings Details Section */}
              <div className="bg-white dark:bg-gray-700 rounded-xl p-4 shadow-sm border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Savings Details</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openDepositForm()}
                      disabled={mainBalance <= 0}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 relative overflow-hidden ${
                        mainBalance > 0
                          ? 'bg-purple-100 text-purple-700 hover:bg-purple-200 shadow-lg'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <MagnifyingGlassIcon className="w-4 h-4" />
                      {mainBalance > 0 ? 'Find & Deposit' : 'No Funds'}
                    </button>
                    {selectedSaving && (
                      <button
                        onClick={() => openDepositForm(selectedSaving)}
                        disabled={mainBalance <= 0}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 relative overflow-hidden ${
                          mainBalance > 0
                            ? 'bg-green-100 text-green-700 hover:bg-green-200 shadow-lg animate-bounce hover:animate-none'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {/* Animated glow effect */}
                        {mainBalance > 0 && (
                          <div className="absolute inset-0 bg-green-300 rounded-lg opacity-0 animate-ping"></div>
                        )}
                        
                        <div className="relative flex items-center gap-2">
                          <CurrencyDollarIcon className="w-4 h-4" />
                          {mainBalance > 0 ? '✨ Deposit Now' : 'No Funds'}
                        </div>
                      </button>
                    )}
                  </div>
                </div>

                {selectedSaving ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-500">Goal Name</p>
                        <p className="text-sm font-medium">{selectedSaving.label}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Current Balance</p>
                        <p className="text-sm font-semibold text-green-600">
                          {formatCurrency(selectedSaving.balance)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Target Amount</p>
                        <p className="text-sm font-semibold text-blue-600">
                          {formatCurrency(selectedSaving.target_amount)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-500">Progress</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 rounded-full h-2 transition-all duration-300"
                              style={{ 
                                width: `${calculateProgress(selectedSaving.balance, selectedSaving.target_amount)}%` 
                              }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">
                            {calculateProgress(selectedSaving.balance, selectedSaving.target_amount).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Description</p>
                        <p className="text-sm">{selectedSaving.description}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Created</p>
                        <p className="text-sm">{formatDate(selectedSaving.created_at)}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-500">Reference ID</p>
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-mono bg-gray-100 px-2 py-1 rounded flex-1 truncate">
                            {selectedSaving.reference}
                          </p>
                          <button
                            onClick={() => copyReferenceToClipboard(selectedSaving.reference)}
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                            title="Copy reference ID"
                          >
                            {copiedReference === selectedSaving.reference ? (
                              <CheckIcon className="w-4 h-4 text-green-600" />
                            ) : (
                              <ClipboardDocumentIcon className="w-4 h-4 text-gray-600" />
                            )}
                          </button>
                        </div>
                        <p className="text-xs text-blue-600 mt-1">
                          💡 Copy this ID to share with others for contributions
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Status</p>
                        <span className={`inline-block px-2 py-1 rounded-lg text-center text-white text-xs ${
                          selectedSaving.status === 'active' 
                            ? 'bg-green-600' 
                            : 'bg-gray-600'
                        }`}>
                          {selectedSaving.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FlagIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500 mb-3">Select a savings goal to view details</p>
                    <p className="text-xs text-blue-600">
                      💡 Or use "Find & Deposit" to contribute to any goal by reference ID
                    </p>
                  </div>
                )}
              </div>

              {/* Goal Summary Section */}
              {selectedSaving && (
                <div className="bg-white dark:bg-gray-700 rounded-xl p-4 shadow-sm border">
                  <h4 className="text-lg font-medium mb-4">Goal Summary</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
                      <p className="text-xs text-orange-600 font-medium">Remaining Amount</p>
                      <p className="text-lg font-bold text-orange-700">
                        {formatCurrency(selectedSaving.target_amount - selectedSaving.balance)}
                      </p>
                    </div>
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                      <p className="text-xs text-blue-600 font-medium">Monthly Target</p>
                      <p className="text-lg font-bold text-blue-700">
                        {formatCurrency((selectedSaving.target_amount - selectedSaving.balance) / 12)}
                      </p>
                    </div>
                    <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                      <p className="text-xs text-green-600 font-medium">Weekly Target</p>
                      <p className="text-lg font-bold text-green-700">
                        {formatCurrency((selectedSaving.target_amount - selectedSaving.balance) / 52)}
                      </p>
                    </div>
                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                      <p className="text-xs text-purple-600 font-medium">Daily Target</p>
                      <p className="text-lg font-bold text-purple-700">
                        {formatCurrency((selectedSaving.target_amount - selectedSaving.balance) / 365)}
                      </p>
                    </div>
                  </div>

                  {/* Progress Timeline */}
                  <div className="mt-6">
                    <h5 className="text-md font-medium mb-3">Progress Timeline</h5>
                    <div className="relative">
                      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center relative z-10">
                            <span className="text-white text-xs font-bold">✓</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Goal Created</p>
                            <p className="text-xs text-gray-500">{formatDate(selectedSaving.created_at)}</p>
                          </div>
                        </div>
                        {selectedSaving.balance > 0 && (
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center relative z-10">
                              <span className="text-white text-xs font-bold">$</span>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Current Balance</p>
                              <p className="text-xs text-gray-500">{formatCurrency(selectedSaving.balance)}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Full width transaction history */}
            <div className="mt-6">
              <TransactionTable
                showTitle={true}
                initialPageSize={10}
                maxHeight="300px"
                renderNameWithIcon={true}
                hideCategory={true}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Deposit Modal with Goal Search */}
      {showDepositForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full animate-scale-in max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {isManualReference ? 'Deposit to Savings Goal' : `Deposit to ${selectedSaving?.label}`}
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
                    Reference ID *
                  </label>
                  <div className="relative">
                    {isManualReference ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={tempReference}
                          onChange={(e) => setTempReference(e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter reference ID (e.g., REF123456)"
                        />
                        <button
                          type="button"
                          onClick={handleReferenceSearch}
                          disabled={searchingGoal || !tempReference.trim()}
                          className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                        >
                          {searchingGoal ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          ) : (
                            <EyeIcon className="w-4 h-4" />
                          )}
                          {searchingGoal ? 'Searching...' : 'Preview'}
                        </button>
                      </div>
                    ) : (
                      <input
                        type="text"
                        value={depositForm.reference}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600 text-sm font-mono"
                      />
                    )}
                  </div>
                  {isManualReference && (
                    <p className="text-xs text-gray-500 mt-1">
                      💡 Enter the reference ID and click "Preview" to see goal details
                    </p>
                  )}
                </div>

                {/* Goal Search Results */}
                {isManualReference && goalSearched && (
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                      <InformationCircleIcon className="w-4 h-4" />
                      Goal Information for: {tempReference}
                    </h4>
                    
                    {foundGoalData && foundGoalData.length > 0 ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white p-3 rounded border">
                            <p className="text-xs text-gray-500">Total Balance</p>
                            <p className="text-sm font-semibold text-green-600">
                              {formatCurrency(getGoalStats(foundGoalData).totalAmount)}
                            </p>
                          </div>
                          <div className="bg-white p-3 rounded border">
                            <p className="text-xs text-gray-500">Transactions</p>
                            <p className="text-sm font-semibold text-blue-600">
                              {foundGoalData.length} total
                            </p>
                          </div>
                        </div>
                        
                        <div className="bg-white p-3 rounded border">
                          <p className="text-xs text-gray-500 mb-2">Recent Transactions</p>
                          <div className="space-y-2 max-h-32 overflow-y-auto">
                            {foundGoalData.slice(0, 3).map((transaction, index) => (
                              <div key={index} className="flex justify-between items-center text-xs">
                                <span className="flex items-center gap-2">
                                  <span className={`w-2 h-2 rounded-full ${
                                    transaction.status === 'approved' ? 'bg-green-500' : 
                                    transaction.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                                  }`}></span>
                                  {formatDate(transaction.created_at)}
                                </span>
                                <span className="font-medium">
                                  {formatCurrency(transaction.amount)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <button
                          type="button"
                          onClick={() => {
                            setDepositForm(prev => ({ ...prev, reference: tempReference }));
                            toast.success('Reference ID confirmed! You can now proceed with your deposit.');
                          }}
                          className="w-full py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors text-sm font-medium"
                        >
                          ✓ Use This Reference ID
                        </button>
                      </div>
                    ) : (
                      <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                        <div className="flex items-start gap-2">
                          <ExclamationTriangleIcon className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm text-yellow-700 font-medium">No transactions found</p>
                            <p className="text-xs text-yellow-600 mt-1">
                              This reference ID doesn't have any existing transactions, but you can still deposit to it. 
                              The goal might be new or belong to another user.
                            </p>
                            <button
                              type="button"
                              onClick={() => {
                                setDepositForm(prev => ({ ...prev, reference: tempReference }));
                                toast.info('Reference ID set! You can proceed with your deposit.');
                              }}
                              className="mt-2 py-1 px-3 bg-yellow-100 text-yellow-700 rounded text-xs hover:bg-yellow-200 transition-colors"
                            >
                              Use Anyway
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

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
                    placeholder={isManualReference ? "Contributing to your savings goal..." : "Add a note about this deposit..."}
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
                      !depositForm.detail.trim() ||
                      !depositForm.reference.trim()
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
      
      {/* Add custom CSS for animations */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }
        
        @keyframes scale-in {
          0% { transform: scale(0.95); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </>
  );
};

export default CardsComponent;