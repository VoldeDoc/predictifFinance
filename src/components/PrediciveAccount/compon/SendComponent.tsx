import CreditCardBtn from "@/components/Dashboard/Tools/CreditCardBtn";
import { PiUmbrellaLight } from "react-icons/pi";
import { LiaSatelliteDishSolid } from "react-icons/lia";
import { PiGraduationCapThin } from "react-icons/pi";
import ContactList, { Contact } from "./contactComponent";

export const SendComponent = () => {
  // Sample contact data
  const contacts: Contact[] = [
    { id: 1, name: 'Alex Johnson', email: 'alex@example.com', imageUrl: 'https://randomuser.me/api/portraits/men/32.jpg', category: 'frequent' },
    { id: 2, name: 'Sarah Williams', email: 'sarah@example.com', imageUrl: 'https://randomuser.me/api/portraits/women/44.jpg', category: 'frequent' },
    { id: 3, name: 'Michael Brown', email: 'michael@example.com', imageUrl: 'https://randomuser.me/api/portraits/men/22.jpg', category: 'recent' },
    { id: 4, name: 'Emily Davis', email: 'emily@example.com', imageUrl: 'https://randomuser.me/api/portraits/women/67.jpg', category: 'all' },
    { id: 5, name: 'James Wilson', email: 'james@example.com', imageUrl: 'https://randomuser.me/api/portraits/men/91.jpg', category: 'all' },
    { id: 6, name: 'Jessica Taylor', email: 'jessica@example.com', imageUrl: 'https://randomuser.me/api/portraits/women/29.jpg', category: 'recent' },
  ];

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
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6 ">
            <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-6">Recent Payments</h2>

            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 '>
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
              <div className='flex items-center px-4 bg-white rounded-lg shadow-sm border border-gray-100 dark:border-gray-700'>
                <div className='flex-shrink-0 flex items-center justify-center bg-[#4FB7EF73] dark:bg-gray-700 rounded-full px-3 mr-4'>
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
          </div>

          <div className="bg-white p-3 my-5 shadow-lg rounded-lg">
            <h1 className="text-base text-gray-800 ">Make a payment</h1>
            <div className="bg-blue-200 p-4 rounded-lg shadow-md">
              <h1 className="text-sm text-gray-800 py-3">Payment account</h1>
              <div className="bg-white rounded-lg p-4">
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  <div className="bg-blue-200 p-4 rounded-lg shadow-md">
                    <div className="flex space-x-3">
                      <div className="">
                        <img src="/assets/images/dashboard/dashboard/Card.png" alt="" className="" />
                      </div>
                      <div>
                        <h6 className="text-xs font-normal">Freedom Unlimited Mastercard</h6>
                        <h5 className="text-sm">
                          $539,000.00
                        </h5>
                        <h6 className="text-xs font-light">5582 5574 8376 5487</h6>
                      </div>
                    </div>

                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-md border-gray-400">
                    <div className="flex space-x-3">
                      <div className="">
                        <img src="assets/images/dashboard/dashboard/Card (1).png" alt="" className="" />
                      </div>
                      <div>
                        <h6 className="text-xs font-normal">Platinum Plus Visa</h6>
                        <h5 className="text-sm">
                          $539,000.00
                        </h5>
                        <h6 className="text-xs font-light">5582 5574 8376 5487</h6>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <h1 className="text-sm text-gray-500 py-3">Service Provider</h1>
              <form action="">
                <div className="relative">
                  <label htmlFor="serviceProvider" className="block text-sm font-medium text-gray-700 mb-2">
                    Select a service provider
                  </label>
                  <select 
                    id="serviceProvider" 
                    name="serviceProvider" 
                    className="block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    defaultValue=""
                  >
                    <option value="" disabled>Choose a service provider</option>
                    <option value="geico" className="py-2">
                      Geico Insurance - Account #128477582
                    </option>
                    <option value="dish" className="py-2">
                      Dish Network - Account #88002134
                    </option>
                  </select>

                  <div className="mt-4">
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                    Virtual Account
                    </label>
                    <input 
                      type="number" 
                      id="amount" 
                      name="amount" 
                      className="block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="mt-4">
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                      Payment amount
                    </label>
                    <input 
                      type="number" 
                      id="amount" 
                      name="amount" 
                      placeholder="Enter amount" 
                      className="block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="mt-4 space-x-4">
                    <button 
                      type="reset" 
                      className=" bg-blue-300 hover:bg-blue-800  text-gray-800 font-medium py-3 px-4 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className=" bg-blue-800 hover:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg text-sm"
                    >
                      Proceed to payment
                    </button>
                  </div>
                </div>
              </form>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default SendComponent;