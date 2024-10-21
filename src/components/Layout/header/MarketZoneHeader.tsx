import { customMarketZoneNavbarTheme } from "@/utils/FlowBiteCustomThemes";
import { Navbar } from "flowbite-react";
import StockNavBarLinks from "@/utils/StockNavBarLinks";

export default function MarketZoneHeader() {
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
          <button className="text-black focus:outline-none bg-white rounded-full  px-3 font-semibold text-lg">
            Stocks
          </button>
          <Navbar.Toggle />
        </div>
        <Navbar.Collapse>
          <StockNavBarLinks />
        </Navbar.Collapse>
      </Navbar>
    </>
  );
}
