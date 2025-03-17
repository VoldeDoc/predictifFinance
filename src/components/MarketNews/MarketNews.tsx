import { useState } from "react";
import AllNews from "./AllNews";
import { AuthLayout } from "../Layout/layout";
// import StockMarketNews from "./TabContents/StockMarketNews";
// import CryptoNews from "./TabContents/CryptoNews";
// import TaxPlanningContent from "./TabContents/TaxPlanningContent";
// import RealEstateContent from "./TabContents/RealEstateContent";
// import RetirementContent from "./TabContents/RetirementContent";
// import SustainableInvestingContent from "./TabContents/SustainableInvestingContent";
// import InvestmentStrategiesContent from "./TabContents/InvestmentStrategiesContent";

export default function MarketNews(){
    const [activeTab, setActiveTab] = useState("All");
    
    const tabs = [
        "All",
        "Stock Market",
        "Cryptocurrency",
        "Tax Planning",
        "Real Estate Investment",
        "Retirement",
        "Sustainable Investing",
        "Investment Strategies"
    ];

    // Render appropriate component based on active tab
    const renderTabContent = () => {
        switch(activeTab) {
            case "All":
                return <AllNews />;
            // case "Stock Market":
            //     return <StockMarketNews />;
            // case "Cryptocurrency":
            //     return <CryptoNews />;
            // case "Tax Planning":
            //     return <TaxPlanningContent />;
            // case "Real Estate Investment":
            //     return <RealEstateContent />;
            // case "Retirement":
            //     return <RetirementContent />;
            // case "Sustainable Investing":
            //     return <SustainableInvestingContent />;
            // case "Investment Strategies":
            //     return <InvestmentStrategiesContent />;
            default:
                return <AllNews />;
        }
    }

    return (
       <AuthLayout>
            <div className="px-16 sm:px-8">
                <h1 className="text-2xl font-bold mb-6">Market News</h1>
                
                <div className="flex flex-col md:flex-row gap-5">
                    {/* Main content area - 70% width */}
                    <div className="w-full md:w-[70%]">
                        {/* Tab navigation within the main content area */}
                        <div className="flex flex-wrap gap-2 mb-6">
                            {tabs.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-4 py-2 rounded-full text-sm text-white transition-colors 
                                        ${activeTab === tab ? 'bg-blue-800' : 'bg-blue-500 hover:bg-blue-600'}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                        
                        {/* Tab content */}
                        {renderTabContent()}
                    </div>
                    
                    {/* Sidebar - 25% width */}
                    <div className="w-full md:w-[25%] bg-[#FBFBFC] rounded-lg shadow p-4">
                        <h2 className="text-lg font-semibold mb-4">Trending Tags</h2>
                        
                        <div className="space-y-4">
                            <div className="border-b pb-3">
                                <h3 className="font-medium">#Stock Market</h3>
                                <div className="flex justify-between mt-2">
                                    <span className="text-xs">Stock Market</span>
                                    <span className="text-xs">+120 articles </span>
                                </div>
                            </div>
                            
                            <div className="border-b pb-3">
                                <h3 className="font-medium">#CryptoInvesting</h3>
                                <div className="flex justify-between mt-2">
                                    <span className="text-xs">Cryptocurrency</span>
                                    <span className="text-xs">+120 articles </span>
                                </div>
                            </div>

                            <div className="border-b pb-3">
                                <h3 className="font-medium">#TaxSavings</h3>
                                <div className="flex justify-between mt-2">
                                    <span className="text-xs">Tax Planning</span>
                                    <span className="text-xs">+120 articles </span>
                                </div>
                            </div>
                            <div className="border-b pb-3">
                                <h3 className="font-medium">#RealEstate</h3>
                                <div className="flex justify-between mt-2">
                                    <span className="text-xs">Real Estate Investment</span>
                                    <span className="text-xs">+120 articles </span>
                                </div>
                            </div>
                            <div className="border-b pb-3">
                                <h3 className="font-medium">#RetirementPlanning</h3>
                                <div className="flex justify-between mt-2">
                                    <span className="text-xs">Retirement</span>
                                    <span className="text-xs">+120 articles </span>
                                </div>
                            </div>
                        </div>
                        
                        {/* Top Authors Section */}
                        <div className="mt-8">
                            <h2 className="text-lg font-semibold mb-4">Top Authors</h2>
                            
                            <div className="space-y-4">
                                {/* Author 1 */}
                                <div className="flex items-center justify-between border-t pt-3">
                                    <div className="flex items-center space-x-3">
                                        <img 
                                            src="https://randomuser.me/api/portraits/women/44.jpg" 
                                            alt="Emily Watkins" 
                                            className="h-10 w-10 rounded-full object-cover"
                                        />
                                        <div>
                                            <h4 className="text-sm font-medium">Emily Watkins</h4>
                                            <p className="text-xs text-gray-500">Investment Analyst</p>
                                        </div>
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        <span className="font-semibold">12.5k</span> followers
                                    </div>
                                </div>
                                
                                {/* Author 2 */}
                                <div className="flex items-center justify-between border-t pt-3">
                                    <div className="flex items-center space-x-3">
                                        <img 
                                            src="https://randomuser.me/api/portraits/men/32.jpg" 
                                            alt="Michael Chen" 
                                            className="h-10 w-10 rounded-full object-cover"
                                        />
                                        <div>
                                            <h4 className="text-sm font-medium">Michael Chen</h4>
                                            <p className="text-xs text-gray-500">Crypto Specialist</p>
                                        </div>
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        <span className="font-semibold">9.8k</span> followers
                                    </div>
                                </div>
                                
                                {/* Author 3 */}
                                <div className="flex items-center justify-between border-t pt-3">
                                    <div className="flex items-center space-x-3">
                                        <img 
                                            src="https://randomuser.me/api/portraits/women/68.jpg" 
                                            alt="Sarah Williams" 
                                            className="h-10 w-10 rounded-full object-cover"
                                        />
                                        <div>
                                            <h4 className="text-sm font-medium">Sarah Williams</h4>
                                            <p className="text-xs text-gray-500">Retirement Advisor</p>
                                        </div>
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        <span className="font-semibold">8.3k</span> followers
                                    </div>
                                </div>
                                
                                {/* Author 4 */}
                                <div className="flex items-center justify-between border-t pt-3">
                                    <div className="flex items-center space-x-3">
                                        <img 
                                            src="https://randomuser.me/api/portraits/men/75.jpg" 
                                            alt="Davidson Stone" 
                                            className="h-10 w-10 rounded-full object-cover"
                                        />
                                        <div>
                                            <h4 className="text-sm font-medium">Davidson Stone</h4>
                                            <p className="text-xs text-gray-500">Real Estate Expert</p>
                                        </div>
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        <span className="font-semibold">7.2k</span> followers
                                    </div>
                                </div>
                                
                                {/* Author 5 */}
                                <div className="flex items-center justify-between border-t pt-3">
                                    <div className="flex items-center space-x-3">
                                        <img 
                                            src="https://randomuser.me/api/portraits/women/55.jpg" 
                                            alt="Sandra Park" 
                                            className="h-10 w-10 rounded-full object-cover"
                                        />
                                        <div>
                                            <h4 className="text-sm font-medium">Sandra Park</h4>
                                            <p className="text-xs text-gray-500">Tax Strategist</p>
                                        </div>
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        <span className="font-semibold">6.9k</span> followers
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
       </AuthLayout>
    )
}