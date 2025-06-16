import { CgAddR } from "react-icons/cg";
import { CiDollar } from "react-icons/ci";
import { BsClock } from "react-icons/bs";
import { Link } from "react-router-dom";

interface CreditCardBtnProps {
  bgClassName?: string;
  hoverClassName?: string;
  iconColor?: string;
  textColor?: string;
  onHistoryClick?: () => void; // Add callback for history click
}

export default function CreditCardBtn({
  bgClassName = "bg-[#EEF3FF]",
  hoverClassName = "hover:bg-gray-50",
  iconColor = "#002072",
  textColor = "text-gray-800",
  onHistoryClick
}: CreditCardBtnProps) {

  const handleHistoryClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onHistoryClick) {
      onHistoryClick();
    }
  };

  return (
    <>
      <div className={`${bgClassName} px-2 py-2 rounded-xl mt-3`}>
        <div className="flex justify-between">
          <Link to='/top-up' className="full">
            <button
              className={`flex flex-col items-center p-2 rounded-lg ${hoverClassName}`}>
              <CgAddR style={{ color: iconColor }} className="h-4 w-4" />
              <span className={`mt-1 text-xs font-medium ${textColor}`}>Top-up</span>
            </button>
          </Link>

          <Link to='/predictive-account' className="full">
            <button className={`flex flex-col items-center p-2 rounded-lg ${hoverClassName}`}>
              <CiDollar style={{ color: iconColor }} className="h-4 w-4" />
              <span className={`mt-1 text-xs font-medium ${textColor}`}>Transfer</span>
            </button>
          </Link>

          {/* Change this from Link to button for scroll functionality */}
          <button 
            onClick={handleHistoryClick}
            className={`flex flex-col items-center p-2 rounded-lg ${hoverClassName} full`}
          >
            <BsClock style={{ color: iconColor }} className="h-4 w-4" />
            <span className={`mt-1 text-xs font-medium ${textColor}`}>History</span>
          </button>
        </div>
      </div>
    </>
  );
}