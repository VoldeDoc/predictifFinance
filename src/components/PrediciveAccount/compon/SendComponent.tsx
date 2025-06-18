import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import CreditCardBtn from "@/components/Dashboard/Tools/CreditCardBtn";
import { BanknotesIcon, PlusIcon } from "@heroicons/react/24/outline";
import ContactList, { Contact } from "./contactComponent";
import UseFinanceHook from "@/hooks/UseFinance";

export interface SavingValues {
  label: string;
  target_amount: number;
  description: string;
}

// Validation schema
const savingsSchema = yup.object({
  label: yup
    .string()
    .required("Savings label is required")
    .min(2, "Label must be at least 2 characters")
    .max(50, "Label cannot exceed 50 characters"),
  target_amount: yup
    .number()
    .required("Target amount is required")
    .positive("Target amount must be positive")
    .min(1, "Minimum target amount is $1")
    .max(1000000, "Maximum target amount is $1,000,000"),
  description: yup
    .string()
    .required("Description is required")
    .min(5, "Description must be at least 5 characters")
    .max(200, "Description cannot exceed 200 characters"),
});

export const SendComponent = () => {
  const { createSavings } = UseFinanceHook();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<SavingValues>({
    resolver: yupResolver(savingsSchema),
    defaultValues: {
      label: "",
      target_amount: 0,
      description: "",
    },
  });

  // Watch target_amount for live formatting
  const targetAmount = watch("target_amount");

  // Sample contact data
  const contacts: Contact[] = [
    { id: 1, name: 'Alex Johnson', email: 'alex@example.com', imageUrl: 'https://randomuser.me/api/portraits/men/32.jpg', category: 'frequent' },
    { id: 2, name: 'Sarah Williams', email: 'sarah@example.com', imageUrl: 'https://randomuser.me/api/portraits/women/44.jpg', category: 'frequent' },
    { id: 3, name: 'Michael Brown', email: 'michael@example.com', imageUrl: 'https://randomuser.me/api/portraits/men/22.jpg', category: 'recent' },
    { id: 4, name: 'Emily Davis', email: 'emily@example.com', imageUrl: 'https://randomuser.me/api/portraits/women/67.jpg', category: 'all' },
    { id: 5, name: 'James Wilson', email: 'james@example.com', imageUrl: 'https://randomuser.me/api/portraits/men/91.jpg', category: 'all' },
    { id: 6, name: 'Jessica Taylor', email: 'jessica@example.com', imageUrl: 'https://randomuser.me/api/portraits/women/29.jpg', category: 'recent' },
  ];

  // Quick amount suggestions for savings goals
  const quickAmounts = [500, 1000, 2500, 5000, 10000, 25000];

  const onSubmit = async (data: SavingValues) => {
    setLoading(true);
    try {
      await createSavings(data);
      toast.success("Savings goal created successfully!");
      reset(); // Reset form after successful submission
    } catch (error: any) {
      console.error("Error creating savings:", error);
      toast.error(error.message || "Failed to create savings goal. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAmountSelect = (amount: number) => {
    // Using setValue to update the form field
    const event = { target: { value: amount.toString() } };
    register("target_amount").onChange(event);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Send Money</h1>

      <div className="mt-6 flex flex-wrap">
        {/* Left section (40% width) with CardBtn and contacts */}
        <div className="w-full lg:w-2/5 pr-0 lg:pr-6 mb-6 lg:mb-0">
          {/* Credit Card Button */}
          <div className="mb-6">
            <CreditCardBtn bgClassName="bg-[#4FB7EF73]" iconColor="#002072" />
          </div>

          {/* Contacts list */}
          <ContactList contacts={contacts} />
        </div>

        <div className="w-full lg:w-3/5">
          {/* <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-6">Recent Payments</h2>

            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <div className='flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-100 dark:border-gray-700'>
                <div className='flex-shrink-0 flex items-center justify-center bg-[#4FB7EF73] dark:bg-gray-700 rounded-full p-3 mr-4'>
                  <PiUmbrellaLight className='h-5 w-5 text-gray-500 dark:text-gray-400' />
                </div>
                <div className='flex-grow'>
                  <h1 className='text-sm font-medium text-gray-800 dark:text-gray-200'>Geico Insurance</h1>
                  <h5 className='text-xs text-gray-500 dark:text-gray-400'>128477582</h5>
                </div>
                <div className='flex-shrink-0 text-right'>
                  <h1 className='text-sm font-medium text-gray-800 dark:text-gray-200'>$450</h1>
                  <h5 className='text-xs text-blue-800'>Successful</h5>
                </div>
              </div>
              <div className='flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-100 dark:border-gray-700'>
                <div className='flex-shrink-0 flex items-center justify-center bg-[#4FB7EF73] dark:bg-gray-700 rounded-full p-3 mr-4'>
                  <LiaSatelliteDishSolid className='h-5 w-5 text-gray-500 dark:text-gray-400' />
                </div>
                <div className='flex-grow'>
                  <h1 className='text-sm font-medium text-gray-800 dark:text-gray-200'>Dish Network</h1>
                  <h5 className='text-xs text-gray-500 dark:text-gray-400'>88002134</h5>
                </div>
                <div className='flex-shrink-0 text-right'>
                  <h1 className='text-sm font-medium text-gray-800 dark:text-gray-200'>$450</h1>
                  <h5 className='text-xs text-blue-800'>Successful</h5>
                </div>
              </div>
              <div className='flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-100 dark:border-gray-700'>
                <div className='flex-shrink-0 flex items-center justify-center bg-[#4FB7EF73] dark:bg-gray-700 rounded-full p-3 mr-4'>
                  <PiGraduationCapThin className='h-5 w-5 text-gray-500 dark:text-gray-400' />
                </div>
                <div className='flex-grow'>
                  <h1 className='text-sm font-medium text-gray-800 dark:text-gray-200'>Coursera</h1>
                  <h5 className='text-xs text-gray-500 dark:text-gray-400'>128477582</h5>
                </div>
                <div className='flex-shrink-0 text-right'>
                  <h1 className='text-sm font-medium text-gray-800 dark:text-gray-200'>$450</h1>
                  <h5 className='text-xs text-blue-800'>Successful</h5>
                </div>
              </div>
            </div>
          </div> */}

          {/* Create Savings Goal Form */}
          <div className="bg-white p-6 my-5 shadow-lg rounded-lg border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full mr-3">
                <BanknotesIcon className="w-5 h-5 text-green-600" />
              </div>
              <h1 className="text-lg font-semibold text-gray-800">Create Savings Goal</h1>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Savings Goal Label */}
              <div>
                <label htmlFor="label" className="block text-sm font-medium text-gray-700 mb-2">
                  Savings Goal Name *
                </label>
                <input
                  type="text"
                  id="label"
                  {...register("label")}
                  placeholder="e.g., Emergency Fund, Vacation, New Car"
                  className={`block w-full px-4 py-3 bg-white border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    errors.label 
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  disabled={loading}
                />
                {errors.label && (
                  <p className="mt-1 text-sm text-red-600">{errors.label.message}</p>
                )}
              </div>

              {/* Target Amount */}
              <div>
                <label htmlFor="target_amount" className="block text-sm font-medium text-gray-700 mb-2">
                  Target Amount *
                </label>
                
                {/* Quick Amount Buttons */}
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-3">
                  {quickAmounts.map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => handleQuickAmountSelect(amount)}
                      className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all ${
                        Number(targetAmount) === amount
                          ? 'bg-green-600 text-white border-green-600'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                      disabled={loading}
                    >
                      ${amount.toLocaleString()}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <span className="text-gray-500 font-medium">$</span>
                  </div>
                  <input
                    type="number"
                    id="target_amount"
                    step="0.01"
                    min="1"
                    {...register("target_amount", { valueAsNumber: true })}
                    placeholder="0.00"
                    className={`block w-full pl-8 pr-4 py-3 bg-white border rounded-lg focus:outline-none focus:ring-2 transition-colors text-lg font-medium ${
                      errors.target_amount 
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                    disabled={loading}
                  />
                </div>
                
                {/* Amount Preview */}
                {targetAmount > 0 && (
                  <div className="mt-2 p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-green-800 font-medium text-sm">
                      Target: {formatCurrency(targetAmount)}
                    </p>
                  </div>
                )}
                
                {errors.target_amount && (
                  <p className="mt-1 text-sm text-red-600">{errors.target_amount.message}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  id="description"
                  rows={4}
                  {...register("description")}
                  placeholder="Describe your savings goal and why it's important to you..."
                  className={`block w-full px-4 py-3 bg-white border rounded-lg focus:outline-none focus:ring-2 transition-colors resize-none ${
                    errors.description 
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  disabled={loading}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
               
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating Goal...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <PlusIcon className="w-4 h-4 mr-2" />
                      Create Savings Goal
                    </div>
                  )}
                </button>
              </div>
            </form>

          
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendComponent;