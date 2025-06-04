import { useState } from "react";
import { AuthLayout } from "@/components/Layout/layout";
import {
    CardElement,
    useElements,
    useStripe,
} from "@stripe/react-stripe-js";
import UseFinanceHook from "@/hooks/UseFinance";

export default function TopUpForm() {
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
          return;
        }
    
        // Convert dollars to cents (e.g. $5.00 → 500)
        const amountInCents = Math.round(val * 100);
    
        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
          setErrorMsg("Card details not available.");
          return;
        }
    
        setLoading(true);
        try {
          // Pass the same `stripe` instance and the CardElement to topUp:
          await topUp(stripe, cardElement, amountInCents);
          setSuccessMsg(`Successfully topped up $${val.toFixed(2)}!`);
        } catch (err: any) {
          setErrorMsg(err.message || "Top-up failed.");
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
                    />

                    <label className="block mb-1">Card Details</label>
                    <div className="border px-2 py-2 rounded mb-4">
                        <CardElement options={{ hidePostalCode: true }} />
                    </div>

                    {errorMsg && (
                        <p className="text-red-600 text-sm mb-2">{errorMsg}</p>
                    )}
                    {successMsg && (
                        <p className="text-green-600 text-sm mb-2">{successMsg}</p>
                    )}

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
