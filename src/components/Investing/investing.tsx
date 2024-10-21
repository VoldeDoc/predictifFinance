import MainLayout from "@/components/Layout/MainLayout";
import HomeCarousel from "../Home/Tools/HeroCarousel";
import CompanyBrand from "@/components/Ui/companyBrand";
import { ArrowRightIcon, ArrowTrendingUpIcon } from "@heroicons/react/24/solid";
import { FaRocket } from "react-icons/fa6";
import { BiLockOpenAlt } from "react-icons/bi";

export default function Investing() {
  return (
    <>
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

        <section className="container-fluid">
          <section className="bg-gray-200 my-9 py-9 space-y-5">
            <div className="container mx-auto px-6">
              <div className="row items-center">
                <p className="!mt-10 text-center sm:text-start sm:w-1/4 text-lg font-semibold">
                  Trusted by thousands
                  <span> of companies worldwide</span>
                </p>
                <span className="sm:w-3/4">
                  <CompanyBrand />
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-10">
                <div className="bg-blue-900 rounded-lg px-6 py-3 text-white shadow-lg">
                  <p className="py-7 font-bold">Classify</p>
                  <p>
                    Sort financial documents with precision using machine
                    learning.
                  </p>
                  <div className="flex space-x-5 py-5">
                    <p>Learn more</p>
                    <ArrowRightIcon className="w-5" />
                  </div>
                </div>

                <div className="bg-white rounded-lg px-6 py-3 text-gray-700 shadow-lg">
                  <p className="py-7 text-blue-900 font-bold">Capture</p>
                  <p>
                    Sort financial documents with precision using machine
                    learning.
                  </p>
                  <div className="flex space-x-5 py-5">
                    <p>Learn more</p>
                    <ArrowRightIcon className="w-5" />
                  </div>
                </div>

                <div className="bg-white rounded-lg px-6 py-3 text-gray-700 shadow-lg">
                  <p className="py-6 font-bold text-blue-900">Analyze</p>
                  <p>
                    Identify suspicious activity with tampering detection and
                    validation.
                  </p>
                  <div className="flex space-x-5 py-5">
                    <p>Learn more</p>
                    <ArrowRightIcon className="w-5" />
                  </div>
                </div>

                <div className="bg-white rounded-lg px-6 py-3 text-gray-700 shadow-lg">
                  <p className="py-6 font-bold text-blue-900">Detect</p>
                  <p>
                    Identify suspicious activity with tampering detection and
                    validation.
                  </p>
                  <div className="flex space-x-5 py-5">
                    <p>Learn more</p>
                    <ArrowRightIcon className="w-5" />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </section>

        <section className="container my-10">
          <div className="row">
            <div className="col-lg-6 pt-20">
              <h1 className="text-xl font-bold">YOUR ADVANTAGE</h1>
              <h2 className="text-3xl sm:text-5xl font-bold text-gray-700">
                Performance.
              </h2>
              <h2 className="text-3xl sm:text-5xl font-bold text-gray-700">
                Efficiency. Speed.
              </h2>
              <p className="text-gray-500 mt-4 sm:mt-8 text-lg sm:text-xl">
                Choose from 150+ cryptocurrencies
              </p>
              <div className="flex justify-between mt-6 sm:mt-10">
                <div className="col-sm-6">
                  <p className="font-bold text-4xl sm:text-6xl text-blue-800">
                    15%
                  </p>
                  <p className="text-sm sm:text-base">AI Prediction</p>
                </div>
                <div className="col-sm-6">
                  <p className="font-bold text-4xl sm:text-6xl text-blue-800">
                    40%
                  </p>
                  <p className="text-sm sm:text-base">On Finance</p>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <img
                src="assets/images/landingPage/phone-chart.png"
                alt=""
                height={400}
                width={400}
              />
            </div>

            <div className="col-lg-6">
              <div>
                <h1 className="text-xl font-bold text-blue-900">Benefits</h1>
                <h2 className="text-3xl sm:text-5xl font-bold text-gray-700">
                  Performance.
                </h2>
                <h2 className="text-3xl sm:text-5xl font-bold text-gray-700">
                  Efficiency. Speed.
                </h2>
              </div>
            </div>
            <div className="col-lg-6">
              <p className="text-lg font-medium">
                Leverage the combined power of IBM PREDICT.IF Finance and our
                proprietary AI models to swiftly analyse vast streams of news
                articles, alternative data sources, and traditional financial
                data. Unlock actionable insights at lightning speed, while
              </p>
            </div>
          </div>
        </section>

        <section className="my-20">
          <div className="container">
            <div className="row">
              <div className="col-lg-6">
                <div className="bg-[#0C21C140] px-5 pt-14 pb-14">
                  <div className="flex justify-center text-center pt-40">
                    <img src="/assets/images/landingPage/draw.png" alt="" />
                  </div>
                </div>
              </div>
              <div className="col-lg-6 space-y-7">
                <div className="bg-[#0C21C11A] px-4 py-14">
                  <div className="flex items-center space-x-6">
                    <div className="bg-blue-600 rounded-full text-center p-5 text-white flex items-center justify-center">
                      <FaRocket className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold pb-2">Best prices</p>
                      <p className="leading-relaxed">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Ut elit tellus, luctus nec ullamcorper mattis, pulvinar
                        dapibus leo.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-800 px-4 py-14 ">
                  <div className="flex items-center space-x-6">
                    <div className="bg-white rounded-full text-center p-5 text-dark-500 flex items-center justify-center">
                      <BiLockOpenAlt className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold pb-2 text-white">
                        Secured abd Insured
                      </p>
                      <p className="leading-relaxed text-white">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Ut elit tellus, luctus nec ullamcorper mattis, pulvinar
                        dapibus leo.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-800 px-4 py-14 ">
                  <div className="flex items-center space-x-6">
                    <div className="bg-white rounded-full text-center p-5 text-dark-500 flex items-center justify-center">
                      <ArrowTrendingUpIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold pb-2 text-white">
                        No trading fees
                      </p>
                      <p className="leading-relaxed text-white">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Ut elit tellus, luctus nec ullamcorper mattis, pulvinar
                        dapibus leo.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
                      New York — A 6-year-old horse died after being injured in
                      a race at Belmont Park ahead of next week's
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
    </>
  );
}
