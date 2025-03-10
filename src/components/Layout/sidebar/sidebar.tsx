import { Dispatch, forwardRef, SetStateAction } from "react";
import { NavLink } from "react-router-dom";
import { GrClose, GrTransaction } from "react-icons/gr";
import { BsFillBriefcaseFill } from "react-icons/bs";
import { MdDashboard, MdOutlineWallet } from "react-icons/md";
import { AiFillSliders } from "react-icons/ai";
import { IoIosLogOut } from "react-icons/io";
import { bulb } from "../../../../public";

type Props = {
  showNav: boolean;
  setShowNav: Dispatch<SetStateAction<boolean>>;
};

const MENU_ITEMS = [
  {
    name: "Dashboard",
    icon: MdDashboard,
    path: "/dashboard",
  },
  {
    name: "Portfolio",
    icon: BsFillBriefcaseFill,
    path: "/portfolio",
  },
  {
    name: "Predictive Account",
    icon: AiFillSliders,
    path: "/predictive-account",
  },
  {
    name: "Research Portal",
    icon: MdOutlineWallet,
    path: "/research-portal",
  },
  {
    name: "Wallet Transfer Pay",
    svg: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth={0}
        xmlns="http://www.w3.org/2000/svg"
        className="md:h-8 h-9 md:w-8"
      >
        <path fill="none" d="M0 0h24v24H0z"></path>
        <path d="M13 10V7H16V5L20 8.5L16 12V10H13ZM12 3.7V5H0V3.7L6 0L12 3.7ZM5 6H7V11H5V6ZM1 6H3V11H1V6ZM11 6V8.5L9 10.3V6H11ZM7.1 12L6.5 12.5L8.2 14H0V12H7.1ZM15 11V14H12V16L8 12.5L12 9V11H15Z" />
      </svg>
    ),
    path: "/wallet-transfer-pay",
  },
  {
    name: "Reporting & Transaction",
    icon: GrTransaction,
    path: "/reporting-transaction",
  },
  {
    name: "Tutorial",
    svg: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth={0}
        xmlns="http://www.w3.org/2000/svg"
        className="md:h-8 h-9 md:w-8"
      >
        <path fill="none" d="M0 0h24v24H0z"></path>
        <path d="M19.199 17.1429C18.9318 17.1442 18.6683 17.2101 18.4281 17.3357L15.8485 14.5714H13.7998V15.8571H15.3512L17.5799 18.2454C17.4625 18.5027 17.4008 18.785 17.3993 19.0714C17.3993 19.4529 17.5048 19.8257 17.7026 20.1429C17.9003 20.46 18.1814 20.7072 18.5103 20.8532C18.8391 20.9992 19.201 21.0374 19.5501 20.9629C19.8992 20.8885 20.2199 20.7048 20.4716 20.4351C20.7233 20.1654 20.8947 19.8218 20.9642 19.4477C21.0336 19.0736 20.998 18.6858 20.8618 18.3334C20.7255 17.981 20.4949 17.6798 20.1989 17.4679C19.9029 17.256 19.555 17.1429 19.199 17.1429ZM19.199 10.0714C18.828 10.0726 18.4664 10.1968 18.164 10.427C17.8615 10.6573 17.6329 10.9822 17.5097 11.3571H13.7998V12.6429H17.5097C17.6202 12.9753 17.8139 13.2688 18.0695 13.4913C18.3252 13.7138 18.633 13.8568 18.9593 13.9045C19.2857 13.9522 19.618 13.9029 19.9199 13.7619C20.2218 13.6209 20.4818 13.3937 20.6714 13.1051C20.861 12.8165 20.9729 12.4777 20.9949 12.1255C21.017 11.7734 20.9482 11.4215 20.7963 11.1084C20.6443 10.7953 20.4149 10.5329 20.1332 10.3501C19.8516 10.1672 19.5284 10.0708 19.199 10.0714ZM19.199 3C18.7218 3.00051 18.2644 3.20386 17.9269 3.56543C17.5895 3.927 17.3998 4.41724 17.3993 4.92857C17.4013 5.23654 17.473 5.53939 17.6081 5.81122L15.3572 8.14286H13.7998V9.42857H15.8419L18.4815 6.69514C18.7267 6.80972 18.9927 6.86427 19.26 6.85481C19.5274 6.84535 19.7894 6.77212 20.027 6.64046C20.2646 6.50879 20.4719 6.32201 20.6336 6.0937C20.7954 5.86539 20.9076 5.60131 20.9621 5.32067C21.0166 5.04003 21.012 4.7499 20.9486 4.4714C20.8853 4.1929 20.7648 3.93304 20.5959 3.71074C20.427 3.48845 20.214 3.3093 19.9724 3.18635C19.7307 3.0634 19.4665 2.99974 19.199 3Z" />
        <path d="M13.1556 6.12244H14.3V5H13.1556C12.8295 5.00107 12.5074 5.07088 12.2112 5.2047C11.915 5.33851 11.6516 5.53321 11.4389 5.7756C11.2261 5.53321 10.9627 5.33851 10.6666 5.2047C10.3704 5.07088 10.0483 5.00107 9.72222 5H9.15C7.7846 5.00149 6.47556 5.53412 5.51007 6.48103C4.54459 7.42795 4.00151 8.71182 4 10.051V13.4183C4.00151 14.7574 4.54459 16.0413 5.51007 16.9882C6.47556 17.9351 7.7846 18.4677 9.15 18.4692H9.72222C10.0483 18.4682 10.3704 18.3984 10.6666 18.2645C10.9627 18.1307 11.2261 17.936 11.4389 17.6936C11.6516 17.936 11.915 18.1307 12.2112 18.2645C12.5074 18.3984 12.8295 18.4682 13.1556 18.4692H14.3V17.3468H13.1556C12.8521 17.3465 12.5612 17.2281 12.3466 17.0177C12.1321 16.8073 12.0114 16.522 12.0111 16.2244V7.24487C12.0114 6.94727 12.1321 6.66195 12.3466 6.45152C12.5612 6.24109 12.8521 6.12273 13.1556 6.12244Z" />
        <path
          d="M5.2793 10.0421H6.52476C7.35319 10.0421 8.02476 9.37055 8.02476 8.54213V7.68208"
          stroke="#808080"
        />
        <path
          d="M10.7705 13.3919L9.97699 13.3919C9.14856 13.3919 8.47699 14.0635 8.47699 14.8919L8.47699 15.752"
          stroke="#808080"
        />
        <path d="M10.7705 11.0317L9.35733 11.0317" stroke="#808080" />
        <path d="M6.69287 13.0078L5.27969 13.0078" stroke="#808080" />
      </svg>
    ),
    path: "/tutorial",
  },
];

