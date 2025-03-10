import React, { useState } from 'react';
import styles from '../../../styles/creditCard..module.css';
import { CreditCardProps } from '@/types';


const CreditCard: React.FC<CreditCardProps> = ({
  cardNumber = '•••• •••• •••• ••••',
  cardholderName = 'CARD HOLDER',
  expiryDate = 'MM/YY',
  cvv = '•••',
  cardType = 'VISA',
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  // Format card number with spaces for display
  const formatCardNumber = (number: string) => {
    if (number === '•••• •••• •••• ••••') return number;
    return number.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
  };

  return (
    <div 
      className={`w-[340px] h-[215px] mx-auto my-5 cursor-pointer ${styles.creditCardContainer}`}
      onClick={handleCardClick}
    >
      <div className={`w-full h-full relative ${styles.creditCard} ${isFlipped ? styles.flipped : ''}`}>
        {/* Front of the card */}
        <div className={`w-full h-full absolute rounded-2xl shadow-lg p-5 bg-gradient-to-br from-blue-500 to-cyan-400 text-white flex flex-col ${styles.cardFace}`}>
          <div className="text-right text-2xl font-bold mb-6">{cardType}</div>
          
          {/* Chip */}
          <div className="w-12 h-10 bg-yellow-600 rounded-md mb-5 flex flex-col justify-evenly p-1">
            <div className="h-[3px] bg-black bg-opacity-30"></div>
            <div className="h-[3px] bg-black bg-opacity-30"></div>
            <div className="h-[3px] bg-black bg-opacity-30"></div>
            <div className="h-[3px] bg-black bg-opacity-30"></div>
          </div>
          
          <div className="text-xl tracking-wider mb-5">{formatCardNumber(cardNumber)}</div>
          
          <div className="flex justify-between mt-auto">
            <div>
              <div className="text-xs uppercase opacity-70 mb-1">Card Holder</div>
              <div className="text-sm tracking-wide">{cardholderName}</div>
            </div>
            <div>
              <div className="text-xs uppercase opacity-70 mb-1">Expires</div>
              <div className="text-sm tracking-wide">{expiryDate}</div>
            </div>
          </div>
        </div>
        
        {/* Back of the card */}
        <div className={`w-full h-full absolute rounded-2xl shadow-lg p-5 bg-gradient-to-br from-blue-500 to-blue-700 text-white ${styles.cardFace} ${styles.cardBack}`}>
          <div className="w-full h-10 bg-gray-800 my-5"></div>
          
          <div className="bg-gray-100 h-10 flex items-center px-3 mb-5">
            <div className="bg-white px-2 py-1 rounded">
              <div className="text-xs font-bold text-gray-800">CVV</div>
              <div className="text-sm text-gray-800">{cvv}</div>
            </div>
          </div>
          
          <div className="text-center text-xs">
            <p className="m-1">This card is property of PredictifFinance.</p>
            <p className="m-1">If found, please return to the nearest bank branch.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditCard;