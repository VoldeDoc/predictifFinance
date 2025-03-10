import AreaChart from "@/components/Chart/AreaChart";
import { generateRandomData } from "./StockCardCarousel";
import { FaPlus } from "react-icons/fa6";

const PortfolioAnalyticsWatchList = () => {
  const stocks = [
    {
      img: "assets/images/stocks/amazon.png",
      name: "Amazon.com, Inc.",
      symbol: "AMZN",
      price: 102.24,
      change: +3.02,
    },
    {
      img: "assets/images/stocks/cocacola.png",
      name: "Coca-Cola Co",
      symbol: "KO",
      price: 60.49,
      change: -0.32,
    },
    {
      img: "assets/images/stocks/bmw.png",
      name: "Bayerische Motoren Werke AG",
      symbol: "BMW",
      price: 92.94,
      change: +0.59,
    },
    {
      img: "assets/images/stocks/microsoft.png",
      name: "Microsoft Corp",
      symbol: "MSFT",
      price: 248.16,
      change: +0.16,
    },
    {
      img: "assets/images/stocks/ups.png",
      name: "United Parcel Service, Inc.",
      symbol: "UPS",
      price: 182.09,
      change: +2.39,
    },
  ];


  const data = [
    {
      name: "Portfolio Analytics",
      data: generateRandomData(7, 5)
    }
  ];

  return (
    <div className="row justify-center gap-5 container mt-10">
      <div className="col-xxl-8 bg-white rounded-lg p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between gap-5">
          <h1 className="text-lg font-bold">Portfolio Analytics</h1>
          <div className="flex gap-8 flex-wrap mb-4">
            <button className="text-[#6425fe] text-xl border-b-2 border-black-500">1D</button>
            <span className="text-gray-400 text-2xl"> | </span>
            <button className="text-gray-400 text-xl">5D</button>
            <span className="text-gray-400 text-2xl"> | </span>
            <button className="text-gray-400 text-xl">1M</button>
            <span className="text-gray-400 text-2xl"> | </span>
            <button className="text-gray-400 text-xl">6M</button>
            <span className="text-gray-400 text-2xl"> | </span>
            <button className="text-gray-400 text-xl">1Y</button>
          </div>
        </div>
        <AreaChart data={data} height={500} />
      </div>
      <div className="bg-white p-6 shadow-lg rounded-lg col-xxl-3">
        <div className="flex justify-between">
          <h4 className="text-xl font-semibold mb-4">Watchlist</h4>
          <button className="bg-[#6425fe] text-white px-3 py-1 rounded-lg">
            <FaPlus />
          </button>
        </div>
        <ul className="space-y-4">
          {stocks.map((stock, index) => (
            <li key={index} className="flex justify-between items-center border-b space-y-5">
              <div className="flex gap-3">
                <img
                  src={stock.img}
                  alt={stock.name}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex flex-col">
                  <span className="text-gray-900 font-medium">{stock.name}</span>
                  <span className="text-gray-500 text-sm">{stock.symbol}</span>
                </div>
              </div>
              <div className="flex items-center flex-col space-x-4">
                <span className="text-gray-900 font-medium">
                  ${stock.price.toFixed(2)}
                </span>
                <span
                  className={`font-medium ${
                    stock.change > 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {stock.change.toFixed(2)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PortfolioAnalyticsWatchList;
