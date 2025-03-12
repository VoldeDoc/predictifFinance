import React, { useState } from 'react';
import styles from '../../../styles/creditCard..module.css';

interface CreditCardProps {
  cardNumber?: string;
  cardholderName?: string;
  expiryDate?: string;
  cvv?: string;
  cardType?: 'VISA' | 'MASTERCARD' | 'AMEX' | 'DISCOVER';
  size?: 'sm' | 'md' | 'lg';
  bgFrom?: string;
  bgTo?: string;
  className?: string;
  textColor?: string; 
}

const CreditCard: React.FC<CreditCardProps> = ({
  cardNumber = '•••• •••• •••• ••••',
  cardholderName = 'CARD HOLDER',
  expiryDate = 'MM/YY',
  cvv = '•••',
  cardType = 'VISA',
  size = 'md',
  bgFrom = 'from-blue-500',
  bgTo = 'to-cyan-400',
  className = '',
  textColor = 'text-white', 
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

  // Determine size class
  const sizeClasses = {
    'sm': 'w-[240px] h-[150px]', // Even smaller for tight spaces
    'md': 'w-[340px] h-[215px]',
    'lg': 'w-[400px] h-[255px]',
  }[size];

  // Determine text sizes based on card size
  const cardTypeSize = size === 'sm' ? 'text-lg' : 'text-2xl';
  const cardNumberSize = size === 'sm' ? 'text-sm' : size === 'md' ? 'text-lg' : 'text-xl';
  const labelSize = 'text-[10px]';
  const detailSize = size === 'sm' ? 'text-xs' : 'text-sm';

  return (
    <div 
      className={`${sizeClasses} cursor-pointer ${styles.creditCardContainer} ${className}`}
      onClick={handleCardClick}
    >
      <div className={`w-full h-full relative ${styles.creditCard} ${isFlipped ? styles.flipped : ''}`}>
        {/* Front of the card */}
        <div className={`w-full h-full absolute rounded-2xl shadow-lg bg-gradient-to-br ${bgFrom} ${bgTo} ${textColor} ${styles.cardFace}`}>
          {/* Card content with adjusted padding based on size */}
          <div className={`flex flex-col justify-between h-full ${size === 'sm' ? 'p-3' : 'p-5'}`}>
            {/* Top section */}
            <div>
              <div className={`text-right ${cardTypeSize} font-bold mb-2`}>{cardType}</div>
              
              {/* Chip */}
              <div className={`${size === 'sm' ? 'w-8 h-6' : 'w-12 h-10'} bg-yellow-600 rounded-md mb-2 flex flex-col justify-evenly p-1`}>
                <div className="h-[1px] bg-black bg-opacity-30"></div>
                <div className="h-[1px] bg-black bg-opacity-30"></div>
                <div className="h-[1px] bg-black bg-opacity-30"></div>
                <div className="h-[1px] bg-black bg-opacity-30"></div>
              </div>
              
              {/* Card Number */}
              <div className={`${cardNumberSize} tracking-wider mt-2`}>
                {formatCardNumber(cardNumber)}
              </div>
            </div>
            
            {/* Card details at bottom */}
            <div className="flex justify-between items-end">
              <div className="overflow-hidden">
                <div className={`${labelSize} uppercase opacity-70`}>Card Holder</div>
                <div className={`${detailSize} truncate tracking-wide ${size === 'sm' ? 'max-w-[100px]' : 'max-w-[160px]'}`}>
                  {cardholderName}
                </div>
              </div>
              <div className="text-right">
                <div className={`${labelSize} uppercase opacity-70`}>Expires</div>
                <div className={`${detailSize} tracking-wide`}>
                  {expiryDate}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Back of the card */}
        <div className={`w-full h-full absolute rounded-2xl shadow-lg bg-gradient-to-br ${bgFrom} ${bgTo === 'to-cyan-400' ? 'to-blue-700' : bgTo} ${textColor} ${styles.cardFace} ${styles.cardBack}`}>
          <div className="flex flex-col justify-between h-full">
            <div className="w-full h-6 bg-gray-800 mt-4"></div>
            
            <div className="px-3">
              <div className="bg-gray-100 h-8 flex items-center px-3 my-2">
                <div className="bg-white px-2 py-1 rounded">
                  <div className="text-[10px] font-bold text-gray-800">CVV</div>
                  <div className="text-xs text-gray-800">{cvv}</div>
                </div>
              </div>
            </div>
            
            <div className="text-center text-[8px] mb-3">
              <p className="mb-1">This card is property of PredictifFinance.</p>
              <p>If found, please return to the nearest branch.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditCard;