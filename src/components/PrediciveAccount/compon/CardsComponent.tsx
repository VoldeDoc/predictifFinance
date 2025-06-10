import CreditCard from "@/components/Dashboard/Tools/CreditCard";
import CreditCardBtn from "@/components/Dashboard/Tools/CreditCardBtn";
import TransactionTable from "@/components/Dashboard/Tools/TransactionTable";
import SpendingLimit from "./SpendingLimit";

export const CardsComponent = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left side - Cards with blue background (30%) */}
        <div className="w-full lg:w-[30%] bg-blue-400 rounded-xl p-4">
          <h2 className="text-xl font-medium text-white mb-6">My Cards</h2>
          
          <div className="space-y-6 flex flex-col items-center">
            <CreditCard
              cardType="VISA"
              cardNumber="4321 8765 2309 6754"
              cardholderName="JOHN SMITH"
              expiryDate="09/26"
              cvv="123"
              size="sm"
              bgFrom="from-[#FBFBFC]"
              bgTo="to-[#FBFBFC]"
              textColor="text-gray-800"
            />

            {/* Card 2 - Blue card */}
            <CreditCard
              cardType="MASTERCARD"
              cardNumber="5678 1234 9012 3456"
              cardholderName="EMMA JOHNSON"
              expiryDate="11/27"
              cvv="456"
              size="sm"
              bgFrom="from-[#002072]"
              bgTo="to-[#002072]"
            />

            {/* Card 3 - White card */}
            <CreditCard
              cardType="VISA"
              cardNumber="9876 5432 1098 7654"
              cardholderName="DAVID WILSON"
              expiryDate="04/25"
              cvv="789"
              size="sm"
              bgFrom="from-white"
              bgTo="to-white"
              textColor="text-gray-800"
            />
          </div>
        </div>
        
        {/* Right side - Content area (70%) */}
        <div className="w-full lg:w-[70%] bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* 30% of the right side */}
            <div className="w-full lg:w-[30%]">
              {/* Smaller button group */}
              <CreditCardBtn 
                bgClassName="bg-[#EEF3FF]"
                hoverClassName="hover:bg-blue-100"
                iconColor="#002072"
                textColor="text-gray-800"
              />
              
              {/* Content for this section */}
              <div className="bg-white dark:bg-gray-700 rounded-xl p-3 shadow-sm mt-4">
                <h3 className="text-md font-medium mb-3">Card Details</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500">Card Number</p>
                    <p className="text-sm">**** **** **** 6754</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Card Type</p>
                    <p className="text-sm">Visa Debit Card</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Expiry Date</p>
                    <p className="text-sm">09/26</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">CVV</p>
                    <p className="text-sm">***</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Status</p>
                    <p className="text-sm bg-blue-800 p-1 rounded-lg text-center text-white w-12">active</p>
                  </div>
                </div>
              </div>

              <div>
                <SpendingLimit/>
              </div>
            </div>
            
            {/* 70% of the right side */}
            <div className="w-full lg:w-[70%] bg-white dark:bg-gray-700 rounded-xl p-4 shadow-sm">
             
            </div>
          </div>
          
          {/* Full width transaction history */}
          <div className="mt-6">
            <TransactionTable
              title="Transaction History"
              showTitle={true}
              initialPageSize={10}
              maxHeight="300px"
              renderNameWithIcon={true}
              hideCategory={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardsComponent;