import { useState, useEffect, ReactNode } from "react";
import {
  MagnifyingGlassIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { FunnelIcon } from "@heroicons/react/24/solid";
import UseFinanceHook from "@/hooks/UseFinance";

interface Transaction {
  id: string;
  name: string;
  icon?: ReactNode;
  account?: string;
  date: string;         // YYYY-MM-DD
  time?: string;        // HH:MM:SS
  amount: number;
  description?: string; // raw.detail or "—"
  status: "completed" | "pending" | "failed";
  category?: string;    // e.g. "Deposit"
  type: "income" | "expense";
}

interface TableHeader {
  key: string;
  label: string;
}

interface TransactionTableProps {
  title?: string;
  showTitle?: boolean;
  initialPageSize?: number;
  maxHeight?: string;
  data?: Transaction[]; // Add this back to accept external data
  renderNameWithIcon?: boolean;
  hideCategory?: boolean;
}

export default function TransactionTable({
  title = "Recent Transactions",
  showTitle = true,
  initialPageSize = 5,
  maxHeight = "350px",
  data, // Accept external data
  renderNameWithIcon = false,
  hideCategory = false,
}: TransactionTableProps) {
  // 1) Headers
  const defaultHeaders: TableHeader[] = [
    { key: "name", label: "Transaction" },
    { key: "amount", label: "Amount" },
    { key: "date", label: "Date" },
  ];
  if (!hideCategory) {
    defaultHeaders.push({ key: "category", label: "Category" });
  }
  defaultHeaders.push({ key: "status", label: "Status" });
  const headers = defaultHeaders;

  // 2) All-internal state
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState<string>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [filterOpen, setFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [accountFilter, setAccountFilter] = useState<string>("all");

  // 3) Load deposit history on mount OR use external data
  const { getDepositTransactions } = UseFinanceHook();
  
  useEffect(() => {
    // If external data is provided, use it
    if (data) {
      setTransactions(data);
      setFilteredTransactions(data);
      return;
    }

    // Otherwise, fetch deposit history
    const fetchHistory = async () => {
      try {
        const raw = await getDepositTransactions();
        // Map API → local Transaction shape:
        const mapped: Transaction[] = raw.map((r) => {
          // split created_at into date/time
          const [datePart, timePartRaw] = r.created_at.split("T");
          const timePart = timePartRaw.split(".")[0]; // drop milliseconds
          return {
            id: r.id,
            name: r.detail || 'N/A',     // you can customize
            account: undefined,           // no account in API
            date: datePart,               // "YYYY-MM-DD"
            time: timePart,               // "HH:MM:SS"
            amount: r.amount,
            description: r.detail ?? "",
            status: (r.status as "completed" | "pending" | "failed"),
            category: "Deposit",
            type: "income",               // treat deposit as "income"
          };
        });
        setTransactions(mapped);
        setFilteredTransactions(mapped);
      } catch (err) {
        console.error("Error fetching deposit history:", err);
        setTransactions([]);
        setFilteredTransactions([]);
      }
    };
    fetchHistory();
  }, [data]); // Add data as dependency

  // Update transactions when external data changes
  useEffect(() => {
    if (data) {
      setTransactions(data);
      setFilteredTransactions(data);
    }
  }, [data]);

  // 4) Derive unique "accounts" for the filter dropdown
  const accounts = Array.from(
    new Set(transactions.filter((tx) => tx.account).map((tx) => tx.account!))
  );

  // 5) Pagination helpers
  const totalPages = Math.ceil(filteredTransactions.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedTransactions = filteredTransactions.slice(
    startIndex,
    startIndex + pageSize
  );

  // 6) Whenever any filter/sort/search changes, recalc filteredTransactions
  useEffect(() => {
    let result = [...transactions];

    // Search by name, id, description, or account
    if (searchTerm) {
      result = result.filter((tx) => {
        const lc = searchTerm.toLowerCase();
        return (
          tx.name.toLowerCase().includes(lc) ||
          tx.id.toLowerCase().includes(lc) ||
          (tx.description && tx.description.toLowerCase().includes(lc)) ||
          (tx.account && tx.account.toLowerCase().includes(lc))
        );
      });
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter((tx) => tx.status === statusFilter);
    }

    // Account filter
    if (accountFilter !== "all") {
      result = result.filter((tx) => tx.account === accountFilter);
    }

    // Sorting
    result.sort((a, b) => {
      if (sortKey === "amount") {
        return sortDirection === "asc"
          ? a.amount - b.amount
          : b.amount - a.amount;
      } else if (sortKey === "name") {
        return sortDirection === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortKey === "date") {
        const aTime = new Date(`${a.date}T${a.time ?? "00:00:00"}`).getTime();
        const bTime = new Date(`${b.date}T${b.time ?? "00:00:00"}`).getTime();
        return sortDirection === "asc" ? aTime - bTime : bTime - aTime;
      } else if (sortKey === "account" && a.account && b.account) {
        return sortDirection === "asc"
          ? a.account.localeCompare(b.account)
          : b.account.localeCompare(a.account);
      } else if (sortKey === "category" && a.category && b.category) {
        return sortDirection === "asc"
          ? a.category.localeCompare(b.category)
          : b.category.localeCompare(a.category);
      }
      return 0;
    });

    setFilteredTransactions(result);
    setCurrentPage(1); // reset to first on filter change
  }, [
    transactions,
    searchTerm,
    sortKey,
    sortDirection,
    statusFilter,
    accountFilter,
  ]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mt-6">
      {showTitle && <h2 className="text-lg font-semibold mb-4">{title}</h2>}

      {/* ── Search & Filter Bar ── */}
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
            <ChevronDownIcon
              className={`h-4 w-4 ml-1 transition-transform ${
                filterOpen ? "rotate-180" : ""
              }`}
            />
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

      {/* ── Filter Panel ── */}
      {filterOpen && (
        <div className="mb-4 p-3 border border-gray-200 rounded-md bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
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

            {accounts.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account
                </label>
                <select
                  className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm"
                  value={accountFilter}
                  onChange={(e) => setAccountFilter(e.target.value)}
                >
                  <option value="all">All Accounts</option>
                  {accounts.map((acct) => (
                    <option key={acct} value={acct}>
                      {acct}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="mt-3 flex justify-end">
            <button
              className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md mr-2 hover:bg-gray-50"
              onClick={() => {
                setStatusFilter("all");
                setAccountFilter("all");
                setSearchTerm("");
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

      {/* ── Table Body ── */}
      <div className="overflow-auto" style={{ maxHeight }}>
        <table className="w-full">
          <thead className="bg-gray-50 text-xs uppercase text-gray-700 sticky top-0 z-10">
            <tr>
              {headers.map((header) => (
                <th key={header.key} className="px-4 py-2 text-left">
                  <button
                    className="flex items-center font-semibold"
                    onClick={() => handleSort(header.key)}
                  >
                    {header.label}
                    {sortKey === header.key && (
                      <span className="ml-1">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedTransactions.length > 0 ? (
              paginatedTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50">
                  {headers.map((header) => {
                    switch (header.key) {
                      case "name":
                        return (
                          <td key={header.key} className="px-4 py-3">
                            <div className="flex items-center">
                              {renderNameWithIcon && tx.icon && (
                                <div className="flex-shrink-0 flex items-center justify-center bg-[#4FB7EF73] rounded-full p-2 mr-3">
                                  {tx.icon}
                                </div>
                              )}
                              <div>
                                <p className="font-medium">{tx.name}</p>
                                {tx.description && tx.description !== tx.name && (
                                  <p className="text-xs text-gray-500">{tx.description}</p>
                                )}
                              </div>
                            </div>
                          </td>
                        );

                      case "account":
                        return (
                          <td key={header.key} className="px-4 py-3">
                            {tx.account || "—"}
                          </td>
                        );

                      case "date":
                        return (
                          <td key={header.key} className="px-4 py-3">
                            <div>
                              <div className="text-sm">{tx.date}</div>
                              {tx.time && (
                                <div className="text-xs text-gray-500">
                                  {tx.time}
                                </div>
                              )}
                            </div>
                          </td>
                        );

                      case "amount":
                        return (
                          <td key={header.key} className="px-4 py-3">
                            <span
                              className={`font-semibold ${
                                tx.amount >= 0
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {tx.amount >= 0 ? "+" : ""}
                              {tx.amount.toLocaleString("en-US", {
                                style: "currency",
                                currency: "USD",
                              })}
                            </span>
                          </td>
                        );

                      case "category":
                        if (!hideCategory) {
                          return (
                            <td key={header.key} className="px-4 py-3">
                              <span className="text-sm">
                                {tx.category || "—"}
                              </span>
                            </td>
                          );
                        }
                        break;

                      case "status":
                        return (
                          <td key={header.key} className="px-4 py-3">
                            <span
                              className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(
                                tx.status
                              )}`}
                            >
                              {tx.status.charAt(0).toUpperCase() +
                                tx.status.slice(1)}
                            </span>
                          </td>
                        );

                      default:
                        return (
                          <td key={header.key} className="px-4 py-3">
                            —{" "}
                          </td>
                        );
                    }
                  })}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={headers.length}
                  className="px-4 py-6 text-center text-gray-500"
                >
                  No transactions found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination Controls ── */}
      <div className="mt-4 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Showing{" "}
          {filteredTransactions.length > 0 ? startIndex + 1 : 0} to{" "}
          {Math.min(startIndex + pageSize, filteredTransactions.length)} of{" "}
          {filteredTransactions.length} transactions
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
            // show all pages if ≤ 5
            [...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                className={`px-3 py-1 border border-gray-300 rounded-md ${
                  i + 1 === currentPage
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))
          ) : (
            // show with ellipses
            <>
              <button
                className={`px-3 py-1 border border-gray-300 rounded-md ${
                  currentPage === 1 ? "bg-blue-500 text-white" : "hover:bg-gray-50"
                }`}
                onClick={() => setCurrentPage(1)}
              >
                1
              </button>

              {currentPage > 3 && <span className="px-2 py-1">...</span>}

              {currentPage !== 1 && currentPage !== totalPages && (
                <button className="px-3 py-1 border border-gray-300 rounded-md bg-blue-500 text-white">
                  {currentPage}
                </button>
              )}

              {currentPage < totalPages - 2 && <span className="px-2 py-1">...</span>}

              <button
                className={`px-3 py-1 border border-gray-300 rounded-md ${
                  currentPage === totalPages
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-50"
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