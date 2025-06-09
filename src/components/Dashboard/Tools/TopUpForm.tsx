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

export default function TopUpForm() {
    const navigate = useNavigate();
    const stripe = useStripe();
    const elements = useElements();
    const { topUp } = UseFinanceHook();

    const [rawAmount, setRawAmount] = useState("0");
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg(null);
        setSuccessMsg(null);
    
        if (!stripe || !elements) {
          setErrorMsg("Stripe.js not yet loaded");
          return;
        }
    
        const val = Number(rawAmount);
        if (isNaN(val) || val <= 0) {
          setErrorMsg("Please enter a positive amount.");
          toast.error("Please enter a positive amount.")
          return;
        }
    
        const amountInDollar = Math.round(val);
    
        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
          setErrorMsg("Card details not available.");
          toast.error("Card details not available.")
          return;
        }
    
        setLoading(true);
        try {
          await topUp(stripe, cardElement, amountInDollar);
          setSuccessMsg(`Successfully topped up $${val.toFixed(2)}!`);
          toast.success(`Successfully topped up $${val.toFixed(2)}!`)
          navigate('/dashboard')
          
        } catch (err: any) {
          setErrorMsg(err.message || "Top-up failed.");
          toast.error(err.message || "Top-up failed.")
        } finally {
          setLoading(false);
        }
      };

    return (
        <AuthLayout>
            <>
                <form
                    onSubmit={handleSubmit}
                    className="max-w-md ml-10 bg-white p-6 rounded-lg shadow"
                >
                    <h2 className="text-xl font-semibold mb-4">Top-Up Your Account</h2>

                    <label className="block mb-1">Amount (USD)</label>
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={rawAmount}
                        onChange={(e) => setRawAmount(e.target.value)}
                        className="w-full border px-3 py-2 rounded mb-4"
                        disabled={loading}
                    />

                    <label className="block mb-1">Card Details</label>
                    <div className="border px-2 py-2 rounded mb-4">
                        <CardElement options={{ hidePostalCode: true }} />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !stripe}
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? "Processing…" : "Pay"}
                    </button>
                </form>
            </>
        </AuthLayout>
    );
}
