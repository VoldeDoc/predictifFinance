import { CgAddR } from "react-icons/cg";
import { CiDollar } from "react-icons/ci";
import { BsClock } from "react-icons/bs";
import { Link } from "react-router-dom";

interface CreditCardBtnProps {
  bgClassName?: string; // Use Tailwind classes for background
  hoverClassName?: string; // Use Tailwind classes for hover
  iconColor?: string; // Use a color string for icon color
  textColor?: string; // Optional text color
}

export default function CreditCardBtn({
  bgClassName = "bg-[#EEF3FF]", // Default using Tailwind's arbitrary value syntax
  hoverClassName = "hover:bg-gray-50",
  iconColor = "#002072",
  textColor = "text-gray-800"
}: CreditCardBtnProps) {


  return (
    <>
      <div className={`${bgClassName} px-2 py-2 rounded-xl mt-3`}>
        <div className="flex justify-between">
          <Link to='/top-up' className="full"><button
            className={`flex flex-col items-center p-2 rounded-lg ${hoverClassName}`}>
            <CgAddR style={{ color: iconColor }} className="h-4 w-4" />
            <span className={`mt-1 text-xs font-medium ${textColor}`}>Top-up</span>
          </button>
          </Link>

          <button className={`flex flex-col items-center p-2 rounded-lg ${hoverClassName}`}>
            <CiDollar style={{ color: iconColor }} className="h-4 w-4" />
            <span className={`mt-1 text-xs font-medium ${textColor}`}>Transfer</span>
          </button>

          <button className={`flex flex-col items-center p-2 rounded-lg ${hoverClassName}`}>
            <BsClock style={{ color: iconColor }} className="h-4 w-4" />
            <span className={`mt-1 text-xs font-medium ${textColor}`}>History</span>
          </button>
        </div>
      </div>
    </>
  );
}