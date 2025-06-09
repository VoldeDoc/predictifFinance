import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Scrollbar, A11y, Virtual } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";

import { FaChevronLeft, FaChevronRight, FaPlus, FaCheck } from "react-icons/fa6";
import { StockAreaChart } from "@/components/Chart/StockAreaChart";
import UseFinanceHook from "@/hooks/UseFinance";
import Modal from "./Modal";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export function generateRandomData(length: number, digits?: number): number[] {
  if (!digits) digits = 3;
  const min = Math.pow(10, digits - 1);
  const max = Math.pow(10, digits) - 1;
  return Array.from(
    { length },
    () => Math.floor(Math.random() * (max - min + 1)) + min
  );
}

interface FollowedItem {
  id: string;
  fitem_id?: string;
  fitem_name: string;
  fitem_symbol: string;
  fitem_logo: string;
  fitem_type: string;
  fitem_description: string;
  chartData?: { x: number; y: number }[]; // added for real data
}

interface FinanceItem {
  id: number;
  idEn: string;
  name: string;
  symbol: string;
  type: string;
  description: string;
  logo: string;
  status: string;
  isSelected?: boolean;
  isAlreadyFollowed?: boolean;
}


const StockCardCarousel = () => {
  const [followedItems, setFollowedItems] = useState<FollowedItem[]>([]);
  const [availableItems, setAvailableItems] = useState<FinanceItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const { getFinanceItem, FollowFinanceItem, getItemFollowing, getChartData } = UseFinanceHook();
  const navigate = useNavigate();

  // Load followed items and their chart data on mount
  useEffect(() => {
    const loadFollowed = async () => {
      setLoading(true);
      try {
        const response = await getItemFollowing();
        let items: FollowedItem[] = [];
        if (response && Array.isArray(response)) {
          items = Array.isArray(response[0]) ? response[0] : response;
        } else if (response && typeof response === 'object') {
          items = [response];
        }
        // Fetch chart data for each symbol
        const now = Math.floor(Date.now() / 1000);
        const oneMonthAgo = now - 30 * 24 * 3600;
        const chartArrays = await Promise.all(
          items.map(item =>
            getChartData(item.fitem_symbol, "D", oneMonthAgo, now)
          )
        );
        // Attach chartData to items
        const itemsWithCharts = items.map((item, i) => ({
          ...item,
          chartData: chartArrays[i]
        }));
        setFollowedItems(itemsWithCharts);
      } catch (error) {
        console.error("Error loading followed items or charts:", error);
        setFollowedItems([]);
      } finally {
        setLoading(false);
      }
    };
    loadFollowed();
  }, []);

  // const fetchFollowedItems = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await getItemFollowing();
  //     console.log("Followed items response:", response);

  //     // Handle different response formats
  //     if (response && Array.isArray(response)) {
  //       if (response.length > 0 && Array.isArray(response[0])) {
  //         // If response is an array of arrays
  //         setFollowedItems(response[0]);
  //       } else {
  //         // If response is a flat array
  //         setFollowedItems(response);
  //       }
  //     } else if (response && typeof response === 'object' && !Array.isArray(response)) {
  //       // If response is a single object, wrap it in an array
  //       setFollowedItems([response]);
  //     } else {
  //       setFollowedItems([]);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching followed items:", error);
  //     setFollowedItems([]);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchAvailableItems = async () => {
    setLoading(true);
    try {
      const response = await getFinanceItem();
      let items: FinanceItem[] = [];
      if (Array.isArray(response)) {
        items = Array.isArray(response[0]) ? response[0] : response;
      } else if (response && typeof response === 'object') {
        const data = (response as any).data || response;
        items = Array.isArray(data) ? data : [data];
      }
      const alreadyIds = followedItems.map(item =>
        String(item.fitem_id || item.id).toLowerCase()
      );
      setAvailableItems(
        items.map(item => ({
          ...item,
          isSelected: false,
          isAlreadyFollowed: alreadyIds.includes(String(item.id).toLowerCase())
        }))
      );
      setSelectedItems([]);
    } catch (error) {
      console.error("Error fetching available items:", error);
      setAvailableItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    fetchAvailableItems();
    setIsModalOpen(true);
  };

  const handleItemSelection = (id: string, isAlreadyFollowed: boolean) => {
    if (!id || isAlreadyFollowed) return;
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleFollowItems = async () => {
    if (selectedItems.length === 0) return;
    setLoading(true);
    try {
      await toast.promise(
        FollowFinanceItem({ item: selectedItems.join(',') }),
        {
          pending: "Following items...",
          success: {
            render({ data }) {
              // data is unknown, so cast to string (or ReactNode)
              return <div>{String(data)}</div>;
            }
          },
          error: {
            render({ data }) {
              return <div>{String(data)}</div>;
            }
          }
        }
      );
      // Reload followed list
      const newList = await getItemFollowing();
      setFollowedItems(Array.isArray(newList) ? newList as FollowedItem[] : [newList as FollowedItem]);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error following items:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">My Stocks</h1>
        <div className="flex space-x-3">
          <button
            onClick={() => navigate("/strategies")}
            className="bg-[#6425fe] text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <FaPlus size={14} />
            <span>Create Strategy</span>
          </button>
          <button
            onClick={handleOpenModal}
            className="bg-[#6425fe] text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <FaPlus size={14} />
            <span>Follow Stocks</span>
          </button></div>
      </div>

      <div className="w-full bg-white p-7 rounded-lg mt-7 relative">
        {loading && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#6425fe]"></div>
          </div>
        )}

        {followedItems.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 mb-4">You're not following any stocks yet.</p>
            <button
              onClick={handleOpenModal}
              className="bg-[#6425fe] text-white px-4 py-2 rounded-lg"
            >
              Start Following Stocks
            </button>
          </div>
        ) : (
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
              300: { slidesPerView: 1 },
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 4 },
            }}
            className="mySwiper"
          >
            {followedItems.map((item, index) => {
              const changeVal = item.chartData?.length
                ? item.chartData[item.chartData.length - 1].y - item.chartData[0].y
                : 0;
              const isPositive = changeVal >= 0;

              let bgColor = "bg-[#a6f7e2]";
              let textColor: string | undefined;
              if (item.fitem_type === "crypto") bgColor = "bg-yellow-200";
              else if (item.fitem_symbol.includes("MS")) {
                bgColor = "bg-purple-400";
                textColor = "text-white";
              } else if (index % 5 === 3) bgColor = "bg-[#c7ffa5]";
              else if (index % 5 === 4) bgColor = "bg-pink-200";

              const chartData = item.chartData || [];

              return (
                <SwiperSlide key={item.id || index} virtualIndex={index} className="flex">
                  <div 
                  onClick={() =>
                    navigate(`/analysis/stock_details?symbol=${item.fitem_symbol}`)
                  }
                  title="Tap to view details"
                  className={`p-4 rounded-lg shadow-lg ${bgColor} w-full h-full cursor-pointer`}>
                    <div className="flex flex-grow justify-between items-center mb-3">
                      <div className="flex justify-between gap-2 items-center">
                        <img
                          src={item.fitem_logo || "assets/images/stocks/default.png"}
                          alt={`${item.fitem_name || 'Stock'} logo`}
                          className="w-8 h-8 object-contain"
                        />
                        <p className={`${textColor || ''} font-semibold text-lg text-nowrap truncate w-32`}>
                          {item.fitem_name || 'Unknown Stock'}
                        </p>
                      </div>
                      <div>
                        <p className={`${textColor ?? "text-gray-500"} text-sm`}>
                          {item.fitem_symbol || 'N/A'}
                        </p>
                        <p className={`font-bold text-sm ${isPositive ? "text-green-600" : "text-red-600"}`}>
                          {isPositive ? `+${changeVal.toFixed(2)}` : changeVal.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between mt-3 items-center gap-5">
                      <div>
                        <span className={`text-sm font-medium ${textColor ?? "text-gray-500"}`}>
                          Current Value
                        </span>
                        <p className={`${textColor ?? "text-gray-500"} font-bold text-2xl`}>
                          {chartData.length
                            ? `$${chartData[chartData.length - 1].y.toFixed(2)}`
                            : '-'}
                        </p>
                      </div>
                      <div className="">
                        <StockAreaChart
                          data={[{ name: item.fitem_name, data: chartData }]}
                          color={textColor === "text-white" ? "#ffffff" : undefined}
                        />
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        )}

        {followedItems.length > 0 && (
          <>
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
          </>
        )}
      </div>

      {/* Follow Items Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Follow Stocks"
      >
        <div className="p-4">
          <p className="text-gray-600 mb-4">
            Select the stocks you want to follow:
          </p>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#6425fe]"></div>
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto">
              {availableItems.length === 0 ? (
                <p className="text-center text-gray-500 py-4">No stocks available to follow</p>
              ) : (
                availableItems.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center border-b border-gray-100 py-3 ${item.isAlreadyFollowed ? 'bg-gray-50 opacity-75 pointer-events-none' : ''
                      }`}
                    onClick={(e) => {
                      if (item.isAlreadyFollowed) {
                        e.preventDefault();
                        e.stopPropagation();
                      }
                    }}
                  >
                    {item.isAlreadyFollowed ? (
                      <div className="h-5 w-5 flex items-center justify-center rounded bg-green-500 text-white">
                        <FaCheck size={10} />
                      </div>
                    ) : (
                      <input
                        type="checkbox"
                        id={`item-${item.id}`}
                        checked={selectedItems.includes(String(item.id))}
                        onChange={() => handleItemSelection(String(item.id), !!item.isAlreadyFollowed)}
                        className="h-5 w-5 text-[#6425fe] rounded focus:ring-[#6425fe]"
                      />
                    )}
                    <label
                      htmlFor={item.isAlreadyFollowed ? undefined : `item-${item.id}`}
                      className={`flex items-center ml-3 ${item.isAlreadyFollowed ? 'cursor-not-allowed text-gray-500' : 'cursor-pointer'
                        } w-full`}
                    >
                      <img
                        src={item.logo || "assets/images/stocks/default.png"}
                        alt={`${item.name} logo`}
                        className="w-8 h-8 object-contain mr-3"
                      />
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <div className="flex items-center">
                          <p className="text-sm text-gray-500 mr-2">{item.symbol}</p>
                          {item.isAlreadyFollowed && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">Already following</span>
                          )}
                        </div>
                      </div>
                    </label>
                  </div>
                ))
              )}
            </div>
          )}

          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handleFollowItems}
              disabled={loading || selectedItems.length === 0}
              className="px-4 py-2 bg-[#6425fe] text-white rounded-md disabled:opacity-50"
            >
              {loading ? "Processing..." : "Follow Selected"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default StockCardCarousel;