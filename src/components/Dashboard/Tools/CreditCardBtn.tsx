import { CgAddR } from "react-icons/cg";
import { CiDollar } from "react-icons/ci";
import { FaRegFileAlt } from "react-icons/fa";
import { BsClock } from "react-icons/bs"

export default function CreditCardBtn() {
    return (
        <>
        <div className="bg-[#EEF3FF] px-y py-3 rounded-2xl mt-5">
            <div className="flex justify-between">
                <button className="flex flex-col items-center p-3  rounded-lg  hover:bg-gray-50">
                    <CgAddR className="h-6 w-6 text-[#002072]" />
                    <span className="mt-2 text-sm font-medium">Top-up</span>
                </button>

                <button className="flex flex-col items-center p-3  rounded-lg  hover:bg-gray-50">
                    <CiDollar className="h-6 w-6 text-[#002072]" />
                    <span className="mt-2 text-sm font-medium">Transfer</span>
                </button>

                <button className="flex flex-col items-center p-3  rounded-lg  hover:bg-gray-50">
                    <FaRegFileAlt className="h-6 w-6 text-[#002072]" />
                    <span className="mt-2 text-sm font-medium">Request</span>
                </button>

                <button className="flex flex-col items-center p-3  rounded-lg  hover:bg-gray-50">
                    <BsClock className="h-6 w-6 text-[#002072]" />
                    <span className="mt-2 text-sm font-medium">History</span>
                </button>
            </div>
        </div >
        </>
    )

}

