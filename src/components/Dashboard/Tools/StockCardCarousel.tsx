import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Scrollbar, A11y, Virtual } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";

import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { StockAreaChart } from "@/components/Chart/StockAreaChart";

export function generateRandomData(length: number, digits?: number): number[] {
  if (!digits) digits = 3;
  const min = Math.pow(10, digits - 1);
  const max = Math.pow(10, digits) - 1;
  return Array.from(
    { length },
    () => Math.floor(Math.random() * (max - min + 1)) + min
  );
}

const StockCardCarousel = () => {
  const stockData = [
    {
      img: "assets/images/stocks/nvidia.png",
      name: "Nvidia",
      ticker: "NVDA",
      price: "$203.65",
      change: "+5.63",
      chartData: generateRandomData(12),
      bgColor: "bg-[#a6f7e2]",
    },
    {
      img: "assets/images/stocks/meta.png",
      name: "Meta",
      ticker: "META",
      price: "$151.74",
      change: "-4.44",
      chartData: generateRandomData(12),
      textColor: "text-white",
      bgColor: "bg-purple-400",
      chartColor: "#ffffff",
    },
    {
      img: "assets/images/stocks/tesla.png",
      name: "Tesla Inc",
      ticker: "TSLA",
      price: "$177.90",
      change: "+17.63",
      chartData: generateRandomData(12),
      bgColor: "bg-yellow-200",
    },
    {
      img: "assets/images/stocks/apple.png",
      name: "Apple Inc",
      ticker: "AAPL",
      price: "$145.93",
      change: "+23.41",
      chartData: generateRandomData(12),
      bgColor: "bg-[#c7ffa5]",
    },
    {
      img: "assets/images/stocks/amd.png",
      name: "Advanced Micro Devices, Inc.",
      ticker: "AMD",
      price: "$75.40",
      change: "+2.31",
      chartData: generateRandomData(12),
      bgColor: "bg-pink-200",
    },
  ];

  return (
    <>
      <h1 className="text-2xl font-bold text-gray-800">My Stocks</h1>
      <div className="w-full bg-white p-7 rounded-lg mt-7 relative">
        <Swiper
          modules={[Navigation, Virtual, Scrollbar, A11y]}
          spaceBetween={15}
          slidesPerView={4}
          scrollbar={{ draggable: true }}
          virtual
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          breakpoints={{
            300: {
              slidesPerView: 1,
            },
            640: {
              slidesPerView: 1,
            },
            768: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 4,
            },
          }}
          className="mySwiper"
        >
          {stockData.map((stock, index) => (
            <SwiperSlide key={index} virtualIndex={index} className="flex">
              <div
                className={`p-4 rounded-lg shadow-lg ${stock.bgColor} w-full h-full`}
              >
                <div className="flex flex-grow justify-between items-center mb-3">
                  <div className="flex justify-between gap-2 items-center">
                    <img src={stock.img} alt="stock logo" />
                    <p
                      className={`${stock.textColor} font-semibold text-lg text-nowrap truncate w-32`}
                    >
                      {stock.name}
                    </p>
                  </div>
                  <div>
                    <p
                      className={`${
                        stock.textColor ?? "text-gray-500"
                      } text-sm`}
                    >
                      {stock.ticker}
                    </p>
                    <p
                      className={`font-bold text-sm ${
                        stock.change.startsWith("-")
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      {stock.change}
                    </p>
                  </div>
                </div>
                <div className="flex justify-between mt-3 items-center gap-5">
                  <div>
                    <span
                      className={`text-sm font-medium ${
                        stock.textColor ?? "text-gray-500"
                      }`}
                    >
                      Current Value
                    </span>
                    <p
                      className={`${
                        stock.textColor ?? "text-gray-500"
                      } font-bold text-2xl`}
                    >
                      {stock.price}
                    </p>
                  </div>
                  <div className="">
                    <StockAreaChart
                      data={[
                        {
                          name: stock.name,
                          data: stock.chartData,
                        },
                      ]}
                      color={stock.chartColor}
                    />
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="swiper-button-prev absolute left-0 top-1/2 transform -translate-y-1/2 z-10 cursor-pointer">
          <button className="bg-[#6425fe] text-white p-4 rounded-lg">
            <FaChevronLeft />
          </button>
        </div>
        <div className="swiper-button-next absolute right-0 top-1/2 transform -translate-y-1/2 z-10 cursor-pointer">
          <button className="bg-[#6425fe] text-white p-4 rounded-lg">
            <FaChevronRight />
          </button>
        </div>
      </div>
    </>
  );
};

export default StockCardCarousel;
