import { NavbarLink } from "flowbite-react";
import { useLocation } from "react-router-dom";

function NavBarLinks() {
  const navLinks = [
    ["Trading", "/"],
    ["Investing", "/investing"],
    ["Top Markets", "/markets"],
    ["Education", "/education"],
    ["About us", "/about"],
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

export default NavBarLinks;
