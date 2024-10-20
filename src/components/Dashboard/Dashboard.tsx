import { AuthLayout } from "../Layout/layout";
import FinancialOverview from "./Tools/FinancialOverview";
import PortfolioAnalyticsWatchList from "./Tools/PortfolioAnalyticsWatchList";
import StockCardCarousel from "./Tools/StockCardCarousel";

const Dashboard = () => {
  return (
    <AuthLayout>
      <>
        <div className="container">
          <StockCardCarousel />
          <FinancialOverview />
          <PortfolioAnalyticsWatchList />
        </div>
      </>
    </AuthLayout>
  );
};

export default Dashboard;
