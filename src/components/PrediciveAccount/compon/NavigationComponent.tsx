import React from 'react';
import { 
  CreditCardIcon,
  Cog6ToothIcon, 
  ArrowsRightLeftIcon, 
  UserCircleIcon,
  SunIcon,
  BanknotesIcon,
  XMarkIcon,
  MoonIcon
} from "@heroicons/react/24/outline";

// Define sidebar items type
interface SidebarItem {
  name: string;
  icon: JSX.Element;
  id: string;
  section?: 'main' | 'bottom';
}

interface NavigationProps {
  activeTab: string;
  darkMode: boolean;
  sidebarOpen: boolean;
  isMobile: boolean;
  handleTabChange: (tabId: string) => void;
  toggleDarkMode: () => void;
  closeSidebar: () => void;
}

const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  darkMode,
  sidebarOpen,
  handleTabChange,
  toggleDarkMode,
  closeSidebar
}) => {
  // Define sidebar navigation items
  const sidebarItems: SidebarItem[] = [
    {
      name: "Accounts",
      icon: <UserCircleIcon className="w-5 h-5" />,
      id: "accounts",
      section: 'main'
    },
    {
      name: "Savings",
      icon: <ArrowsRightLeftIcon className="w-5 h-5" />,
      id: "savings",
      section: 'main'
    },
    {
      name: "Transactions",
      icon: <BanknotesIcon className="w-5 h-5" />,
      id: "transactions",
      section: 'main'
    },
    {
      name: "Funds & Deposit",
      icon: <CreditCardIcon className="w-5 h-5" />,
      id: "funds",
      section: 'main'
    },
    {
      name: "Settings",
      icon: <Cog6ToothIcon className="w-5 h-5" />,
      id: "settings",
      section: 'bottom'
    }
  ];

  // Filter items by section
  const mainItems = sidebarItems.filter(item => item.section === 'main');
  const bottomItems = sidebarItems.filter(item => item.section === 'bottom');

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-gray-600 bg-opacity-75 md:hidden"
          onClick={closeSidebar}
        ></div>
      )}

      {/* Sidebar for desktop and slide-over for mobile */}
      <div 
        className={`fixed md:sticky top-0 left-0 z-40 w-48 h-full transform transition-transform duration-300 ease-in-out bg-[#F5F7F9] border-r border-gray-200 flex flex-col md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Close button - mobile only */}
          <div className="md:hidden flex justify-end p-4">
            <button 
              onClick={closeSidebar}
              className="rounded-md p-1 hover:bg-gray-200"
              aria-label="Close menu"
            >
              <XMarkIcon className="h-6 w-6 text-gray-700" />
            </button>
          </div>

          {/* Main navigation items */}
          <nav className="flex-1 mt-4 overflow-y-auto px-2">
            <ul className="space-y-1">
              {mainItems.map((item) => (
                <li key={item.id}>
                  <button
                    className={`flex items-center px-4 py-3 text-sm rounded-lg w-full text-left transition-colors ${
                      activeTab === item.id
                        ? "bg-white text-gray-800 shadow-sm"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => handleTabChange(item.id)}
                  >
                    <span className={`mr-3 ${activeTab === item.id ? "text-blue-600" : "text-gray-500"}`}>
                      {item.icon}
                    </span>
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          
          {/* Bottom navigation (settings and theme toggle) */}
          <div className="mt-auto border-t border-gray-200 pt-2 pb-6 px-2">
            <ul className="space-y-1">
              {bottomItems.map((item) => (
                <li key={item.id}>
                  <button
                    className={`flex items-center px-4 py-3 text-sm rounded-lg w-full text-left transition-colors ${
                      activeTab === item.id
                        ? "bg-white text-gray-800 shadow-sm"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => handleTabChange(item.id)}
                  >
                    <span className={`mr-3 ${activeTab === item.id ? "text-blue-600" : "text-gray-500"}`}>
                      {item.icon}
                    </span>
                    {item.name}
                  </button>
                </li>
              ))}
              
              {/* Light/Dark mode toggle */}
              <li>
                <button 
                  className="flex items-center px-4 py-3 text-sm text-gray-700 w-full rounded-lg hover:bg-gray-100 text-left transition-colors"
                  onClick={toggleDarkMode}
                >
                  <span className="mr-3 text-gray-500">
                    {darkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
                  </span>
                  {darkMode ? "Light Mode" : "Dark Mode"}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Mobile bottom navigation bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-lg">
        <div className="flex justify-around">
          {/* Show only first 3 main items to make room for settings and theme toggle */}
          {mainItems.slice(0, 4).map((item) => (
            <button
              key={item.id}
              className={`flex flex-col items-center justify-center py-2 px-1 flex-1 ${
                activeTab === item.id ? "text-blue-600" : "text-gray-500"
              }`}
              onClick={() => handleTabChange(item.id)}
            >
              <span className="mb-1">{item.icon}</span>
              <span className="text-xs truncate">{item.name}</span>
            </button>
          ))}
          
          {/* Settings button */}
          {bottomItems.map((item) => (
            <button
              key={item.id}
              className={`flex flex-col items-center justify-center py-2 px-1 flex-1 ${
                activeTab === item.id ? "text-blue-600" : "text-gray-500"
              }`}
              onClick={() => handleTabChange(item.id)}
            >
              <span className="mb-1">{item.icon}</span>
              <span className="text-xs truncate">{item.name}</span>
            </button>
          ))}
          
          {/* Light/Dark mode toggle */}
          {/* <button
            className="flex flex-col items-center justify-center py-2 px-1 flex-1 text-gray-500"
            onClick={toggleDarkMode}
          >
            <span className="mb-1">
              {darkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
            </span>
            <span className="text-xs truncate">{darkMode ? "Light" : "Dark"}</span>
          </button> */}
        </div>
      </div>
    </>
  );
};

export default Navigation;