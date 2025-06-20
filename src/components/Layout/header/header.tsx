import { Dispatch, Fragment, SetStateAction } from "react";
import {
  CheckIcon,
  ChevronDownIcon,
  CreditCardIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { Menu, Popover, Transition } from "@headlessui/react";
import { BellIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { user } from "../../../../public";
import SearchModal from "./Tools/SearchModal";
import {
  TbSquareArrowLeftFilled,
  TbSquareArrowRightFilled,
} from "react-icons/tb";
import { useSelector } from "react-redux";
import { RootState } from "@/context/store/rootReducer";
import { CgPassword, CgProfile } from "react-icons/cg";
import { PiStrategy } from "react-icons/pi";
import { MdSavings } from "react-icons/md";

type Props = {
  showNav: boolean;
  setShowNav: Dispatch<SetStateAction<boolean>>;
};

export const Header = ({ showNav, setShowNav }: Props) => {
  const userdata = useSelector((state: RootState) => state.auth?.user);
  const username = userdata?.username;

  
  const isKycComplete = (userdata as any)?.kyc_status === 'yes'  

  return (
    <section
      className={`fixed z-[9999] w-full h-24 bg-white flex items-center transition-all duration-[900ms] ${
        showNav ? "pl-[20%]" : "md:pl-20"
      }`}
    >
      <ul
        className={
          "flex justify-between w-full items-center flex-1 px-4 md:pr-12"
        }
      >
        <div className="flex items-center justify-center gap-5">
          {showNav ? (
            <button
              className="h-8 w-8 cursor-pointer text-gray-700 hover:text-orange-500 transition-colors ease-in-out duration-[900ms]"
              onClick={() => setShowNav((prev) => !prev)}
            >
              <TbSquareArrowLeftFilled size={24} />
            </button>
          ) : (
            <button
              className="h-8 w-8 cursor-pointer text-gray-700 hover:text-orange-500 transition-colors ease-in-out duration-[900ms]"
              onClick={() => setShowNav((prev) => !prev)}
            >
              <TbSquareArrowRightFilled size={24}  />
            </button>
          )}
          <div className="hidden font-bold text-4xl">Dashboard</div>
        </div>

        <li className="flex items-center gap-5 md:gap-8">
          <SearchModal />
          <Popover className={"relative"}>
            <Popover.Button
              className={"outline-none cursor-pointer text-gray-700"}
            >
              <BellIcon className={"h-6 w-6"} />
            </Popover.Button>
            <Transition
              as={Fragment}
              enter={"transition ease-out duration-100"}
              enterFrom={"transform slace-95"}
              enterTo={"transform scale-100"}
              leave={"transition ease-in duration-75"}
              leaveFrom={"transform scale-100"}
              leaveTo={"transform scale-95"}
            >
              <Popover.Panel
                className={
                  "absolute -right-16 sm:right-0 z-50 mt-2 bg-white shadow-sm rounded max-w-xs sm:max-w-sm w-screen p-4"
                }
              >
                <div className="flex justify-between items-center">
                  <p className="text-gray-700 font-bold">Notifications</p>
                  <button className="text-sm font-medium text-orange-500 bg-transparent py-1 px-2 border border-orange-500 rounded shadow transition-colors ease-in-out duration-300 hover:bg-orange-100">
                    Mark all as read
                  </button>
                </div>
                <ul className="flex flex-col gap-4 mt-4">
                  <li className="flex items-center gap-4">
                    <div className="rounded-full shrink-0 bg-green-200 h-8 w-8 flex items-center justify-center">
                      <CheckIcon className={"h-4 w-4 text-green-600"} />
                    </div>

                    <div className={"flex flex-col"}>
                      <p className="font-medium text-gray-700">
                        Notification text
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        Notification description
                      </p>
                    </div>
                  </li>
                  <li className="flex items-center gap-4">
                    <div className="rounded-full shrink-0 bg-red-200 h-8 w-8 flex items-center justify-center">
                      <XMarkIcon className={"h-4 w-4 text-red-600"} />
                    </div>

                    <div className={"flex flex-col"}>
                      <p className="font-medium text-gray-700">
                        Notification text
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        Notification description
                      </p>
                    </div>
                  </li>
                </ul>
              </Popover.Panel>
            </Transition>
          </Popover>
          <Menu as={"div"} className={"relative inline-block text-left"}>
            <Menu.Button
              className={"inline-flex w-full justify-center items-center gap-1"}
            >
              <img
                src={user}
                alt={"User"}
                width={32}
                height={32}
                className={"rounded-full mr-1 border-2 border-white shadow-sm"}
              />
              <span className="hidden md:block font-medium text-gray-700">
                {username}
              </span>
              <ChevronDownIcon className={"w-4 h-4 text-gray-700"} />
            </Menu.Button>

            <Transition
              as={Fragment}
              enter={"transition ease-out duration-100"}
              enterFrom={"transform slace-95"}
              enterTo={"transform scale-100"}
              leave={"transition ease-in duration-75"}
              leaveFrom={"transform scale-100"}
              leaveTo={"transform scale-95"}
            >
              <Menu.Items
                className={
                  "absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg"
                }
              >
                <div className="p-1">
                  {/* Conditionally render KYC link only if KYC is not complete */}
                  {!isKycComplete && (
                    <Menu.Item>
                      <Link
                        to={"/kyc"}
                        className={
                          "flex items-center gap-2 rounded p-2 transition-colors ease-in-out duration-150 text-gray-700 hover:bg-gray-100 group"
                        }
                      >
                        <CreditCardIcon className={"h-4 w-4 text-gray-700"} />
                        <span className={"group-hover:text-orange-500"}>
                          Complete KYC
                        </span>
                      </Link>
                    </Menu.Item>
                  )}
                  
                  <Menu.Item>
                    <Link
                      to={"/strategies"}
                      className={
                        "flex items-center gap-2 rounded p-2 transition-colors ease-in-out duration-150 text-gray-700 hover:bg-gray-100 group"
                      }
                    >
                      <PiStrategy className={"h-4 w-4 text-gray-700"} />
                      <span className={"group-hover:text-orange-500"}>
                        Strategies
                      </span>
                    </Link>
                  </Menu.Item>
                  <Menu.Item>
                    <Link
                      to={"/user-budgets"}
                      className={
                        "flex items-center gap-2 rounded p-2 transition-colors ease-in-out duration-150 text-gray-700 hover:bg-gray-100 group"
                      }
                    >
                      <MdSavings className={"h-4 w-4 text-gray-700"} />
                      <span className={"group-hover:text-orange-500"}>
                        Budget
                      </span>
                    </Link>
                  </Menu.Item>
                  <Menu.Item>
                    <Link
                      to={"/auth/change-pwd"}
                      className={
                        "flex items-center gap-2 rounded p-2 transition-colors ease-in-out duration-150 text-gray-700 hover:bg-gray-100 group"
                      }
                    >
                      <CgPassword className={"h-4 w-4 text-gray-700"} />
                      <span className={"group-hover:text-orange-500"}>
                        Change Password
                      </span>
                    </Link>
                  </Menu.Item>
                  <Menu.Item>
                    <Link
                      to={"/profile"}
                      className={
                        "flex items-center gap-2 rounded p-2 transition-colors ease-in-out duration-150 text-gray-700 hover:bg-gray-100 group"
                      }
                    >
                      <CgProfile className={"h-4 w-4 text-gray-700"} />
                      <span className={"group-hover:text-orange-500"}>
                        Profile
                      </span>
                    </Link>
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </li>
      </ul>
    </section>
  );
};