const ACTIVE_STYLING =
  "bg-[#efe9ff] flex item-center gap-3 !text-blue-700 font-bold";
const HOVER_STYLING = "hover:bg-blue-700 hover:text-[#efe9ff] font-medium";

// eslint-disable-next-line react/display-name
export const Sidebar = forwardRef<HTMLElement, Props>(
  ({ showNav, setShowNav }, ref) => {
    return (
      <aside
        ref={ref}
        className={`fixed overflow-y-auto overflow-hidden  h-full z-[9999] md:flex md:flex-col  bg-white shadow-sm transition-all duration-1000 md:px-5 ${
          showNav ? "w-[100%] px-5 md:px-none md:w-[20%]" : "md:w-20 w-0"
        }`}
      >
        <div className="pt-5 pl-5">
          {/* Close button visible only on mobile screens */}
          <div className="block md:hidden">
            {showNav ? (
              <button
                className="cursor-pointer text-gray-700 hover:text-primary transition-colors ease-in-out duration-300"
                onClick={() => setShowNav((prev) => !prev)}
              >
                <GrClose size={30} />
              </button>
            ) : (
              <div className="text-center hidden text-gray-700 font-bold text-xl">
                FS
              </div>
            )}
          </div>
        </div>
        <div className="flex mb-14 mt-3">
          {showNav ? (
            <h2 className="font-bold text-2xl">Foxstocks</h2>
          ) : (
            <div className="hidden md:inline-block text-center text-gray-700 font-bold text-xl">
              FS
            </div>
          )}
        </div>

        <ul
          className={`${
            showNav ? "" : "mx-auto"
          } flex item-center justify-center flex-col h-fit gap-5`}
        >
          <span className="text-gray-500 font-semibold text-md ml-2">
            User Panel
          </span>
          {MENU_ITEMS.map(({ name, icon: Icon, path, svg }) => (
            <li key={name.toLowerCase().replace(" ", "-")}>
              <NavLink
                to={path}
                key={name}
                onClick={() => setShowNav(false)}
                className={({ isActive }) =>
                  `${
                    showNav ? "ml-2 px-3" : "pl-2"
                  }  py-4 rounded-2xl text-center text-gray-500 px-5 cursor-pointer flex  items-center gap-7 transition-colors ease-in-out duration-150 ${
                    isActive ? (showNav ? ACTIVE_STYLING : "") : HOVER_STYLING
                  }`
                }
              >
                {svg ? svg : <Icon className="md:h-8 h-9 md:w-8" />}
                {showNav && (
                  <span className=" flex-shrink-0 text-center">{name}</span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Card component at the bottom */}
        <div
          className={` relative  w-full items-end mt-20 mb-[85%] mx-auto p-4  space-y-3 ${
            showNav ? "" : "hidden"
          }`}
        >
          <div className="absolute w-[27.82px] h-[45.77px] bg-[#024294] z-50 opacity-50 blur-[32.5px]"></div>
          <div className="absolute w-[240px] h-[230px] bg-[#e9ffdb] rounded-xl shadow-md shadow-black-100 drop-shadow-md">
            <p className="text-center font-medium px-5 mt-28 text-gray-500">
              If you aren’t willing to own a stock for 10 years, don’t even
              think about owning it for 10 minutes.
            </p>
          </div>
          <div className="absolute w-[90px] h-[90px] -top-9 left-24 bg-[#e9ffdb] rounded-full">
            <img
              src={bulb}
              alt="bulb"
              className="w-2/4 mt-5 mx-auto mb-5 shadow-sm drop-shadow-sm"
            />
            <span className="text-center text-xs font-bold text-gray-500">
              Thoughts Time
            </span>
          </div>
          {/* </div> */}
        </div>

        <ul className={`${showNav ? "mb-10" : "mx-auto"} `}>
          <li>
            <NavLink
              to="/logout"
              className={`${
                showNav ? "ml-2 px-3" : "pl-2"
              } py-4 rounded-2xl text-center text-gray-500 px-5 mx-auto cursor-pointer flex items-center gap-7 transition-colors ease-in-out duration-150 ${HOVER_STYLING}`}
            >
              <IoIosLogOut className="md:h-8 h-9 md:w-8" />
              {showNav && (
                  <span className=" flex-shrink-0 text-center">Logout</span>
                )}
              
            </NavLink>
          </li>
        </ul>
      </aside>
    );
  }
);
