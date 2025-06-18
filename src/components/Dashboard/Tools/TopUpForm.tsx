import { useState } from "react";
import { AuthLayout } from "@/components/Layout/layout";
import {
    CardElement,
    useElements,
    useStripe,
} from "@stripe/react-stripe-js";
import UseFinanceHook from "@/hooks/UseFinance";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
    CreditCardIcon,
    ArrowLeftIcon,
    ShieldCheckIcon,
    CurrencyDollarIcon,
    ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

interface TransactionDetails {
    amount: number;
    transactionId: string;
    date: string;
    time: string;
    paymentMethod: string;
    status: string;
}

export default function TopUpForm() {
    const navigate = useNavigate();
    const stripe = useStripe();
    const elements = useElements();
    const { topUp } = UseFinanceHook();

    const [rawAmount, setRawAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const [cardError, setCardError] = useState("");

    // Predefined amounts for quick selection
    const quickAmounts = [10, 25, 50, 100, 250, 500];

    const generateTransactionId = () => {
        return 'TXN' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        if (!stripe || !elements) {
            toast.error("Payment system not ready. Please try again.");
            return;
        }
    
        const val = Number(rawAmount);
        if (isNaN(val) || val <= 0) {
            toast.error("Please enter a valid positive amount.");
            return;
        }

        if (val < 1) {
            toast.error("Minimum top-up amount is $1.00");
            return;
        }

        if (val > 10000) {
            toast.error("Maximum top-up amount is $10,000.00");
            return;
        }
    
        const amountInDollar = Math.round(val * 100) / 100; // Ensure 2 decimal places
    
        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
            toast.error("Card details not available.");
            return;
        }

        if (cardError) {
            toast.error("Please fix card details before proceeding.");
            return;
        }
    
        setLoading(true);
        
        try {
            await topUp(stripe, cardElement, amountInDollar);
            
            // Generate transaction details
            const now = new Date();
            const transactionDetails: TransactionDetails = {
                amount: amountInDollar,
                transactionId: generateTransactionId(),
                date: now.toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                }),
                time: now.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: true 
                }),
                paymentMethod: "Credit/Debit Card ending in ****",
                status: "Completed Successfully"
            };

            // Navigate to receipt page with transaction details
            navigate('/receipt', { 
                state: { transactionDetails },
                replace: true 
            });
            
        } catch (err: any) {
            console.error('Top-up error:', err);
            toast.error(err.message || "Top-up failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleQuickAmountSelect = (amount: number) => {
        setRawAmount(amount.toString());
    };

    const handleCardChange = (event: any) => {
        if (event.error) {
            setCardError(event.error.message);
        } else {
            setCardError("");
        }
    };

    const formatAmount = (value: string) => {
        const num = parseFloat(value);
        return isNaN(num) ? "0.00" : num.toFixed(2);
    };

    return (
        <AuthLayout>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
                <div className="max-w-2xl mx-auto px-4">
                    {/* Header */}
                    <div className="mb-8">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="flex items-center text-indigo-600 hover:text-indigo-700 mb-4 transition-colors"
                        >
                            <ArrowLeftIcon className="w-5 h-5 mr-2" />
                            Back to Dashboard
                        </button>
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
                                <CurrencyDollarIcon className="w-8 h-8 text-indigo-600" />
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Top-Up Your Account</h1>
                            <p className="text-gray-600">Add funds to your account securely and instantly</p>
                        </div>
                    </div>

                    {/* Main Form Card */}
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                        <div className="p-8">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Amount Section */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        <CurrencyDollarIcon className="w-5 h-5 inline mr-2" />
                                        Amount (USD)
                                    </label>
                                    
                                    {/* Quick Amount Buttons */}
                                    <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-4">
                                        {quickAmounts.map((amount) => (
                                            <button
                                                key={amount}
                                                type="button"
                                                onClick={() => handleQuickAmountSelect(amount)}
                                                className={`px-3 py-2 text-sm font-medium rounded-lg border transition-all ${
                                                    Number(rawAmount) === amount
                                                        ? 'bg-indigo-600 text-white border-indigo-600'
                                                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                                                }`}
                                                disabled={loading}
                                            >
                                                ${amount}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Custom Amount Input */}
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                            <span className="text-gray-500 font-medium">$</span>
                                        </div>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="1"
                                            max="10000"
                                            value={rawAmount}
                                            onChange={(e) => setRawAmount(e.target.value)}
                                            placeholder="Enter custom amount"
                                            className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-lg font-medium"
                                            disabled={loading}
                                        />
                                    </div>
                                    
                                    {/* Amount Preview */}
                                    {rawAmount && Number(rawAmount) > 0 && (
                                        <div className="mt-3 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                                            <p className="text-indigo-800 font-medium">
                                                You will be charged: <span className="text-lg">${formatAmount(rawAmount)}</span>
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Card Details Section */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        <CreditCardIcon className="w-5 h-5 inline mr-2" />
                                        Card Details
                                    </label>
                                    <div className="border-2 border-gray-200 rounded-lg p-4 focus-within:border-indigo-500 transition-colors">
                                        <CardElement 
                                            options={{ 
                                                hidePostalCode: true,
                                                style: {
                                                    base: {
                                                        fontSize: '16px',
                                                        color: '#374151',
                                                        fontFamily: '"Inter", sans-serif',
                                                        '::placeholder': {
                                                            color: '#9CA3AF',
                                                        },
                                                    },
                                                },
                                            }}
                                            onChange={handleCardChange}
                                        />
                                    </div>
                                    {cardError && (
                                        <div className="mt-2 flex items-center text-red-600 text-sm">
                                            <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                                            {cardError}
                                        </div>
                                    )}
                                </div>

                                {/* Security Notice */}
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <div className="flex items-start">
                                        <ShieldCheckIcon className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                                        <div>
                                            <h4 className="text-sm font-semibold text-green-800 mb-1">Secure Payment</h4>
                                            <p className="text-sm text-green-700">
                                                Your payment information is encrypted and processed securely. 
                                                We never store your card details.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading || !stripe || !rawAmount || Number(rawAmount) <= 0 || !!cardError}
                                    className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-4 rounded-lg font-semibold text-lg hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                                >
                                    {loading ? (
                                        <div className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                            Processing Payment...
                                        </div>
                                    ) : (
                                        `Pay $${formatAmount(rawAmount || "0")}`
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* Footer */}
                        <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
                            <div className="flex items-center justify-center text-sm text-gray-600">
                                <ShieldCheckIcon className="w-4 h-4 mr-1" />
                                Powered by Stripe • SSL Encrypted • PCI Compliant
                            </div>
                        </div>
                    </div>

                    {/* Additional Info */}
                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-500">
                            Funds will be available in your account immediately after successful payment.
                        </p>
                    </div>
                </div>
            </div>
        </AuthLayout>
    );
}