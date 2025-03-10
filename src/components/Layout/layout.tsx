import {  ReactNode, useEffect, useState } from "react";


import { Sidebar } from "./sidebar/sidebar";
import { Header } from "./header/header";

type Props = {
  children: ReactNode;
};

export const AuthLayout = ({ children }: Props) => {
  const [showNav, setShowNav] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const handleScreenSize = () => {
    if (innerWidth <= 640) {
      setShowNav(false);
      setIsMobile(true);
    } else {
      setShowNav(true);
      setIsMobile(false);
    }
  };

  useEffect(() => {
    if (typeof window !== undefined) {
      addEventListener("resize", handleScreenSize);
    }

    return () => {
      removeEventListener("resize", handleScreenSize);
    };
  }, []);

  return (
    <>
      <Header showNav={showNav} setShowNav={setShowNav} />

      <Sidebar showNav={showNav} setShowNav={setShowNav} />

      <main
        className={` transition-all duration-[900ms] ${
          showNav && !isMobile ? "md:pl-[20%]" : "md:pl-20 pl-0"
        }`}
      >
        <div className={"responsive md:py-36  py-24  bg-[#FAFAFA]"}>
          {children}
        </div>
      </main>
    </>
  );
};
