import  { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { FunnelIcon } from '@heroicons/react/24/solid';


interface Transaction {
  id: string;
  name: string;
  date: string;          
  time?: string;          
  amount: number;
  description?: string;   
  status: 'completed' | 'pending' | 'failed';
  category: string;
  type: 'income' | 'expense';
}

interface TransactionTableProps {
  title?: string;
  showTitle?: boolean;
  initialPageSize?: number;
  maxHeight?: string;
  customData?: Transaction[];
}

export default function TransactionTable({ 
  title = "Recent Transactions", 
  showTitle = true,
  initialPageSize = 5,
  maxHeight = "350px",
  customData
}: TransactionTableProps) {
  
  // Sample transactions data
  const defaultTransactions: Transaction[] = [
    { 
      id: 'TX001', 
      name: 'Salary Deposit', 
      date: '2025-03-03', 
      time: '09:15:22',
      amount: 3500, 
      description: 'Monthly salary payment',
      status: 'completed', 
      category: 'Income', 
      type: 'income' 
    },
    { 
      id: 'TX002', 
      name: 'Amazon', 
      date: '2025-03-05', 
      time: '14:32:10',
      amount: -250, 
      description: 'Online shopping for electronics',
      status: 'completed', 
      category: 'Shopping', 
      type: 'expense' 
    },
    { 
      id: 'TX003', 
      name: 'Starbucks', 
      date: '2025-03-02', 
      time: '08:45:33',
      amount: -12.5, 
      description: 'Coffee and breakfast',
      status: 'completed', 
      category: 'Food & Drinks', 
      type: 'expense' 
    },
    { 
      id: 'TX004', 
      name: 'Netflix Subscription', 
      date: '2025-03-01', 
      time: '00:01:05',
      amount: -14.99, 
      description: 'Monthly subscription fee',
      status: 'completed', 
      category: 'Entertainment', 
      type: 'expense' 
    },
    { 
      id: 'TX005', 
      name: 'Freelance Work', 
      date: '2025-03-08', 
      time: '16:20:45',
      amount: 750, 
      description: 'Website development project',
      status: 'pending', 
      category: 'Income', 
      type: 'income' 
    },
    { 
      id: 'TX006', 
      name: 'Uber Ride', 
      date: '2025-03-07', 
      time: '19:12:38',
      amount: -32.5, 
      description: 'Transportation to downtown meeting',
      status: 'completed', 
      category: 'Transport', 
      type: 'expense' 
    },
    { 
      id: 'TX007', 
      name: 'Grocery Store', 
      date: '2025-03-06', 
      time: '11:05:17',
      amount: -135.27, 
      description: 'Weekly grocery shopping',
      status: 'completed', 
      category: 'Groceries', 
      type: 'expense' 
    },
    { 
      id: 'TX008', 
      name: 'Investment Dividend', 
      date: '2025-03-10', 
      time: '10:00:00',
      amount: 120.5, 
      description: 'Quarterly dividend payment',
      status: 'pending', 
      category: 'Investment', 
      type: 'income' 
    },
    { 
      id: 'TX009', 
      name: 'Electric Bill', 
      date: '2025-03-12', 
      time: '15:45:22',
      amount: -87.35, 
      description: 'Monthly utility payment',
      status: 'pending', 
      category: 'Utilities', 
      type: 'expense' 
    },
    { 
      id: 'TX010', 
      name: 'Phone Bill', 
      date: '2025-03-15', 
      time: '08:30:11',
      amount: -65, 
      description: 'Monthly mobile service fee',
      status: 'failed', 
      category: 'Utilities', 
      type: 'expense' 
    },
    { 
      id: 'TX011', 
      name: 'Bonus Payment', 
      date: '2025-03-20', 
      time: '17:05:45',
      amount: 1200, 
      description: 'Performance bonus',
      status: 'pending', 
      category: 'Income', 
      type: 'income' 
    },
    { 
      id: 'TX012', 
      name: 'Electricity Bill', 
      date: '2028-03-01', 
      time: '04:28:48',
      amount: -295.81, 
      description: 'Payment for monthly electricity bill',
      status: 'failed', 
      category: 'Payments', 
      type: 'expense' 
    },
    { 
      id: 'TX013', 
      name: 'Restaurant Dinner', 
      date: '2025-03-14', 
      time: '20:15:30',
      amount: -85.75, 
      description: 'Dinner with friends',
      status: 'completed', 
      category: 'Food & Drinks', 
      type: 'expense' 
    },
  ];

  // State variables
  const [transactions, setTransactions] = useState<Transaction[]>(customData || defaultTransactions);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>(customData || defaultTransactions);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<string>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filterOpen, setFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Update transactions if customData changes
  useEffect(() => {
    if (customData) {
      setTransactions(customData);
      setFilteredTransactions(customData);
    }
  }, [customData]);

  // Get unique categories for the filter
  const categories = Array.from(new Set(transactions.map(tx => tx.category)));

  // Calculate pagination values
  const totalPages = Math.ceil(filteredTransactions.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + pageSize);

  // Handle filtering and sorting
  useEffect(() => {
    let result = [...transactions];

    // Apply search
    if (searchTerm) {
      result = result.filter(tx => 
        tx.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        tx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (tx.description && tx.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(tx => tx.status === statusFilter);
    }

    // Apply type filter
    if (typeFilter !== 'all') {
      result = result.filter(tx => tx.type === typeFilter);
    }

    // Apply category filter
    if (categoryFilter !== 'all') {
      result = result.filter(tx => tx.category === categoryFilter);
    }

    // Apply sorting
    result.sort((a, b) => {
      if (sortKey === 'amount') {
        return sortDirection === 'asc' ? a.amount - b.amount : b.amount - a.amount;
      } else if (sortKey === 'name') {
        return sortDirection === 'asc' ? 
          a.name.localeCompare(b.name) : 
          b.name.localeCompare(a.name);
      } else if (sortKey === 'date') {
        const dateA = new Date(a.date + (a.time ? `T${a.time}` : '')).getTime();
        const dateB = new Date(b.date + (b.time ? `T${b.time}` : '')).getTime();
        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      }
      return 0;
    });

    setFilteredTransactions(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [transactions, searchTerm, sortKey, sortDirection, statusFilter, typeFilter, categoryFilter]);

  // Handle sorting toggle
  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  // Get status badge style
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mt-6">
      {showTitle && (
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
      )}

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
        <div className="flex w-full sm:w-auto relative">
          <input 
            type="text" 
            placeholder="Search transactions..." 
            className="pl-8 pr-3 py-1.5 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <MagnifyingGlassIcon className="absolute left-2 top-2 h-4 w-4 text-gray-400" />
        </div>
        
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <button 
            className="px-3 py-1.5 border border-gray-300 rounded-md flex items-center text-sm font-medium hover:bg-gray-50"
            onClick={() => setFilterOpen(!filterOpen)}
          >
            <FunnelIcon className="h-4 w-4 mr-1" />
            Filters
            <ChevronDownIcon className={`h-4 w-4 ml-1 transition-transform ${filterOpen ? 'rotate-180' : ''}`} />
          </button>
          
          <select 
            className="px-3 py-1.5 border border-gray-300 rounded-md text-sm"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
          >
            <option value={5}>5 per page</option>
            <option value={10}>10 per page</option>
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
          </select>
        </div>
      </div>
      
      {/* Filter Panel */}
      {filterOpen && (
        <div className="mb-4 p-3 border border-gray-200 rounded-md bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select 
                className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select 
                className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select 
                className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="mt-3 flex justify-end">
            <button 
              className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md mr-2 hover:bg-gray-50"
              onClick={() => {
                setStatusFilter('all');
                setTypeFilter('all');
                setCategoryFilter('all');
                setSearchTerm('');
              }}
            >
              Reset Filters
            </button>
            <button 
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
              onClick={() => setFilterOpen(false)}
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Transaction Table with fixed height and scrollbar */}
      <div className={`overflow-auto`} style={{ maxHeight }}>
        <table className="w-full">
          <thead className="bg-gray-50 text-xs uppercase text-gray-700 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-2 text-left">
                <button 
                  className="flex items-center font-semibold"
                  onClick={() => handleSort('name')}
                >
                  Transaction
                  {sortKey === 'name' && (
                    <span className="ml-1">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </button>
              </th>
              <th className="px-4 py-2 text-center">
                <button 
                  className="flex items-center font-semibold mx-auto"
                  onClick={() => handleSort('amount')}
                >
                  Amount
                  {sortKey === 'amount' && (
                    <span className="ml-1">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </button>
              </th>
              <th className="px-4 py-2 text-center">
                <button 
                  className="flex items-center font-semibold mx-auto"
                  onClick={() => handleSort('date')}
                >
                  Date
                  {sortKey === 'date' && (
                    <span className="ml-1">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </button>
              </th>
              <th className="px-4 py-2 text-left hidden md:table-cell">Category</th>
              <th className="px-4 py-2 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedTransactions.length > 0 ? (
              paginatedTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium">{tx.name}</p>
                      <p className="text-xs text-gray-500">{tx.id}</p>
                      {tx.description && (
                        <p className="text-xs text-gray-500 truncate max-w-[180px]">{tx.description}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`font-semibold ${tx.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {tx.amount >= 0 ? '+' : ''}{tx.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div>
                      <div className="text-xs">{tx.date}</div>
                      {tx.time && <div className="text-xs text-gray-500">{tx.time}</div>}
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-sm">{tx.category}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(tx.status)}`}>
                      {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                  No transactions found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Showing {filteredTransactions.length > 0 ? startIndex + 1 : 0} to {Math.min(startIndex + pageSize, filteredTransactions.length)} of {filteredTransactions.length} transactions
        </div>
        
        <div className="flex space-x-1">
          <button 
            className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </button>
          
          {totalPages <= 5 ? (
            // Show all pages if 5 or fewer
            [...Array(totalPages)].map((_, i) => (
              <button 
                key={i + 1}
                className={`px-3 py-1 border border-gray-300 rounded-md ${
                  i + 1 === currentPage 
                    ? 'bg-blue-500 text-white' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))
          ) : (
            // Show pagination with ellipsis for many pages
            <>
              <button 
                className={`px-3 py-1 border border-gray-300 rounded-md ${
                  currentPage === 1 ? 'bg-blue-500 text-white' : 'hover:bg-gray-50'
                }`}
                onClick={() => setCurrentPage(1)}
              >
                1
              </button>
              
              {currentPage > 3 && <span className="px-2 py-1">...</span>}
              
              {currentPage !== 1 && currentPage !== totalPages && (
                <button 
                  className="px-3 py-1 border border-gray-300 rounded-md bg-blue-500 text-white"
                >
                  {currentPage}
                </button>
              )}
              
              {currentPage < totalPages - 2 && <span className="px-2 py-1">...</span>}
              
              <button 
                className={`px-3 py-1 border border-gray-300 rounded-md ${
                  currentPage === totalPages ? 'bg-blue-500 text-white' : 'hover:bg-gray-50'
                }`}
                onClick={() => setCurrentPage(totalPages)}
              >
                {totalPages}
              </button>
            </>
          )}
          
          <button 
            className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}