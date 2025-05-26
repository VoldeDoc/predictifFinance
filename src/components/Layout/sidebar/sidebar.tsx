import { Dispatch, forwardRef, SetStateAction } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { GrClose } from "react-icons/gr";
import { MdDashboard } from "react-icons/md";
import { IoIosLogOut } from "react-icons/io";
import { FaSackDollar } from "react-icons/fa6";
import { PiHeadCircuitThin } from "react-icons/pi";
import Logo from "../../../../public/assets/images/dashboard/dashboard/Transparent Logo 1.svg";
import { NewspaperIcon } from "@heroicons/react/24/solid";
import UserAuthentication from "@/hooks/UseAuth";
import { toast } from "react-toastify";

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
  // {
  //   name: "Portfolio",
  //   svg: <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
  //     <path d="M28.2651 24.1333C27.3318 24 26.3984 23.8667 25.3318 23.8667C21.9984 23.8667 18.7984 24.8 15.9984 26.6667C13.1984 24.9333 9.99843 23.8667 6.6651 23.8667C5.73177 23.8667 4.6651 24 3.73177 24.1333C3.0651 24.2667 2.53177 24.9333 2.6651 25.7333C2.79843 26.5333 3.4651 26.9333 4.2651 26.8C5.0651 26.6667 5.8651 26.5333 6.6651 26.5333C9.73177 26.5333 12.6651 27.4667 15.1984 29.3333C15.5984 29.7333 16.2651 29.7333 16.7984 29.3333C19.9984 27.0667 23.9984 26.1333 27.7318 26.8C28.3984 26.9333 29.1984 26.4 29.3318 25.7333C29.4651 24.9333 28.9318 24.2667 28.2651 24.1333ZM28.2651 2.79999C27.3318 2.66666 26.3984 2.53333 25.3318 2.53333C21.9984 2.53333 18.7984 3.46666 15.9984 5.33332C13.1984 3.46666 9.99843 2.53333 6.6651 2.53333C5.73177 2.53333 4.6651 2.66666 3.73177 2.79999C3.19843 2.79999 2.6651 3.46666 2.6651 3.99999V20C2.6651 20.8 3.19843 21.3333 3.99843 21.3333C4.13177 21.3333 4.13177 21.3333 4.2651 21.3333C5.0651 21.2 5.8651 21.0667 6.6651 21.0667C9.73177 21.0667 12.6651 22 15.1984 23.8667C15.5984 24.2667 16.2651 24.2667 16.7984 23.8667C19.9984 21.6 23.9984 20.6667 27.7318 21.3333C28.3984 21.4667 29.1984 20.9333 29.3318 20.2667C29.3318 20.1333 29.3318 20.1333 29.3318 20V3.99999C29.3318 3.46666 28.7984 2.79999 28.2651 2.79999Z" fill="currentColor" />
  //   </svg>,
  //   path: "/dashboard2",
  // },
  {
    name: "Predict.if Account",
    svg: <svg width="20" height="20" viewBox="0 0 32 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M26 2.46997H24.51V1.5C24.51 0.67999 23.84 0 23.01 0C22.18 0 21.51 0.67999 21.51 1.5V2.46997H17.5V1.5C17.5 0.67999 16.83 0 16 0C15.17 0 14.5 0.67999 14.5 1.5V2.46997H10.49V1.5C10.49 0.67999 9.82001 0 8.98999 0C8.15997 0 7.48999 0.67999 7.48999 1.5V2.46997H6C2.96997 2.46997 0.5 4.92999 0.5 7.96997V22.5C0.5 25.53 2.96997 28 6 28H26C29.03 28 31.5 25.53 31.5 22.5V7.96997C31.5 4.92999 29.03 2.46997 26 2.46997ZM28.5 9.62H3.5V7.96997C3.5 6.58997 4.62 5.46997 6 5.46997H7.48999V6.38C7.48999 7.20996 8.15997 7.88 8.98999 7.88C9.82001 7.88 10.49 7.20996 10.49 6.38V5.46997H14.5V6.38C14.5 7.20996 15.17 7.88 16 7.88C16.83 7.88 17.5 7.20996 17.5 6.38V5.46997H21.51V6.38C21.51 7.20996 22.18 7.88 23.01 7.88C23.84 7.88 24.51 7.20996 24.51 6.38V5.46997H26C27.38 5.46997 28.5 6.58997 28.5 7.96997V9.62Z" fill="currentColor" />
    </svg>,
    path: "/predictive-account",
  },
  {
    name: "Savings",
    icon: FaSackDollar,
    path: "/savings",
  },
  {
    name: "Education",
    icon: PiHeadCircuitThin,
    path: "/education",
  },
  {
    name: "Market News",
    icon: NewspaperIcon,
    path: "/market-news",
  },
  {
    name: "Analysis",
    svg: <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M18.6 13.1316C21.5823 13.1316 24 15.6765 24 18.8158C24 21.9551 21.5823 24.5 18.6 24.5C15.6176 24.5 13.2 21.9551 13.2 18.8158C13.2 15.6765 15.6176 13.1316 18.6 13.1316ZM16.8 15.6579V21.9737L22.2 18.8158L16.8 15.6579ZM12.2484 16.921C12.0831 17.5376 11.9995 18.1752 12 18.8158C12 19.0287 12.0091 19.2394 12.0269 19.4475L0 19.4474V16.921H12.2484ZM4.79998 6.81581V15.6579H1.19998V6.81581H4.79998ZM10.8 10.6053V15.6579H7.19999V10.6053H10.8ZM16.8 9.34209L16.7999 12.13C15.3252 12.569 14.0604 13.5341 13.1998 14.8205L13.2 9.34209H16.8ZM22.8 10.6053L22.8001 13.4565C21.8036 12.5903 20.5614 12.0259 19.2001 11.8967L19.2 10.6053H22.8ZM15 0.5C15.9941 0.5 16.8 1.34831 16.8 2.39474C16.8 2.42055 16.7995 2.44621 16.7985 2.47171L19.6472 3.67114C19.9771 3.27585 20.4608 3.02634 21 3.02634C21.9941 3.02634 22.8 3.87465 22.8 4.92108C22.8 5.9675 21.9941 6.81581 21 6.81581C20.0059 6.81581 19.2 5.9675 19.2 4.92108C19.2 4.89526 19.2005 4.86956 19.2014 4.84398L16.3529 3.64456C16.023 4.0399 15.5391 4.28948 15 4.28948C14.5811 4.29014 14.1753 4.13642 13.8529 3.85499L10.7641 5.80627C10.7876 5.92843 10.7999 6.05478 10.7999 6.18422C10.7999 7.23064 9.99404 8.07895 8.99994 8.07895C8.00583 8.07895 7.19994 7.23064 7.19994 6.18422C7.19994 6.0549 7.21226 5.92854 7.23571 5.80645L4.14647 3.85546C3.82416 4.13659 3.41856 4.29013 2.99998 4.28948C2.00587 4.28948 1.19998 3.44117 1.19998 2.39474C1.19998 1.34831 2.00587 0.5 2.99998 0.5C3.99408 0.5 4.79998 1.34831 4.79998 2.39474C4.79998 2.52411 4.78766 2.65041 4.7642 2.7725L7.85334 4.72361C8.17567 4.4424 8.58134 4.28881 8.99999 4.28948C9.41862 4.28881 9.82426 4.44237 10.1466 4.72355L13.2358 2.77256C13.2119 2.6482 13.1999 2.52162 13.2 2.39474C13.2 1.34831 14.0059 0.5 15 0.5Z" fill="black"/>
    </svg>,    
    path: "/analysis",
  },
   {
    name: "Forum",
    icon: NewspaperIcon,
    path: "/forum",
  },
];

