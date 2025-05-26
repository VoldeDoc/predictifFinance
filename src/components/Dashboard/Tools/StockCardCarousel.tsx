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
  isAlreadyFollowed?: boolean; // Flag to track if already followed
}

const StockCardCarousel = () => {
  const [followedItems, setFollowedItems] = useState<FollowedItem[]>([]);
  const [availableItems, setAvailableItems] = useState<FinanceItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const { getFinanceItem, FollowFinanceItem, getItemFollowing } = UseFinanceHook();
  const navigate = useNavigate();
  useEffect(() => {
    fetchFollowedItems();
  }, []);

  const fetchFollowedItems = async () => {
    setLoading(true);
    try {
      const response = await getItemFollowing();
      console.log("Followed items response:", response);

      // Handle different response formats
      if (response && Array.isArray(response)) {
        if (response.length > 0 && Array.isArray(response[0])) {
          // If response is an array of arrays
          setFollowedItems(response[0]);
        } else {
          // If response is a flat array
          setFollowedItems(response);
        }
      } else if (response && typeof response === 'object' && !Array.isArray(response)) {
        // If response is a single object, wrap it in an array
        setFollowedItems([response]);
      } else {
        setFollowedItems([]);
      }
    } catch (error) {
      console.error("Error fetching followed items:", error);
      setFollowedItems([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableItems = async () => {
    setLoading(true);
    try {
      const response = await getFinanceItem();
      console.log("Available items response:", response);

      let items: FinanceItem[] = [];

      // Handle different response formats
      if (response) {
        if (Array.isArray(response)) {
          if (response.length > 0) {
            if (Array.isArray(response[0])) {
              // If response is an array of arrays
              items = response[0];
            } else {
              // If response is a flat array of objects
              items = response;
            }
          }
        } else if (typeof response === 'object') {
          // If response is an object with data
          const responseData = response.data || response;
          if (Array.isArray(responseData)) {
            items = responseData;
          } else {
            // Single item as object
            items = [responseData];
          }
        }
      }

      // Get IDs of items that are already followed - convert all to lowercase strings for comparison
      const alreadyFollowedIds = followedItems.map(item => {
        const id = item.fitem_id || String(item.id);
        return String(id).toLowerCase();
      });

      console.log("Already followed IDs:", alreadyFollowedIds);

      // Mark items that are already followed with more robust comparison
      const itemsWithSelection = items.map((item: FinanceItem) => {
        // Convert both IDs to lowercase strings for more reliable comparison
        const itemId = String(item.id).toLowerCase();
        const itemIdEn = item.idEn ? String(item.idEn).toLowerCase() : null;

        // Check if this item is already being followed
        const isAlreadyFollowed = !!(
          alreadyFollowedIds.includes(itemId) ||
          (itemIdEn && alreadyFollowedIds.includes(itemIdEn))
        );

        console.log(`Item ${item.name} (${item.id}): Already followed = ${isAlreadyFollowed}`);

        return {
          ...item,
          isSelected: false, // Don't preselect anything
          isAlreadyFollowed // New flag to track if already followed
        };
      });

      // Set the available items state
      setAvailableItems(itemsWithSelection);

      // Clear selected items - we don't want to preselect already followed items
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
    if (!id || isAlreadyFollowed) return; // Prevent selecting already followed items

    setSelectedItems(prev => {
      if (prev.includes(id)) {
        return prev.filter(itemId => itemId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleFollowItems = async () => {
    if (selectedItems.length === 0) {
      return;
    }

    setLoading(true);
    try {
      // Convert array to string - backend expects a string that it will explode
      const itemsToFollow = {
        item: selectedItems.join(',') // Convert array to comma-separated string
      };

      await toast.promise(
        FollowFinanceItem(itemsToFollow),
        {
          pending: "Following items...",
          success: {
            render({ data }) {
              return <div>{data as string}</div>;
            },
          },
          error: {
            render({ data }) {
              return <div>{data as string}</div>;
            },
          },
        }
      );

      // Refresh followed items
      await fetchFollowedItems();
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
            onClick={() => navigate("/strategies/create")}
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
              // Generate random chart data and determine styling
              const chartData = generateRandomData(12);
              // Generate a random change value to demonstrate UI
              const randomChange = (Math.random() * 10 - 5).toFixed(2);
              const isPositive = !randomChange.startsWith('-');

              // Determine background color based on stock type
              let bgColor = "bg-[#a6f7e2]"; // Default
              let textColor: string | undefined = undefined;

              // Assign different colors based on fitem_type or other properties
              if (item.fitem_type === "crypto") {
                bgColor = "bg-yellow-200";
              } else if (item.fitem_symbol?.includes("MS")) {
                bgColor = "bg-purple-400";
                textColor = "text-white";
              } else if (index % 5 === 3) {
                bgColor = "bg-[#c7ffa5]";
              } else if (index % 5 === 4) {
                bgColor = "bg-pink-200";
              }

              return (
                <SwiperSlide key={item.id || index} virtualIndex={index} className="flex">
                  <div className={`p-4 rounded-lg shadow-lg ${bgColor} w-full h-full`}>
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
                          {isPositive ? `+${randomChange}` : randomChange}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between mt-3 items-center gap-5">
                      <div>
                        <span className={`text-sm font-medium ${textColor ?? "text-gray-500"}`}>
                          Current Value
                        </span>
                        <p className={`${textColor ?? "text-gray-500"} font-bold text-2xl`}>
                          {`$${(Math.random() * 200 + 50).toFixed(2)}`}
                        </p>
                      </div>
                      <div className="">
                        <StockAreaChart
                          data={[{ name: item.fitem_name || 'Stock', data: chartData }]}
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