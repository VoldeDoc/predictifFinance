import { AuthLayout } from "../Layout/layout";
import BalanceSummary from "./Tools/Balance";
import PortfolioAnalyticsWatchList from "./Tools/PortfolioAnalyticsWatchlist";
import StockCardCarousel from "./Tools/StockCardCarousel";
// import StackBarChart from "../Chart/stack-bar";
// import SelectMonth from "../SelectMonth";
// import PastResultChat from "../Chart/PastResultChat";
// import Card from "../Ui/Card";
// import { useState } from "react";
// import GroupCard from "../Ui/GroupCard";
// import { IoEyeOutline } from "react-icons/io5";
// import { FaRegCalendarCheck } from "react-icons/fa";
// import {
//   BsCalendar2Date,
//   BsCaretDownFill,
//   BsCaretUpFill,
// } from "react-icons/bs";
// import "flatpickr/dist/themes/airbnb.css";
// import Flatpickr from "react-flatpickr";
// import moment from "moment-timezone";
// import { RootState } from "@/context/store/rootReducer";
// import { useSelector } from "react-redux";
// import FeaturesList from "../DashboardComponents/FeaturesList";

// const timeZone = "Africa/Lagos";
// const getGreeting = (timeZone: string) => {
//   const now = moment().tz(timeZone);
//   const hour = now.hour();

//   if (hour < 12) {
//     return "Good morning";
//   } else if (hour < 18) {
//     return "Good afternoon";
//   } else {
//     return "Good evening";
//   }
// };
// const today = new Date();
// const fiveDaysAhead = new Date();
// fiveDaysAhead.setDate(today.getDate() + 5);

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
