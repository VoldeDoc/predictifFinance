
import { customNavbarTheme } from "@/utils/FlowBiteCustomThemes";
import NavBarLinks from "@/components/Ui/navbarLinks";
import { Button, Navbar } from "flowbite-react";
import { Link } from "react-router-dom";
import AdSlider from "./adSlider";

export default function Header() {
  return (
    <>
      <AdSlider/>
      <Navbar fluid theme={customNavbarTheme} className="bg-white">
        <Navbar.Brand href="/">
          <img src="assets/images/landingPage/favicon.png" className="mr-3 h-8 sm:h-11" alt="Predict.if Logo" />
          <span className="self-center whitespace-nowrap text-3xl font-bold text-[#002072] dark:text-white">Predict.if</span>
        </Navbar.Brand>
        <div className="flex md:order-2">
          <Link to="/auth/signin"><Button color="dark">Login / Register</Button></Link>
          <Navbar.Toggle />
        </div>
        <Navbar.Collapse>
          <NavBarLinks />
        </Navbar.Collapse>
      </Navbar>
    </>
  );
}
  

