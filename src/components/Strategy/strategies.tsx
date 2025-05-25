import { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import { AuthLayout } from '../Layout/layout';
import UseFinanceHook from '@/hooks/UseFinance';
import { createStrategyValues } from '@/types';

// Add interface for followed items
interface FollowedItem {
  id: string;
  fitem_id?: string;
  fitem_name: string;
  fitem_symbol: string;
  fitem_logo: string;
  fitem_type: string;
  fitem_description: string;
}

// Add interface for strategy items
interface StrategyItem {
  id: number;
  name: string;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
}

// Create a local form values type that matches exactly what the form uses
interface StrategyFormValues {
  id?: string; // Add this for editing
  name: string;
  description: string;
  strategy_id: number;
  max_number: string;
  min_number: string;
  item_id: string;
  item: string;
  endDate: string;
}

const Strategies = () => {
  const [activeTab, setActiveTab] = useState<'list' | 'create'>('list');
  const [strategyItems, setStrategyItems] = useState<StrategyItem[]>([]);
  const [strategies, setStrategies] = useState<any[]>([]);
  const [followedItems, setFollowedItems] = useState<FollowedItem[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [loadingStrategies, setLoadingStrategies] = useState(false);
  const [loadingFollowed, setLoadingFollowed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingStrategy, setEditingStrategy] = useState<any>(null);
  const [itemType, setItemType] = useState<'stock' | 'crypto'>('stock');
  const [selectedStrategyTab, setSelectedStrategyTab] = useState<string>('all');
  const [error, setError] = useState<string | null>(null);

  const { 
    getStrategyItem, 
    createStrategies, 
    updateStrategies, 
    getMyStrategies, 
    deleteStrategies,
    getItemFollowing
  } = UseFinanceHook();

  // Updated schema to match our local form values type
  const formSchema = Yup.object().shape({
    name: Yup.string().required('Strategy name is required'),
    description: Yup.string().required('Description is required'),
    strategy_id: Yup.number().required('Strategy item is required'),
    max_number: Yup.string().required('Maximum number is required'),
    min_number: Yup.string().required('Minimum number is required'),
    item_id: Yup.string().required('Finance item is required'),
    item: Yup.string().required('Item type is required'), 
    endDate: Yup.string().required('End date is required')
  });

  // Updated form with correct type
  const { 
    register, 
    handleSubmit, 
    reset, 
    setValue, 
    watch,
    formState: { errors } 
  } = useForm<StrategyFormValues>({
    resolver: yupResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      strategy_id: undefined as unknown as number,
      max_number: '',
      min_number: '',
      item: 'stock', 
      item_id: '',   
      endDate: ''
    }
  });

  // Watch item type to filter followed items
  const currentItemType = watch('item');

  // Define the preferred order for strategy items
  const itemOrder = {
    "high": 1,
    "open": 2,
    "low": 3,
    "volume": 4,
    "close": 5
  };

  // MOVED THIS FUNCTION HERE - before it's used
  // Safely get a strategy property with fallbacks
  const safeProperty = (strategy: any, prop: string, fallback: any = '') => {
    try {
      return strategy && strategy[prop] !== undefined ? strategy[prop] : fallback;
    } catch (error) {
      console.error(`Error accessing property ${prop}:`, error);
      return fallback;
    }
  };

  // Sort function for strategy items based on preferred order with error handling
  const sortStrategyItems = (items: StrategyItem[]) => {
    try {
      if (!Array.isArray(items)) return [];
      
      return [...items].sort((a, b) => {
        // Check if items have valid names
        if (!a || !a.name) return 1;
        if (!b || !b.name) return -1;
        
        const orderA = itemOrder[a.name as keyof typeof itemOrder] || 999;
        const orderB = itemOrder[b.name as keyof typeof itemOrder] || 999;
        return orderA - orderB;
      });
    } catch (error) {
      console.error("Error sorting strategy items:", error);
      return Array.isArray(items) ? [...items] : [];
    }
  };

  // Improved function to group strategies by type with better error handling
  const getStrategyCategories = (): string[] => {
    try {
      if (!strategies || !Array.isArray(strategies) || strategies.length === 0) {
        return ['all'];
      }
      
      // Get unique strategy types with more robust handling
      const strategyTypes = strategies
        .filter(s => s && typeof s === 'object') // Make sure each strategy is valid
        .map(s => safeProperty(s, 'strategy_item_name', '').toLowerCase())
        .filter(type => type !== ''); // Filter out empty strings
      
      const uniqueTypes = ['all', ...new Set(strategyTypes)];
      return uniqueTypes;
    } catch (error) {
      console.error("Error getting strategy categories:", error);
      return ['all']; // Fallback to just showing 'all'
    }
  };

  // Improved filter strategies function with error handling
  const getFilteredStrategies = () => {
    try {
      if (!Array.isArray(strategies)) return [];
      
      return strategies.filter(strategy => {
        if (!strategy) return false;
        if (selectedStrategyTab === 'all') return true;
        
        const strategyType = safeProperty(strategy, 'strategy_item_name', '').toLowerCase();
        return strategyType === selectedStrategyTab;
      });
    } catch (error) {
      console.error("Error filtering strategies:", error);
      return [];
    }
  };

  // Use the safe filtering function
  const filteredStrategies = getFilteredStrategies();

  useEffect(() => {
    // Reset any previous error when component mounts
    setError(null);
    
    fetchStrategyItems();
    fetchMyStrategies();
    fetchFollowedItems();
  }, []);

  useEffect(() => {
    if (editingStrategy) {
      try {
        setValue('name', editingStrategy.name);
        setValue('description', editingStrategy.description);
        
        // Make sure to handle potential NaN
        const strategyItemId = parseInt(editingStrategy.strategy_item_id);
        setValue('strategy_id', isNaN(strategyItemId) ? (undefined as unknown as number) : strategyItemId);
        
        setValue('max_number', editingStrategy.max_number?.toString() || '');
        setValue('min_number', editingStrategy.min_number?.toString() || '');
        setValue('item_id', editingStrategy.item_id || '');
        setValue('item', editingStrategy.item || 'stock');
        setValue('endDate', editingStrategy.endDate || '');
        
        setActiveTab('create');
        setItemType(editingStrategy.item || 'stock');
      } catch (error) {
        console.error("Error setting form values from editing strategy:", error);
        toast.error("Error loading strategy data");
      }
    }
  }, [editingStrategy, setValue]);

  const fetchFollowedItems = async () => {
    setLoadingFollowed(true);
    try {
      const response = await getItemFollowing();
      
      // Handle different response formats
      if (response && Array.isArray(response)) {
        if (response.length > 0 && Array.isArray(response[0])) {
          setFollowedItems(response[0]);
        } else {
          setFollowedItems(response);
        }
      } else if (response && typeof response === 'object' && !Array.isArray(response)) {
        setFollowedItems([response]);
      } else {
        setFollowedItems([]);
      }
    } catch (error) {
      console.error("Error fetching followed items:", error);
      toast.error("Failed to load followed finance items");
      setFollowedItems([]);
    } finally {
      setLoadingFollowed(false);
    }
  };

  const fetchStrategyItems = async () => {
    setLoadingItems(true);
    setError(null);
    
    try {
      const response = await getStrategyItem();
      
      // Apply the sorting function to the response with better error handling
      if (response && response[0] && Array.isArray(response[0])) {
        setStrategyItems(sortStrategyItems(response[0]));
      } else if (response && Array.isArray(response)) {
        setStrategyItems(sortStrategyItems(response));
      } else {
        console.warn("Unexpected strategy items response format:", response);
        setStrategyItems([]);
      }
    } catch (error) {
      console.error('Failed to fetch strategy items:', error);
      toast.error('Failed to load strategy items');
      setStrategyItems([]);
      setError('Failed to load strategy items. Please try refreshing the page.');
    } finally {
      setLoadingItems(false);
    }
  };

  const fetchMyStrategies = async () => {
    setLoadingStrategies(true);
    try {
      const response = await getMyStrategies("all");
      
      // Fix: Proper response handling with null checks
      if (response && Array.isArray(response.data)) {
        setStrategies(response.data);
      } else if (response && Array.isArray(response)) {
        setStrategies(response);
      } else if (response && response[0] && Array.isArray(response[0])) {
        setStrategies(response[0]);
      } else {
        console.warn('Unexpected strategies response format:', response);
        setStrategies([]);
      }
    } catch (error) {
      console.error('Failed to fetch strategies:', error);
      toast.error('Failed to load your strategies');
      setStrategies([]);
    } finally {
      setLoadingStrategies(false);
    }
  };

  // Updated submit handler with improved error handling
  const onSubmit: SubmitHandler<StrategyFormValues> = async (data) => {
    setSubmitting(true);
    try {
      // Validate strategy_id to ensure it's a valid number
      if (!data.strategy_id || isNaN(Number(data.strategy_id))) {
        throw new Error('Please select a valid strategy item');
      }

      // Convert to createStrategyValues format as needed
      const strategyData: Omit<createStrategyValues, 'id'> = {
        name: data.name,
        description: data.description,
        strategy_id: Number(data.strategy_id), // Ensure it's a number
        max_number: data.max_number,
        min_number: data.min_number,
        item_id: data.item_id,
        item: data.item,
        endDate: data.endDate
      };

      if (editingStrategy) {
        // Using type assertion to avoid the TypeScript error
        await updateStrategies({
          ...strategyData,
          id: editingStrategy.id
        } as any); // Type assertion to bypass TypeScript check
        toast.success('Strategy updated successfully!');
      } else {
        await createStrategies(strategyData);
        toast.success('Strategy created successfully!');
      }
      
      reset();
      setEditingStrategy(null);
      setActiveTab('list');
      fetchMyStrategies();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save strategy';
      toast.error(errorMessage);
      console.error('Strategy submission error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!id || typeof id !== 'string') {
      toast.error('Invalid strategy ID');
      return;
    }

    if (window.confirm('Are you sure you want to delete this strategy?')) {
      setSubmitting(true);
      try {
        await deleteStrategies(id);
        toast.success('Strategy deleted successfully!');
        fetchMyStrategies();
      } catch (error) {
        toast.error('Failed to delete strategy');
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handleEdit = (strategy: any) => {
    if (!strategy) return;
    setEditingStrategy(strategy);
  };

  const handleCancel = () => {
    reset();
    setEditingStrategy(null);
    setActiveTab('list');
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (error) {
      return dateStr; // Return the original string if parsing fails
    }
  };

  // Improved handleStrategyTabClick function
  const handleStrategyTabClick = (category: string) => {
    try {
      console.log("Tab clicked:", category);
      
      // Safety check to ensure strategies array is valid
      if (!Array.isArray(strategies)) {
        console.error("Strategies is not an array:", strategies);
        setSelectedStrategyTab('all');
        return;
      }
      
      setSelectedStrategyTab(category);
    } catch (error) {
      console.error("Error in tab click handler:", error);
      // Fallback to 'all' tab if there's an error
      setSelectedStrategyTab('all');
    }
  };

  // Filter followed items based on selected item type
  const filteredFollowedItems = followedItems.filter(
    item => item && item.fitem_type?.toLowerCase() === currentItemType?.toLowerCase()
  );

  // Inline loading spinner component
  const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-6">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
    </div>
  );

  // REMOVED DUPLICATE FUNCTION HERE

  // Check if any loading is happening
  const isLoading = loadingItems || loadingStrategies || loadingFollowed || submitting;

  return (
    <AuthLayout>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Investment Strategies</h1>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            <p>{error}</p>
            <button 
              onClick={() => {
                setError(null);
                fetchStrategyItems();
                fetchMyStrategies();
              }}
              className="text-sm font-medium underline mt-1"
            >
              Try again
            </button>
          </div>
        )}
        
        <div className="mb-6 flex border-b border-gray-200">
          <button
            className={`py-2 px-4 font-medium ${activeTab === 'list' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => {
              setActiveTab('list');
              // Refresh strategies when switching to list tab
              if (activeTab !== 'list') {
                fetchMyStrategies();
              }
            }}
          >
            My Strategies
          </button>
          <button
            className={`py-2 px-4 font-medium ${activeTab === 'create' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => {
              setEditingStrategy(null);
              reset();
              setActiveTab('create');
            }}
          >
            {editingStrategy ? 'Edit Strategy' : 'Create Strategy'}
          </button>
        </div>
        
        {isLoading && <LoadingSpinner />}
        
        {activeTab === 'list' && (
          <>
            {!strategies || strategies.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-500 mb-4">You don't have any strategies yet.</p>
                <button
                  onClick={() => setActiveTab('create')}
                  className="flex items-center mx-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <FiPlus className="mr-2" /> Create your first strategy
                </button>
              </div>
            ) : (
              <>
                {/* Strategy Type Tabs */}
                <div className="mb-6 flex flex-wrap border-b border-gray-200 overflow-x-auto">
                  {getStrategyCategories().map(category => (
                    <button
                      key={category}
                      className={`py-2 px-4 whitespace-nowrap font-medium ${
                        selectedStrategyTab === category 
                          ? 'text-blue-600 border-b-2 border-blue-600' 
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                      onClick={() => handleStrategyTabClick(category)}
                    >
                      {category === 'all' ? 'All Strategies' : category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>
                  ))}
                </div>

                {/* Add empty state for filtered strategies */}
                {filteredStrategies.length === 0 && !isLoading && (
                  <div className="text-center py-10">
                    <p className="text-gray-500 mb-4">
                      {selectedStrategyTab === 'all' 
                        ? "You don't have any strategies yet." 
                        : `No strategies found for type '${selectedStrategyTab}'.`}
                    </p>
                    {selectedStrategyTab !== 'all' && (
                      <button
                        onClick={() => setSelectedStrategyTab('all')}
                        className="flex items-center mx-auto px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                      >
                        View all strategies
                      </button>
                    )}
                  </div>
                )}

                {filteredStrategies.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredStrategies.map((strategy) => (
                      <div 
                        key={safeProperty(strategy, 'id', `strategy-${Math.random()}`)}
                        className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="p-5">
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-semibold">{safeProperty(strategy, 'name')}</h3>
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => handleEdit(strategy)}
                                className="p-1 text-gray-500 hover:text-blue-600"
                              >
                                <FiEdit2 size={16} />
                              </button>
                              <button 
                                onClick={() => handleDelete(safeProperty(strategy, 'id', ''))}
                                className="p-1 text-gray-500 hover:text-red-600"
                              >
                                <FiTrash2 size={16} />
                              </button>
                            </div>
                          </div>
                          
                          <p className="text-gray-600 text-sm mb-3">{safeProperty(strategy, 'description')}</p>
                          
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-500">Strategy Type:</span>
                              <span className="font-medium">{safeProperty(strategy, 'strategy_item_name')}</span>
                            </div>
                            
                            <div className="flex justify-between">
                              <span className="text-gray-500">Item:</span>
                              <span className="font-medium capitalize">
                                {safeProperty(strategy, 'item_name')} ({safeProperty(strategy, 'item')})
                              </span>
                            </div>
                            
                            <div className="flex justify-between">
                              <span className="text-gray-500">Range:</span>
                              <span className="font-medium">{safeProperty(strategy, 'min_number')} - {safeProperty(strategy, 'max_number')}</span>
                            </div>
                            
                            <div className="flex justify-between">
                              <span className="text-gray-500">End Date:</span>
                              <span className="font-medium">{formatDate(safeProperty(strategy, 'endDate', ''))}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}
        
        {activeTab === 'create' && (
          <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200 max-w-2xl mx-auto">
            <h2 className="text-xl font-semibold mb-6">
              {editingStrategy ? 'Edit Strategy' : 'Create New Strategy'}
            </h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Strategy Name</label>
                <input
                  type="text"
                  {...register('name')}
                  className={`w-full p-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                  placeholder="e.g., Buy when stock price exceeds $200"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  {...register('description')}
                  rows={3}
                  className={`w-full p-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                  placeholder="Describe your investment strategy..."
                />
                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Strategy Item</label>
                <select
                  {...register('strategy_id')}
                  className={`w-full p-2 border ${errors.strategy_id ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                  onChange={(e) => {
                    // Safely parse the value to a number or set to undefined
                    const value = e.target.value ? parseInt(e.target.value, 10) : undefined;
                    setValue('strategy_id', value as unknown as number);
                  }}
                >
                  <option value="">Select a strategy item</option>
                  {strategyItems.length > 0 ? strategyItems.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name.charAt(0).toUpperCase() + item.name.slice(1)} - {item.description}
                    </option>
                  )) : (
                    <option disabled>Loading strategy items...</option>
                  )}
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  Select the price data point you want to base your strategy on
                </p>
                {errors.strategy_id && <p className="mt-1 text-sm text-red-600">{errors.strategy_id.message}</p>}
                {strategyItems.length === 0 && !loadingItems && (
                  <p className="mt-1 text-sm text-amber-600">No strategy items available. Please try refreshing the page.</p>
                )}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Value</label>
                  <input
                    type="number"
                    {...register('min_number')}
                    className={`w-full p-2 border ${errors.min_number ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                    placeholder="200"
                  />
                  {errors.min_number && <p className="mt-1 text-sm text-red-600">{errors.min_number.message}</p>}
                </div>
                
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Value</label>
                  <input
                    type="number"
                    {...register('max_number')}
                    className={`w-full p-2 border ${errors.max_number ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                    placeholder="500"
                  />
                  {errors.max_number && <p className="mt-1 text-sm text-red-600">{errors.max_number.message}</p>}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Item Type</label>
                <div className="flex space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      value="stock"
                      checked={itemType === 'stock'}
                      onChange={() => {
                        setItemType('stock');
                        setValue('item', 'stock');
                        setValue('item_id', ''); // Reset item_id when type changes
                      }}
                      className="form-radio h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2">Stock</span>
                  </label>
                  
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      value="crypto"
                      checked={itemType === 'crypto'}
                      onChange={() => {
                        setItemType('crypto');
                        setValue('item', 'crypto');
                        setValue('item_id', ''); // Reset item_id when type changes
                      }}
                      className="form-radio h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2">Crypto</span>
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Finance Item</label>
                <select
                  {...register('item_id')}
                  className={`w-full p-2 border ${errors.item_id ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                >
                  <option value="">Select a {itemType}</option>
                  {filteredFollowedItems.map((item) => (
                    <option 
                      key={item.id || `item-${Math.random()}`} 
                      value={item.fitem_id || item.id}
                    >
                      {item.fitem_name} ({item.fitem_symbol})
                    </option>
                  ))}
                </select>
                {filteredFollowedItems.length === 0 && (
                  <p className="mt-1 text-sm text-amber-600">
                    No {itemType}s found. Please follow some {itemType}s first.
                  </p>
                )}
                {errors.item_id && <p className="mt-1 text-sm text-red-600">{errors.item_id.message}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  {...register('endDate')}
                  className={`w-full p-2 border ${errors.endDate ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                />
                <p className="mt-1 text-xs text-gray-500">Format: YYYY-MM-DD HH:MM</p>
                {errors.endDate && <p className="mt-1 text-sm text-red-600">{errors.endDate.message}</p>}
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-70"
                >
                  {submitting ? 'Saving...' : editingStrategy ? 'Update Strategy' : 'Create Strategy'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </AuthLayout>
  );
};

export default Strategies;