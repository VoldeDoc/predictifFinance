import { AuthLayout } from "../Layout/layout";
import BalanceSummary from "./Tools/Balance";
import PortfolioAnalyticsWatchList from "./Tools/PortfolioAnalyticsWatchList";
import StockCardCarousel from "./Tools/StockCardCarousel";

const Dashboard = () => {
  return (
    <AuthLayout>
      <>
        <div className="container">
          <StockCardCarousel />
          <BalanceSummary />
          <PortfolioAnalyticsWatchList />
        </div>
      </>
    </AuthLayout>
  );
};

export default Dashboard;
