import { Dispatch, forwardRef, SetStateAction } from "react";
import {
  UserIcon,
  Squares2X2Icon,
  BookOpenIcon,
  CalendarDaysIcon,
  UsersIcon,
  CommandLineIcon,
} from "@heroicons/react/24/solid";
import { NavLink } from "react-router-dom";
import { dot, logo, medal } from "../../../../public";
import { GrAnnounce, GrClose } from "react-icons/gr";
import Button from "@/components/Ui/Button";

type Props = {
  showNav: boolean;
  setShowNav: Dispatch<SetStateAction<boolean>>;
};

const MENU_ITEMS = [
  {
    name: "Dashboard",
    icon: Squares2X2Icon,
    path: "/dashboard",
  },
  {
    name: "Predictivo Copier",
    icon: BookOpenIcon,
    path: "/predictivo-copier",
  },
  {
    name: "PreMatch Alerts",
    icon: CalendarDaysIcon,
    path: "/prematch-alerts",
  },
  {
    name: "InPlay Alerts",
    icon: UsersIcon,
    path: "/inplay-alerts",
  },
  {
    name: "Fixtures",
    icon: UserIcon,
    path: "/fixtures",
  },
  {
    name: "Daily Predictivo",
    icon: CommandLineIcon,
    path: "/daily-predictivo",
  },
  {
    name: "Forum",
    icon: GrAnnounce,
    path: "/forum",
  },
];

const ACTIVE_STYLING = "bg-primary flex item-center gap-3 text-white font-bold";
const HOVER_STYLING = "hover:bg-orange-50 hover:text-orange-600 font-medium";

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
                PS
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-center mb-14 mt-3">
          {showNav ? (
            <img src={logo} alt={"Ferox"} width={200} height={100} />
          ) : (
            <div className="hidden md:inline-block text-center text-gray-700 font-bold text-xl">
              PS
            </div>
          )}
        </div>

        <ul className="flex item-center justify-center flex-col h-fit gap-5 mx-auto">
          {MENU_ITEMS.map(({ name, icon: Icon, path }) => (
            <li key={name.toLowerCase().replace(" ", "-")}>
              <NavLink
                to={path}
                key={name}
                onClick={()=> setShowNav(false)}
                className={({ isActive }) =>
                  `${
                    showNav ? "ml-5 px-3 " : "pl-2"
                  }  py-4 rounded-2xl text-center px-5 cursor-pointer flex  items-center gap-7 transition-colors ease-in-out duration-150 ${
                    isActive ? (showNav ? ACTIVE_STYLING : "") : HOVER_STYLING
                  }`
                }
              >
                <Icon className="md:h-7 h-8 md:w-7" />
                {showNav && (
                  <span className=" flex-shrink-0 text-center">{name}</span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Card component at the bottom */}
        <div
          className={` relative  w-full items-end mt-10 mb-[10%] mx-auto p-4 rounded-xl shadow-2xl shadow-black-400 drop-shadow-2xl space-y-3 ${
            showNav ? "" : "hidden"
          }`}
        >
          <img
            src={dot}
            alt={"Ferox"}
            className="object-contain absolute "
            width={50}
            height={50}
          />
          <div className="flex item-center justify-between">
            <h2 className="font-bold text-2xl">Invite Friends and get 5%</h2>
            <img
              src={medal}
              alt={"Ferox"}
              className="object-contain"
              width={30}
              height={30}
            />
          </div>
          <p className="mt-2 text-gray-600">
            Upgrade to premium to get premium features
          </p>
          <Button className="mt-4 p-4 px-6 rounded-xl">Invite</Button>
        </div>
      </aside>
    );
  }
);
