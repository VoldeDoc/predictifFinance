import { Tabs } from "flowbite-react";
import { FaChevronRight } from "react-icons/fa6";
import { StockAreaChart } from "@/components/Chart/StockAreaChart";
import { generateRandomData } from "./StockCardCarousel";
import AreaChart from "@/components/Chart/AreaChart";
import { customPillsTabTheme } from "@/utils/FlowBiteCustomThemes";

const FinancialOverview = () => {
  const nasdaqData = {
    name: "NASDAQ",
    data: generateRandomData(7, 5), // Generate 7 random 5-digit numbers
  };

  const sseData = {
    name: "SSE",
    data: generateRandomData(7, 5), // Generate 7 random 5-digit numbers
  };

  const euronextData = {
    name: "Euronext",
    data: generateRandomData(7, 5), // Generate 7 random 5-digit numbers
  };

  const bseData = {
    name: "BSE",
    data: generateRandomData(7, 5), // Generate 7 random 5-digit numbers
  };



  return (
    <div className="container mx-auto p-4 row gap-5 justify-center">
      {/* Balance and Invested Section */}
      <div className="col-xxl-3 bg-white rounded-lg p-6 shadow-lg">
        <p className="text-lg font-medium">Balance</p>
        <div className="row gap-2 items-center mb-4">
          <p className="text-3xl col-xl-8 bg-[#6425fe] py-3 pl-5 pr-16 rounded-xl text-white">
            $14,032.56
          </p>
          <p className="text-green-600 col-xl-3 bg-green-100 py-4 text-lg rounded-md font-semibold ">
            +5.63%
          </p>
        </div>
        <p className="text-lg font-medium mt-5">Invested</p>
        <div className="flex justify-between items-center mt-2 mb-4 rounded-lg text-white py-3 bg-gray-800">
          <p className="text-3xl ml-6">$7,532.21</p>
          <button className="bg-[#6425fe] text-white p-4 rounded-lg mr-2">
            <FaChevronRight />
          </button>
        </div>
        <div>
          <p className="text-md text-gray-500 font-semibold">Top Stock</p>
          <div className="flex flex-grow justify-between items-center mb-3 mt-5">
            <div className="flex justify-between gap-2 items-center">
              <img src="assets/images/stocks/tesla2.png" alt="stock logo" />
              <p className="font-semibold text-lg text-nowrap truncate w-32">
                Tesla Inc
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium">TSLA</p>
              <p className="text-sm text-green-600">+17.63</p>
            </div>
          </div>
          <div className="row flex-grow justify-between items-center mb-3">
            <div className="col-lg-4">
              <p className="text-gray-400 text-sm font-medium">
                Invested Value
              </p>
              <p className="text-lg font-semibold">$29.34</p>
            </div>
            <div className="col-lg-4">
              <p className="text-gray-400 text-sm font-medium">Current Value</p>
              <p className="text-lg font-semibold">$34.56</p>
            </div>
            <div className="col-lg-4">
              <StockAreaChart
                data={[
                  {
                    name: "Tesla Inc",
                    data: generateRandomData(9, 3), // Generate 9 random 3-digit numbers
                  },
                ]}
                color="#77b900"
              />
            </div>
          </div>
        </div>
      </div>

      {/* NASDAQ Chart Section */}
      <div className="col-xxl-5 bg-white rounded-lg p-6 shadow-lg">
        <Tabs aria-label="Pills" variant="pills" theme={customPillsTabTheme}>
          <Tabs.Item active title="NASDAQ">
            <div className="flex gap-8 mb-4 flex-wrap">
              <button className="text-[#6425fe] text-xl">1D</button>
              <span className="text-gray-400 text-2xl"> | </span>
              <button className="text-gray-400 text-xl">5D</button>
              <span className="text-gray-400 text-2xl"> | </span>
              <button className="text-gray-400 text-xl">1M</button>
              <span className="text-gray-400 text-2xl"> | </span>
              <button className="text-gray-400 text-xl">6M</button>
              <span className="text-gray-400 text-2xl"> | </span>
              <button className="text-gray-400 text-xl">1Y</button>
            </div>
            <AreaChart data={[nasdaqData]} height={410} />
            <div className="row flex-grow justify-between items-center mb-3">
              <div className="col-lg-6">
                <p className="text-gray-400 text-md font-medium">High</p>
                <p className="text-lg font-semibold">11,691.89</p>
              </div>
              <div className="col-lg-6">
                <p className="text-gray-400 text-md font-medium">
                  Prev Close (Avr 28 Days)
                </p>
                <p className="text-lg font-semibold">11,512.41</p>
              </div>
            </div>
            <div className="row flex-grow justify-between items-center mt-7 mb-3">
              <div className="col-lg-6">
                <p className="text-gray-400 text-md font-medium">Low</p>
                <p className="text-lg font-semibold">11,470.47</p>
              </div>
              <div className="col-lg-6">
                <p className="text-gray-400 text-md font-medium">Open</p>
                <p className="text-lg font-semibold">11,690.11</p>
              </div>
            </div>
          </Tabs.Item>
          <Tabs.Item title="SSE">
            <div className="flex gap-8 mb-4 flex-wrap">
              <button className="text-[#6425fe] text-xl">1D</button>
              <span className="text-gray-400 text-2xl"> | </span>
              <button className="text-gray-400 text-xl">5D</button>
              <span className="text-gray-400 text-2xl"> | </span>
              <button className="text-gray-400 text-xl">1M</button>
              <span className="text-gray-400 text-2xl"> | </span>
              <button className="text-gray-400 text-xl">6M</button>
              <span className="text-gray-400 text-2xl"> | </span>
              <button className="text-gray-400 text-xl">1Y</button>
            </div>
            <AreaChart data={[sseData]} color="#6425fe" height={410} />
            <div className="row flex-grow justify-between items-center mb-3">
              <div className="col-lg-6">
                <p className="text-gray-400 text-md font-medium">High</p>
                <p className="text-lg font-semibold">11,691.89</p>
              </div>
              <div className="col-lg-6">
                <p className="text-gray-400 text-md font-medium">
                  Prev Close (Avr 28 Days)
                </p>
                <p className="text-lg font-semibold">11,512.41</p>
              </div>
            </div>
            <div className="row flex-grow justify-between items-center mt-7 mb-3">
              <div className="col-lg-6">
                <p className="text-gray-400 text-md font-medium">Low</p>
                <p className="text-lg font-semibold">11,470.47</p>
              </div>
              <div className="col-lg-6">
                <p className="text-gray-400 text-md font-medium">Open</p>
                <p className="text-lg font-semibold">11,690.11</p>
              </div>
            </div>
          </Tabs.Item>
          <Tabs.Item title="Euronext">
            <div className="flex gap-8 mb-4 flex-wrap">
              <button className="text-[#6425fe] text-xl">1D</button>
              <span className="text-gray-400 text-2xl"> | </span>
              <button className="text-gray-400 text-xl">5D</button>
              <span className="text-gray-400 text-2xl"> | </span>
              <button className="text-gray-400 text-xl">1M</button>
              <span className="text-gray-400 text-2xl"> | </span>
              <button className="text-gray-400 text-xl">6M</button>
              <span className="text-gray-400 text-2xl"> | </span>
              <button className="text-gray-400 text-xl">1Y</button>
            </div>
            <AreaChart data={[euronextData]} color="#6570ff" height={410} />
            <div className="row flex-grow justify-between items-center mb-3">
              <div className="col-lg-6">
                <p className="text-gray-400 text-md font-medium">High</p>
                <p className="text-lg font-semibold">11,691.89</p>
              </div>
              <div className="col-lg-6">
                <p className="text-gray-400 text-md font-medium">
                  Prev Close (Avr 28 Days)
                </p>
                <p className="text-lg font-semibold">11,512.41</p>
              </div>
            </div>
            <div className="row flex-grow justify-between items-center mt-7 mb-3">
              <div className="col-lg-6">
                <p className="text-gray-400 text-md font-medium">Low</p>
                <p className="text-lg font-semibold">11,470.47</p>
              </div>
              <div className="col-lg-6">
                <p className="text-gray-400 text-md font-medium">Open</p>
                <p className="text-lg font-semibold">11,690.11</p>
              </div>
            </div>
          </Tabs.Item>
          <Tabs.Item title="BSE">
            <div className="flex gap-8 mb-4 flex-wrap">
              <button className="text-[#6425fe] text-xl">1D</button>
              <span className="text-gray-400 text-2xl"> | </span>
              <button className="text-gray-400 text-xl">5D</button>
              <span className="text-gray-400 text-2xl"> | </span>
              <button className="text-gray-400 text-xl">1M</button>
              <span className="text-gray-400 text-2xl"> | </span>
              <button className="text-gray-400 text-xl">6M</button>
              <span className="text-gray-400 text-2xl"> | </span>
              <button className="text-gray-400 text-xl">1Y</button>
            </div>
            <AreaChart data={[bseData]} color="#9425fe" height={410} />
            <div className="row flex-grow justify-between items-center mb-3">
              <div className="col-lg-6">
                <p className="text-gray-400 text-md font-medium">High</p>
                <p className="text-lg font-semibold">11,691.89</p>
              </div>
              <div className="col-lg-6">
                <p className="text-gray-400 text-md font-medium">
                  Prev Close (Avr 28 Days)
                </p>
                <p className="text-lg font-semibold">11,512.41</p>
              </div>
            </div>
            <div className="row flex-grow justify-between items-center mt-7 mb-3">
              <div className="col-lg-6">
                <p className="text-gray-400 text-md font-medium">Low</p>
                <p className="text-lg font-semibold">11,470.47</p>
              </div>
              <div className="col-lg-6">
                <p className="text-gray-400 text-md font-medium">Open</p>
                <p className="text-lg font-semibold">11,690.11</p>
              </div>
            </div>
          </Tabs.Item>
        </Tabs>
      </div>

      {/* Snapshot Section */}
      <div className="col-xxl-3 bg-white rounded-lg p-6 shadow-lg">
        <p className="font-bold text-lg mb-4">Snapshot</p>
        <div className="flex justify-between mb-2">
          <p>Prev Close</p>
          <p>12,051.48</p>
        </div>
        <div className="flex justify-between mb-2">
          <p>Open</p>
          <p>12,000.21</p>
        </div>
        <div className="relative mt-4 mb-2">
          <div className="w-full bg-gray-200 h-1"></div>
          <div
            className="absolute left-[40%] bg-purple-600 h-1 w-1 rounded-full"
            style={{ left: "50%" }} // Adjust position dynamically
          ></div>
        </div>
        <p className="text-center mb-4">12,166.60</p>
        <div className="flex justify-between mb-2">
          <p>52 Week Low</p>
          <p>10,440.64</p>
        </div>
        <div className="flex justify-between mb-2">
          <p>52 Week High</p>
          <p>15,265.42</p>
        </div>
        <div className="flex justify-between mt-6">
          <div>
            <p>Trade Time</p>
            <p>05:16 PM</p>
          </div>
          <div>
            <p>Trade Date</p>
            <p>01/27/23</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialOverview;
