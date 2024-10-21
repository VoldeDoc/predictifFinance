import MarketZonePageLayout from "../Layout/MarketZoneLayout";
import MarketNews from "./Tools/MarketZoneNews";
import MarketZoneStock from "./Tools/MarketZoneStock";
import MarketTrends from "./Tools/MarketZoneTrending";

export default function MarketZone() {
  return (
    <MarketZonePageLayout>
      <div className="space-y-16">
        <MarketNews />
        <MarketTrends />
        <MarketZoneStock />
      </div>
    </MarketZonePageLayout>
  );
}
