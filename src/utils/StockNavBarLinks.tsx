import { NavbarLink } from "flowbite-react";
import { useLocation } from "react-router-dom";

function StockNavBarLinks() {
  const navLinks = [
    ["Stock", "/stock"],
    ["News", "/news"],
    ["Nepse Chart", "/nepse-chart"],
    ["Market Zone", "/market-zone"],
  ];

  const pathname = useLocation().pathname;

  return (
    <>
      {navLinks.map(([title, link], index) => (
        <NavbarLink key={index} href={link} active={pathname === link}>
          {title}
        </NavbarLink>
      ))}
    </>
  );
}

export default StockNavBarLinks;
