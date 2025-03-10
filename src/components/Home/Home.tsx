import MainLayout from "@/components/Layout/MainLayout";
import HomeCarousel from "./Tools/HeroCarousel";
import CompanyBrand from "@/components/Ui/companyBrand";
import { useState } from "react";
// import BrandCarousel from "../tool/brandCarousel";

export default function Home() {
  const [bgColor, setBgColor] = useState("#4fb7ef");

  const changeBackgroundColor = () => {
    const colors = ["#4fb7ef", "#0020721A", "#002072"]; // Add your desired colors here
    const currentColorIndex = colors.indexOf(bgColor);
    const nextColorIndex = (currentColorIndex + 1) % colors.length;
    setBgColor(colors[nextColorIndex]);
  };
  return (
    <MainLayout>
      <section className="mt-3 ">
        <div className="flex flex-col gap-10 items-center sm:flex-row sm:h-[35rem] h-[45rem]">
          {/* Text Section */}
          <div className="w-full sm:w-1/2 text-center sm:text-left container">
            <p className="text-3xl sm:text-4xl font-light">Experience AI</p>
            <h1 className="font-bold text-4xl sm:text-5xl mt-2">
              For Accurate Financial
            </h1>
            <p className="text-2xl sm:text-3xl font-normal">Decisions..</p>
            <p className="mt-3 text-lg sm:text-base">
              <strong>Predit.if finance</strong> provides a comprehensive
              platform tailored for professional investors, offering
              unparalleled global coverage of securities and asset classes.
            </p>
            <button className="mt-5 bg-blue-600 hover:bg-blue-700 transition text-white px-4 py-2 rounded-full">
              Learn More
            </button>
          </div>

          {/* Carousel Section */}
          <div className="w-full sm:w-1/2 h-full">
            <HomeCarousel />
          </div>
        </div>
      </section>

      <section style={{ backgroundColor: bgColor }}>
        <div className="container mx-auto px-6">
          <div className="row items-center">
            <p className="!mt-10 text-center sm:text-start col-sm-2 text-lg font-semibold">
              Trusted by thousands
              <p>of companies worldwide</p>
            </p>
            <span className="col-sm-10">
              <CompanyBrand />
            </span>
          </div>

          <div className="row !mt-28 mx-auto gap-32">
            <div className="col-xl-3">
              <h3 className="uppercase text-white font-semibold text-xl">
                Your Advantage
              </h3>
              <hr className="w-80 border-t-2 border-black my-4 !overflow-hidden " />
              <h2 className="text-4xl sm:text-5xl text-white font-bold mt-5">
                Performance. Efficiency. Speed.
              </h2>
              <img
                src="assets/images/landingPage/phone-chart.png"
                alt="Phone Chart"
                className="w-3/5 sm:w-full h-auto mx-auto mt-10"
              />
            </div>

            <div className="col-xl-7 my-14">
              <p className="text-white text-lg">
                Leverage the combined power of IBM PREDICT.IF Finance and our
                proprietary AI models to swiftly analyse vast streams of news
                articles, alternative data sources, and traditional financial
                data. Unlock actionable insights at lightning speed, while
                slashing both data and technology expenses. Stay at the
                forefront of your industry consistently, with unparalleled
                efficiency and accuracy.
              </p>

              <div className="row !mt-16 gap-7">
                <span className="relative col-lg-2">
                  <svg
                    className="absolute top-2 left-7"
                    width="95"
                    height="95"
                    viewBox="0 0 95 95"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="47.5"
                      cy="47.5"
                      r="46.5"
                      fill="white"
                      stroke="white"
                      strokeWidth="2"
                    />
                    <text
                      x="50%"
                      y="50%"
                      textAnchor="middle"
                      dy=".3em"
                      fontSize="25"
                      fill="black"
                    >
                      1
                    </text>
                  </svg>
                  <svg
                    width="101"
                    height="101"
                    viewBox="0 0 101 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="50.5"
                      cy="50.5"
                      r="49.5"
                      stroke="white"
                      strokeWidth="2"
                    />
                  </svg>
                </span>

                <div className="text-white col-lg-8 mt-7">
                  <h2 className="text-4xl sm:text-5xl font-bold">
                    Performance. Efficiency. Speed.
                  </h2>
                  <p className="mt-10 text-lg font-semibold text-black">
                    Leverage the combined power of IBM PREDICT.IF Finance and
                    our proprietary AI models to swiftly analyse vast streams of
                    news articles, alternative data sources.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={changeBackgroundColor}
            className="mt-10 px-4 py-2 bg-white text-black font-semibold rounded"
          >
            Change Background Color
          </button>
        </div>
      </section>

      <section className="container mt-28">
        <div className="mx-auto px-6 row items-center">
          <div className="col-xl-4 flex justify-center text-center items-center">
            <img
              src="assets/images/landingPage/credit-cards.png"
              alt="credit cards"
              className="w-3/5 h-auto"
              width={80}
              height={80}
            />
          </div>

          <div className="col-xl-8 mt-14">
            <div className="row gap-7">
              <span className="relative col-lg-2">
                <svg
                  className="absolute top-2 left-7"
                  width="95"
                  height="95"
                  viewBox="0 0 95 95"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="47.5"
                    cy="47.5"
                    r="46.5"
                    fill="#0C21C1"
                    stroke="#0C21C1"
                    strokeWidth="2"
                  />
                  <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dy=".3em"
                    fontSize="25"
                    fill="white"
                  >
                    2
                  </text>
                </svg>
                <svg
                  width="101"
                  height="101"
                  viewBox="0 0 101 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="50.5"
                    cy="50.5"
                    r="49.5"
                    stroke="#0C21C1"
                    strokeWidth="2"
                  />
                </svg>
              </span>

              <div className="col-lg-8 mt-7">
                <h2 className="text-3xl sm:text-5xl font-bold text-black">
                  Performance. Efficiency. Speed.
                </h2>
                <p className="mt-10 font-semibold text-lg text-black">
                  Leverage the combined power of IBM PREDICT.IF Finance and our
                  proprietary AI models to swiftly analyze vast streams of news
                  articles, alternative data sources, and more.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10 overflow-hidden">
        <div className="row">
          <span className="!p-6 sm:!p-20 bg-black-500 col-xl-6 h-auto">
            <h2 className="text-3xl sm:text-5xl font-bold text-white text-wrap">
              Performance. Efficiency. Speed.
            </h2>
            <p className="text-white mt-4 sm:mt-8 text-lg sm:text-xl text-wrap">
              Leverage the combined power of IBM PREDICT.IF Finance and our
              proprietary AI models to swiftly analyze vast streams of news
              articles and alternative data sources.
            </p>
            <span className="flex justify-between mt-6 sm:mt-10 text-white">
              <span className="col-sm-6">
                <p className="font-bold text-4xl sm:text-6xl">15%</p>
                <p className="text-sm sm:text-base">AI Prediction</p>
              </span>
              <span className="col-sm-6">
                <p className="font-bold text-4xl sm:text-6xl">40%</p>
                <p className="text-sm sm:text-base">On Finance</p>
              </span>
            </span>
          </span>

          <span className="bg-[#0c21c1] dark:bg-black col-xl-6 flex justify-center">
            <img
              src="assets/images/landingPage/earth.gif"
              alt="Earth"
              className="h-auto w-full object-cover"
            />
          </span>
        </div>
      </section>

      <section>
        <section className="container my-20">
          <h2 className="text-4xl text-[#0C21C1] font-bold mb-10">
            Top Finance Blogs
          </h2>
          <div className="flex flex-col sm:flex-row items-stretch">
            <div className="w-full sm:w-1/2 bg-[#ebeef3] p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">Trending News</h2>

              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="w-full sm:w-[32%]">
                  <img
                    src="assets/images/landingPage/race-horse.png"
                    alt="Race"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                </div>
                <div className="w-full sm:w-[68%]">
                  <span className="text-sm text-gray-500">
                    Race98 - 03 June 2023
                  </span>
                  <h3 className="text-lg font-bold truncate">
                    6-Year-Old Horse Dies at Belmont Park After Race Injury
                  </h3>
                  <p className="text-gray-600 truncate">
                    New York — A 6-year-old horse died after being injured in a
                    race at Belmont Park ahead of next week's
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="w-full sm:w-[32%]">
                  <img
                    src="assets/images/landingPage/cyclist.png"
                    alt="Cyclist"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                </div>
                <div className="w-full sm:w-[68%]">
                  <span className="text-sm text-gray-500">
                    Cycling - 03 June 2023
                  </span>
                  <h3 className="text-lg font-bold truncate">
                    Savilia Blunk Embraces Longer Season With World Cup
                  </h3>
                  <p className="text-gray-600 truncate">
                    Last year, Savilia Blunk took a more conservative approach
                    for her first season as an Elite Class athlete...
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="w-full sm:w-[32%]">
                  <img
                    src="assets/images/landingPage/boxing-arena.png"
                    alt="boxing-arena"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                </div>
                <div className="w-full sm:w-[68%]">
                  <span className="text-sm text-gray-500">
                    Boxing - 03 June 2023
                  </span>
                  <h3 className="text-lg font-bold truncate">
                    Ryan Garcia is fighting again, this time on social media
                  </h3>
                  <p className="text-gray-600 truncate">
                    Boxing star Ryan Garcia and his promoter, Hall of Fame
                    fighter Oscar De La Hoya, reignited their war of words
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full sm:w-1/2 relative flex-grow">
              <img
                src="assets/images/landingPage/sportsman.png"
                alt="Feature"
                className="w-full h-auto object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black-800 opacity-50"></div>
              <span className="py-1 px-3 text-2xl border text-white absolute top-2 left-2 sm:left-7 rounded">
                Cycling
              </span>
              <div className="absolute bottom-4 left-2 sm:bottom-8 sm:left-8 text-white">
                <span className="block text-lg mt-2">
                  Debits - 03 June 2023
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold mt-2 uppercase">
                  Discover the Member Benefits of USA Cycling!
                </h3>
              </div>
            </div>
          </div>
        </section>
      </section>
    </MainLayout>
  );
}
