import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthLayout } from '@/components/Layout/layout';
import { toast } from 'react-toastify';
import {
    CheckCircleIcon,
    ArrowDownTrayIcon,
    ArrowRightIcon,
    DocumentTextIcon,
    CalendarIcon,
    ClockIcon,
    ShieldCheckIcon,
    HomeIcon,
    PrinterIcon,
} from '@heroicons/react/24/outline';
import html2canvas from 'html2canvas';
import { logo } from '../../../../public';

interface TransactionDetails {
    amount: number;
    transactionId: string;
    date: string;
    time: string;
    paymentMethod: string;
    status: string;
    customerName?: string;
    customerEmail?: string;
}

export default function ReceiptPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [downloading, setDownloading] = useState(false);
    const [printing, setPrinting] = useState(false);

    // Get transaction details from navigation state
    const transactionDetails: TransactionDetails = location.state?.transactionDetails || {
        amount: 0,
        transactionId: 'N/A',
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        paymentMethod: 'Credit/Debit Card',
        status: 'Completed Successfully'
    };

    useEffect(() => {
        // If no transaction details, redirect to dashboard
        if (!location.state?.transactionDetails) {
            toast.warning('No transaction details found. Redirecting to dashboard.');
            navigate('/dashboard');
        }
    }, [location.state, navigate]);

    const downloadReceipt = async () => {
        setDownloading(true);
        try {
            const receiptElement = document.getElementById('receipt-content');
            if (!receiptElement) {
                throw new Error('Receipt element not found');
            }

            const canvas = await html2canvas(receiptElement, {
                backgroundColor: '#ffffff',
                scale: 2,
                logging: false,
                useCORS: true,
                width: receiptElement.scrollWidth,
                height: receiptElement.scrollHeight,
            });

            const link = document.createElement('a');
            link.download = `receipt-${transactionDetails.transactionId}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
            
            toast.success('Receipt downloaded successfully!');
        } catch (error) {
            console.error('Error downloading receipt:', error);
            toast.error('Failed to download receipt. Please try again.');
        } finally {
            setDownloading(false);
        }
    };

    const printReceipt = () => {
        setPrinting(true);
        try {
            const receiptContent = document.getElementById('receipt-content')?.innerHTML;
            const printWindow = window.open('', '_blank');
            
            if (printWindow && receiptContent) {
                printWindow.document.write(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>Receipt - ${transactionDetails.transactionId}</title>
                        <style>
                            body { 
                                font-family: Arial, sans-serif; 
                                margin: 0; 
                                padding: 20px; 
                                background: white;
                            }
                            .no-print { display: none !important; }
                            @media print {
                                body { margin: 0; }
                                .no-print { display: none !important; }
                            }
                        </style>
                    </head>
                    <body>
                        ${receiptContent}
                    </body>
                    </html>
                `);
                printWindow.document.close();
                printWindow.print();
            }
            
            toast.success('Receipt sent to printer!');
        } catch (error) {
            console.error('Error printing receipt:', error);
            toast.error('Failed to print receipt. Please try again.');
        } finally {
            setPrinting(false);
        }
    };

    const navigateToDashboard = () => {
        navigate('/dashboard');
    };

    return (
        <AuthLayout>
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8">
                <div className="max-w-2xl mx-auto px-4">
                    {/* Success Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                            <CheckCircleIcon className="w-12 h-12 text-green-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
                        <p className="text-gray-600">Your account has been topped up successfully</p>
                    </div>

                    {/* Receipt Card */}
                    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-8">
                        {/* Receipt Content */}
                        <div id="receipt-content" className="p-8">
                            {/* Company Header */}
                            <div className="text-center mb-8 border-b border-gray-200 pb-6">
                                <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-100 rounded-full mb-4">
                                    <img src={logo} alt="Predictif Finance Logo" className="w-16 h-16 object-contain" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-1">Predictif Finance</h2>
                                <p className="text-sm text-gray-600">Your Financial Partner</p>
                            </div>

                            {/* Transaction Status */}
                            <div className="flex items-center justify-center mb-8">
                                <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                    <CheckCircleIcon className="w-5 h-5 mr-2" />
                                    {transactionDetails.status}
                                </div>
                            </div>

                            {/* Amount Section */}
                            <div className="text-center mb-8">
                                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                                    <p className="text-sm text-gray-600 mb-2">Total Amount</p>
                                    <p className="text-4xl font-bold text-green-600">
                                        ${transactionDetails.amount.toFixed(2)}
                                    </p>
                                </div>
                            </div>

                            {/* Transaction Details */}
                            <div className="space-y-4 mb-8">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <DocumentTextIcon className="w-5 h-5 mr-2" />
                                    Transaction Details
                                </h3>
                                
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600 font-medium">Transaction ID</span>
                                            <span className="font-mono text-gray-900 font-semibold">
                                                {transactionDetails.transactionId}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <div className="flex items-center text-gray-600 mb-2">
                                                <CalendarIcon className="w-4 h-4 mr-2" />
                                                <span className="font-medium">Date</span>
                                            </div>
                                            <p className="text-gray-900 font-semibold">{transactionDetails.date}</p>
                                        </div>

                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <div className="flex items-center text-gray-600 mb-2">
                                                <ClockIcon className="w-4 h-4 mr-2" />
                                                <span className="font-medium">Time</span>
                                            </div>
                                            <p className="text-gray-900 font-semibold">{transactionDetails.time}</p>
                                        </div>
                                    </div>

                                   
                                </div>
                            </div>

                            {/* Summary */}
                            <div className="border-t border-gray-200 pt-6 mb-6">
                                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                    <h4 className="font-semibold text-blue-900 mb-2">What happens next?</h4>
                                    <ul className="text-sm text-blue-800 space-y-1">
                                        <li>• Funds are now available in your account</li>
                                        <li>• You can start using your balance immediately</li>
                                        <li>• This receipt serves as proof of payment</li>
                                        <li>• Keep this receipt for your records</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Security Footer */}
                            <div className="text-center pt-6 border-t border-gray-200">
                                <div className="flex items-center justify-center text-sm text-gray-500 mb-3">
                                    <ShieldCheckIcon className="w-4 h-4 mr-2" />
                                    This transaction is secured and encrypted
                                </div>
                                <div className="text-xs text-gray-400 space-y-1">
                                    <p>Powered by Stripe • SSL Encrypted • PCI Compliant</p>
                                    <p>Generated on {new Date().toLocaleString()}</p>
                                    <p>Customer Service: 1-800-FINANCE</p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="bg-gray-50 border-t border-gray-200 p-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <button
                                    onClick={downloadReceipt}
                                    disabled={downloading}
                                    className="flex items-center justify-center px-4 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {downloading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Downloading...
                                        </>
                                    ) : (
                                        <>
                                            <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
                                            Download
                                        </>
                                    )}
                                </button>

                                <button
                                    onClick={printReceipt}
                                    disabled={printing}
                                    className="flex items-center justify-center px-4 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {printing ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Printing...
                                        </>
                                    ) : (
                                        <>
                                            <PrinterIcon className="w-4 h-4 mr-2" />
                                            Print
                                        </>
                                    )}
                                </button>

                                <button
                                    onClick={navigateToDashboard}
                                    className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                                >
                                    <HomeIcon className="w-4 h-4 mr-2" />
                                    Dashboard
                                    <ArrowRightIcon className="w-4 h-4 ml-2" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Additional Info */}
                    <div className="text-center">
                        <p className="text-sm text-gray-600 mb-2">
                            Need help? Contact our support team at{' '}
                            <a href="mailto:support@predictiffinance.com" className="text-indigo-600 hover:text-indigo-700">
                                support@predictiffinance.com
                            </a>
                        </p>
                        <p className="text-xs text-gray-500">
                            Thank you for choosing Predictif Finance!
                        </p>
                    </div>
                </div>
            </div>
        </AuthLayout>
    );
}