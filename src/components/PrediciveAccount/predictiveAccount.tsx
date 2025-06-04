import { useState, useEffect } from "react";
import { AuthLayout } from "../Layout/layout";
import { 
  Bars3Icon
} from "@heroicons/react/24/outline";
import { AccountsComponent } from "./compon/AccountComponent";
import { SendComponent } from "./compon/SendComponent";
import Navigation from "./compon/NavigationComponent";
import { TransactionsComponent } from "./compon/TransactionComponent";
import { CardsComponent } from "./compon/CardsComponent";
import { SettingsComponent } from "./compon/SettingsCmponent";


const PredictiveAccount = () => {
  const [activeTab, setActiveTab] = useState("accounts");
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile on component mount and when resizing
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener for resize
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Toggle dark/light mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Handle menu item click
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    // Close sidebar on mobile after clicking an item
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  // Close sidebar
  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // Render appropriate component based on active tab
  const renderActiveTabContent = () => {
    switch (activeTab) {
      case "accounts":
        return <AccountsComponent />;
      case "send":
        return <SendComponent />;
      case "transactions":
        return <TransactionsComponent/>;
      case "cards":
        return <CardsComponent />;
      case "settings":
        return <SettingsComponent />;
      default:
        return <AccountsComponent />;
    }
  };

  return (
    <AuthLayout>
      <div className="relative flex h-full">
        {/* Mobile menu button */}
        <div className="md:hidden fixed top-4 left-4 z-40">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-md bg-white shadow-sm"
            aria-label="Toggle menu"
          >
            <Bars3Icon className="h-6 w-6 text-gray-700" />
          </button>
        </div>

        {/* Navigation component */}
        <Navigation
          activeTab={activeTab}
          darkMode={darkMode}
          sidebarOpen={sidebarOpen}
          isMobile={isMobile}
          handleTabChange={handleTabChange}
          toggleDarkMode={toggleDarkMode}
          closeSidebar={closeSidebar}
        />

        {/* Main content area */}
        <div className="flex-1 p-4 sm:p-6 bg-gray-50 w-full md:ml-0 ml-0 pt-16 md:pt-6 pb-20 md:pb-6">
          {renderActiveTabContent()}
        </div>
      </div>
    </AuthLayout>
  );
};

export default PredictiveAccount;