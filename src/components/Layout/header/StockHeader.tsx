import { useState } from "react";
import { customMarketZoneNavbarTheme } from "@/utils/FlowBiteCustomThemes";
import { Navbar } from "flowbite-react";
import StockNavBarLinks from "@/utils/StockNavBarLinks";

export default function StockHeader() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <Navbar fluid theme={customMarketZoneNavbarTheme}>
        <Navbar.Brand href="/">
          <img
            src="assets/images/favicon.png"
            className="mr-3 h-8 sm:h-11"
            alt="Predict.if Logo"
          />
        </Navbar.Brand>
        <div className="flex md:order-2">
          <Navbar.Toggle />
        </div>
        <Navbar.Collapse>
          <StockNavBarLinks />
        </Navbar.Collapse>
      </Navbar>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out z-50`}
      >
        <div className="p-4">
          <button
            className="text-gray-500 focus:outline-none"
            onClick={toggleSidebar}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
          <StockNavBarLinks />
        </div>
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
}
