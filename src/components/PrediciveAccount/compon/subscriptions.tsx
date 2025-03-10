import React, { useState } from "react";
import { PlusIcon } from "@heroicons/react/24/solid";
import { MdArrowOutward } from "react-icons/md";

// Define subscription type
interface Subscription {
  id: string;
  cardNumber: string;
  expireDate: string;
  cvv: string;
  account: string;
  billingCycle: string;
  nextBilling: string;
}

export default function SubscriptionCards() {
  // Sample subscription data
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([
    {
      id: "1",
      cardNumber: "9238 9348 3487 0981",
      expireDate: "5th March, 2025",
      cvv: "***",
      account: "Disney Plus",
      billingCycle: "Monthly",
      nextBilling: "April 15, 2025"
    },
    {
      id: "2",
      cardNumber: "4587 3219 6542 1078",
      expireDate: "12th June, 2026",
      cvv: "***",
      account: "Spotify Premium",
      billingCycle: "Monthly",
      nextBilling: "April 3, 2025"
    }
  ]);

  // State for modal visibility
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Form state for adding subscriptions
  const [formData, setFormData] = useState<Partial<Subscription>>({
    cardNumber: "",
    expireDate: "",
    cvv: "",
    account: "",
    billingCycle: "Monthly",
    nextBilling: ""
  });

  // Handle input change in the form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle add subscription
  const handleSaveSubscription = () => {
    // Add new subscription
    const newSub = {
      ...formData,
      id: Math.random().toString(36).substring(2, 9)
    } as Subscription;
    
    setSubscriptions([...subscriptions, newSub]);
    
    // Reset states
    setShowAddModal(false);
    setFormData({
      cardNumber: "",
      expireDate: "",
      cvv: "",
      account: "",
      billingCycle: "Monthly",
      nextBilling: ""
    });
  };

  // Show add subscription modal
  const handleAddSubscription = () => {
    setShowAddModal(true);
  };

  return (
    <>
      <div className="border border-gray-200 bg-white p-4 rounded-xl">
        <div className="flex justify-between pb-5">
          <div>
            <h1 className="text-gray-800 font-semibold text-base">My Subscriptions</h1>
            <p className="text-gray-500 text-xs mt-1">Manage your recurring payments</p>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={handleAddSubscription}
              className="p-2 rounded-xl text-black hover:bg-gray-100 flex items-center justify-center border border-[#D0D5DD]"
              aria-label="Add subscription"
            >
              <PlusIcon className="h-5 w-5 text-black" />
            </button>
            <button className="py-2 px-4 rounded-xl text-black hover:bg-gray-100 flex items-center border border-[#D0D5DD]">
              <span>See All</span>
              <MdArrowOutward className="h-5 w-5 text-black ml-1" />
            </button>
          </div>
        </div>

        <div className="border-t border-gray-200 -mx-4"></div>
        
        {subscriptions.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-gray-500">No subscriptions found. Add one to get started.</p>
          </div>
        ) : (
          <>
            {subscriptions.map((subscription, index) => (
              <div key={subscription.id} className={`${index > 0 ? 'border-t border-gray-100' : ''}`}>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2 py-4">
                  <div className="md:relative md:pr-4">
                    <h1 className="text-gray-500 text-xs font-medium">Card Number</h1>
                    <h1 className="text-gray-800 text-sm mt-1">{subscription.cardNumber}</h1>
                    <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 h-4/5 border-r border-gray-200"></div>
                  </div>
                  <div className="md:relative md:pr-4">
                    <h1 className="text-gray-500 text-xs font-medium">Expire Date</h1>
                    <h1 className="text-gray-800 text-sm mt-1">{subscription.expireDate}</h1>
                    <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 h-4/5 border-r border-gray-200"></div>
                  </div>
                  <div className="md:relative md:pr-4">
                    <h1 className="text-gray-500 text-xs font-medium">CVV</h1>
                    <h1 className="text-gray-800 text-sm mt-1">{subscription.cvv}</h1>
                    <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 h-4/5 border-r border-gray-200"></div>
                  </div>
                  <div>
                    <h1 className="text-gray-500 text-xs font-medium">Account</h1>
                    <h1 className="text-gray-800 text-sm mt-1">{subscription.account}</h1>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Add Subscription Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add Subscription</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleSaveSubscription(); }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Account/Service</label>
                  <input
                    type="text"
                    name="account"
                    value={formData.account || ''}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                    placeholder="e.g. Netflix, Spotify"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Card Number</label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber || ''}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                    placeholder="XXXX XXXX XXXX XXXX"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                    <input
                      type="text"
                      name="expireDate"
                      value={formData.expireDate || ''}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                      placeholder="MM/YY"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">CVV</label>
                    <input
                      type="password"
                      name="cvv"
                      value={formData.cvv || ''}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                      placeholder="***"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Billing Cycle</label>
                    <select
                      name="billingCycle"
                      value={formData.billingCycle || 'Monthly'}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                      required
                    >
                      <option value="Weekly">Weekly</option>
                      <option value="Monthly">Monthly</option>
                      <option value="Quarterly">Quarterly</option>
                      <option value="Yearly">Yearly</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Next Billing Date</label>
                    <input
                      type="text"
                      name="nextBilling"
                      value={formData.nextBilling || ''}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                      placeholder="e.g. April 15, 2025"
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 rounded-lg text-sm text-white hover:bg-blue-700"
                >
                  Add Subscription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}