import { useEffect } from "react";
import MarketZoneHeader from "./header/MarketZoneHeader";

interface Props {
  children: React.ReactNode;
}

export default function MarketZonePageLayout({ children }: Props) {
  useEffect(() => {
    document.body.classList.add("bg-black");
    return () => {
      document.body.classList.remove("bg-black");
    };
  }, []);

  return (
    <>
      <MarketZoneHeader />
      <main className="container">{children}</main>
    </>
  );
}