const ACTIVE_STYLING =
  "bg-[#4FB7EF] flex item-center gap-3 !text-white font-bold";
const HOVER_STYLING = "hover:bg-blue-700 hover:text-[#efe9ff] font-medium";

// eslint-disable-next-line react/display-name
export const Sidebar = forwardRef<HTMLElement, Props>(
  ({ showNav, setShowNav }, ref) => {
    const { Logout } = UserAuthentication();
    const navigate = useNavigate();

    const handleLogout = async (e: React.MouseEvent) => {
      e.preventDefault(); // Prevent navigation
      
      // Create a toast ID for the loading state
      const toastId = toast.loading('Logging out...');
      
      try {
        // Call the Logout function from UserAuthentication
        await Logout();
        
        // Show success toast and update the loading toast
        toast.update(toastId, { 
          render: 'Logged out successfully', 
          type: 'success',
          isLoading: false,
          autoClose: 2000
        });
        
        // Add a small delay before navigation for better UX
        setTimeout(() => {
          navigate("/auth/signin");
        }, 500);
      } catch (error) {
        console.error("Logout failed:", error);
        
        // Show error toast and update the loading toast
        toast.update(toastId, { 
          render: error instanceof Error ? error.message : 'Failed to logout. Please try again.',
          type: 'error',
          isLoading: false,
          autoClose: 3000
        });
      }
    };

    return (
      <aside
        ref={ref}
        className={`fixed overflow-y-auto overflow-hidden h-full z-[9999] md:flex md:flex-col bg-white shadow-sm transition-all duration-1000 md:px-5 ${showNav ? "w-[100%] px-5 md:px-none md:w-[20%]" : "md:w-20 w-0"
          }`}
      >
        <div className="pt-5 pl-5">
          {/* Close button visible only on mobile screens */}
          <div className="block md:hidden">
            {showNav ? (
              <button
                className="cursor-pointer text-black hover:text-primary transition-colors ease-in-out duration-300"
                onClick={() => setShowNav((prev) => !prev)}
              >
                <GrClose size={24} />
              </button>
            ) : (
              <div className="text-center hidden text-black font-bold text-xl">
                FS
              </div>
            )}
          </div>
        </div>
        <div className="flex mb-8 mt-3">
          {showNav ? (
            <img src={Logo} alt="" className="h-20" />
          ) : (
            <div className="hidden md:inline-block text-center text-black font-bold text-lg">
              <img src="assets/images/favicon.png" className="mr-3 h-5 sm:h-7" alt="Predict.if Logo" />
            </div>
          )}
        </div>

        <ul
          className={`${showNav ? "" : "mx-auto"
            } flex item-center justify-center flex-col h-fit gap-4`}
        >
          {MENU_ITEMS.map(({ name, icon: Icon, path, svg }) => (
            <li key={name.toLowerCase().replace(" ", "-")}>
              <NavLink
                to={path}
                key={name}
                onClick={() => setShowNav(false)}
                className={({ isActive }) =>
                  `${showNav ? "ml-2 px-3" : "pl-2"
                  } py-3 rounded-2xl text-center text-black px-4 cursor-pointer flex items-center gap-5 transition-colors ease-in-out duration-150 ${isActive ? (showNav ? ACTIVE_STYLING : "") : HOVER_STYLING
                  }`
                }
              >
                {svg ? (
                  <span className="text-current">
                    {svg}
                  </span>
                ) : (
                  Icon && <Icon className="md:h-6 md:w-6 h-7 w-7" />
                )}
                {showNav && (
                  <span className="flex-shrink-0 text-sm font-medium">
                    {name}
                  </span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Logout button positioned at the bottom with onClick handler */}
        <ul className={`${showNav ? "mb-8" : "mx-auto"} mt-auto pt-20`}>
          <li>
            <button
              onClick={handleLogout}
              className={`${showNav ? "ml-2 px-3" : "pl-2"
                } py-3 rounded-2xl text-center text-gray-500 px-4 mx-auto cursor-pointer flex items-center gap-5 transition-colors ease-in-out duration-150 w-full ${HOVER_STYLING}`}
            >
              <IoIosLogOut className="md:h-6 md:w-6 h-7 w-7" />
              {showNav && (
                <span className="flex-shrink-0 text-sm font-medium">
                  Logout
                </span>
              )}
            </button>
          </li>
        </ul>
      </aside>
    );
  }
);