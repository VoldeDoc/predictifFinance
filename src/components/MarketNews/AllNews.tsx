import { useNavigate } from "react-router-dom";

export default function AllNews() {
    const router = useNavigate();
    
    const handleArticleClick = () => {
        router('/market-news/details');
    };

    return (
        <div className="rounded-lg shadow p-4">
            <div className="flex flex-col lg:flex-row gap-6 pb-8">
                {/* Featured Articles Section */}
                <div className="w-full lg:w-2/3">
                    <h5 className="text-lg font-semibold pb-4 lg:pb-8">Featured Articles</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Featured Article 1 */}
                        <div 
                            className="space-y-3 pb-4 sm:pb-0 cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={handleArticleClick}
                        >
                            <img
                                src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                                alt="Market volatility chart"
                                className="w-full h-48 sm:h-36 object-cover rounded-lg"
                            />
                            <div className="flex flex-wrap items-center gap-4">
                                <h6 className="text-xs text-blue-800">Investment Strategies</h6>
                                <h6 className="text-xs text-gray-500">March 15, 2025</h6>
                            </div>
                            <h4 className="font-medium text-base sm:text-lg">Navigating Market Volatility in 2025</h4>
                            <p className="text-xs sm:text-sm text-gray-600">Explore expert strategies for safeguarding your portfolio against sudden market shifts.</p>
                            <div className="flex items-center space-x-3">
                                <img
                                    src="https://randomuser.me/api/portraits/women/44.jpg"
                                    alt="Emily Watkins"
                                    className="h-7 w-7 rounded-full object-cover"
                                />
                                <h6 className="text-sm">Emily Watkins</h6>
                            </div>
                        </div>

                        {/* Featured Article 2 */}
                        <div 
                            className="space-y-3 cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={handleArticleClick}
                        >
                            <img
                                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                                alt="Financial data analysis"
                                className="w-full h-48 sm:h-36 object-cover rounded-lg"
                            />
                            <div className="flex flex-wrap items-center gap-4">
                                <h6 className="text-xs text-blue-800">Cryptocurrency</h6>
                                <h6 className="text-xs text-gray-500">March 14, 2025</h6>
                            </div>
                            <h4 className="font-medium text-base sm:text-lg">The Future of Digital Currencies</h4>
                            <p className="text-xs sm:text-sm text-gray-600">How blockchain advancements are reshaping the financial landscape in 2025.</p>
                            <div className="flex items-center space-x-3">
                                <img
                                    src="https://randomuser.me/api/portraits/men/32.jpg"
                                    alt="Michael Chen"
                                    className="h-7 w-7 rounded-full object-cover"
                                />
                                <h6 className="text-sm">Michael Chen</h6>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Articles Section */}
                <div className="w-full lg:w-1/3 mt-8 lg:mt-0">
                    <h6 className="text-lg font-semibold pb-4">Recent Articles</h6>
                    <div className="space-y-4">
                        {/* Recent Article 1 */}
                        <div 
                            className="flex gap-3 border-b border-gray-100 pb-4 cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={handleArticleClick}
                        >
                            <img
                                src="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
                                alt="Financial chart"
                                className="h-20 w-20 sm:w-16 object-cover rounded-md flex-shrink-0"
                            />
                            <div className="space-y-1">
                                <div className="flex items-center space-x-2">
                                    <img
                                        src="https://randomuser.me/api/portraits/women/44.jpg"
                                        alt="Emily Watkins"
                                        className="h-5 w-5 rounded-full object-cover flex-shrink-0"
                                    />
                                    <h6 className="text-xs font-medium">Emily Watkins</h6>
                                </div>
                                <h4 className="text-sm font-medium line-clamp-2">The Impact of Global Events on Stock Markets</h4>
                                <div className="flex flex-wrap items-center gap-2 text-gray-500">
                                    <h6 className="text-xs">March 15, 2025</h6>
                                    <span className="text-xs hidden sm:inline">•</span>
                                    <h6 className="text-xs text-blue-800">Stock Market</h6>
                                </div>
                            </div>
                        </div>

                        {/* Recent Article 2 */}
                        <div 
                            className="flex gap-3 border-b border-gray-100 pb-4 cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={handleArticleClick}
                        >
                            <img
                                src="https://images.unsplash.com/photo-1634128221889-82ed6efebfc3?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
                                alt="Real estate investments"
                                className="h-20 w-20 sm:w-16 object-cover rounded-md flex-shrink-0"
                            />
                            <div className="space-y-1">
                                <div className="flex items-center space-x-2">
                                    <img
                                        src="https://randomuser.me/api/portraits/men/42.jpg"
                                        alt="Robert Johnson"
                                        className="h-5 w-5 rounded-full object-cover flex-shrink-0"
                                    />
                                    <h6 className="text-xs font-medium">Robert Johnson</h6>
                                </div>
                                <h4 className="text-sm font-medium line-clamp-2">Real Estate Trends to Watch in 2025</h4>
                                <div className="flex flex-wrap items-center gap-2 text-gray-500">
                                    <h6 className="text-xs">March 13, 2025</h6>
                                    <span className="text-xs hidden sm:inline">•</span>
                                    <h6 className="text-xs text-blue-800">Real Estate</h6>
                                </div>
                            </div>
                        </div>

                        {/* Recent Article 3 */}
                        <div 
                            className="flex gap-3 border-b border-gray-100 pb-4 cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={handleArticleClick}
                        >
                            <img
                                src="https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
                                alt="Retirement planning"
                                className="h-20 w-20 sm:w-16 object-cover rounded-md flex-shrink-0"
                            />
                            <div className="space-y-1">
                                <div className="flex items-center space-x-2">
                                    <img
                                        src="https://randomuser.me/api/portraits/women/68.jpg"
                                        alt="Sarah Williams"
                                        className="h-5 w-5 rounded-full object-cover flex-shrink-0"
                                    />
                                    <h6 className="text-xs font-medium">Sarah Williams</h6>
                                </div>
                                <h4 className="text-sm font-medium line-clamp-2">Retirement Planning in an Uncertain Economy</h4>
                                <div className="flex flex-wrap items-center gap-2 text-gray-500">
                                    <h6 className="text-xs">March 12, 2025</h6>
                                    <span className="text-xs hidden sm:inline">•</span>
                                    <h6 className="text-xs text-blue-800">Retirement</h6>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                {/* Each card is now a horizontal layout with image on left side and text on right */}
                <div 
                    className="flex flex-row gap-4 bg-[#4FB7EF73] p-4 rounded-lg cursor-pointer hover:bg-[#4FB7EF90] transition-colors"
                    onClick={handleArticleClick}
                >
                    <div className="h-40 w-40 flex-shrink-0">
                        <img
                            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                            alt="Real estate property"
                            className="w-full h-full object-cover rounded-md"
                        />
                    </div>
                    <div className="flex flex-col justify-between">
                        <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-3">
                                <h5 className="text-xs sm:text-sm text-[#002072] font-medium">Real Estate Investment</h5>
                                <h5 className="text-xs sm:text-sm text-[#6B7271]">Feb 22, 2025</h5>
                            </div>
                            <h3 className="text-base sm:text-lg font-medium">Maximizing Returns from Real Estate</h3>
                            <p className="text-xs sm:text-sm text-gray-600">Learn how to identify lucrative opportunities in the ever-evolving real estate sector.</p>
                        </div>
                        <div className="flex items-center space-x-3 mt-2">
                            <img
                                src="https://randomuser.me/api/portraits/men/75.jpg"
                                alt="Davidson Stone"
                                className="h-7 w-7 rounded-full object-cover flex-shrink-0"
                            />
                            <h5 className="text-xs sm:text-sm">Davidson Stone</h5>
                        </div>
                    </div>
                </div>

                <div 
                    className="flex flex-row gap-4 bg-[#4FB7EF73] p-4 rounded-lg cursor-pointer hover:bg-[#4FB7EF90] transition-colors"
                    onClick={handleArticleClick}
                >
                    <div className="h-40 w-40 flex-shrink-0">
                        <img
                            src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                            alt="Apartment building"
                            className="w-full h-full object-cover rounded-md"
                        />
                    </div>
                    <div className="flex flex-col justify-between">
                        <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-3">
                                <h5 className="text-xs sm:text-sm text-[#002072] font-medium">Commercial Property</h5>
                                <h5 className="text-xs sm:text-sm text-[#6B7271]">Feb 20, 2025</h5>
                            </div>
                            <h3 className="text-base sm:text-lg font-medium">Commercial Real Estate Outlook</h3>
                            <p className="text-xs sm:text-sm text-gray-600">Analysis of trends and investment potential in commercial real estate markets.</p>
                        </div>
                        <div className="flex items-center space-x-3 mt-2">
                            <img
                                src="https://randomuser.me/api/portraits/women/26.jpg"
                                alt="Jennifer Lewis"
                                className="h-7 w-7 rounded-full object-cover flex-shrink-0"
                            />
                            <h5 className="text-xs sm:text-sm">Jennifer Lewis</h5>
                        </div>
                    </div>
                </div>

                <div 
                    className="flex flex-row gap-4 bg-[#4FB7EF73] p-4 rounded-lg cursor-pointer hover:bg-[#4FB7EF90] transition-colors"
                    onClick={handleArticleClick}
                >
                    <div className="h-40 w-40 flex-shrink-0">
                        <img
                            src="https://images.unsplash.com/photo-1628744448840-55bdb2497bd4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                            alt="Real estate agent showing property"
                            className="w-full h-full object-cover rounded-md"
                        />
                    </div>
                    <div className="flex flex-col justify-between">
                        <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-3">
                                <h5 className="text-xs sm:text-sm text-[#002072] font-medium">Residential Market</h5>
                                <h5 className="text-xs sm:text-sm text-[#6B7271]">Feb 18, 2025</h5>
                            </div>
                            <h3 className="text-base sm:text-lg font-medium">Housing Market Forecast 2025</h3>
                            <p className="text-xs sm:text-sm text-gray-600">Expert predictions on housing trends and investment opportunities this year.</p>
                        </div>
                        <div className="flex items-center space-x-3 mt-2">
                            <img
                                src="https://randomuser.me/api/portraits/men/34.jpg"
                                alt="Marcus Chen"
                                className="h-7 w-7 rounded-full object-cover flex-shrink-0"
                            />
                            <h5 className="text-xs sm:text-sm">Marcus Chen</h5>
                        </div>
                    </div>
                </div>

                <div 
                    className="flex flex-row gap-4 bg-[#4FB7EF73] p-4 rounded-lg cursor-pointer hover:bg-[#4FB7EF90] transition-colors"
                    onClick={handleArticleClick}
                >
                    <div className="h-40 w-40 flex-shrink-0">
                        <img
                            src="https://images.unsplash.com/photo-1603796846097-bee99e4a601f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                            alt="Real estate investment meeting"
                            className="w-full h-full object-cover rounded-md"
                        />
                    </div>
                    <div className="flex flex-col justify-between">
                        <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-3">
                                <h5 className="text-xs sm:text-sm text-[#002072] font-medium">REITs</h5>
                                <h5 className="text-xs sm:text-sm text-[#6B7271]">Feb 15, 2025</h5>
                            </div>
                            <h3 className="text-base sm:text-lg font-medium">Investing in REITs: A Complete Guide</h3>
                            <p className="text-xs sm:text-sm text-gray-600">Understanding Real Estate Investment Trusts and their place in your portfolio.</p>
                        </div>
                        <div className="flex items-center space-x-3 mt-2">
                            <img
                                src="https://randomuser.me/api/portraits/women/55.jpg"
                                alt="Sandra Park"
                                className="h-7 w-7 rounded-full object-cover flex-shrink-0"
                            />
                            <h5 className="text-xs sm:text-sm">Sandra Park</h5>
                        </div>
                    </div>
                </div>
            </div>
            <div className="my-8">
                <h4 className="text-lg font-semibold mb-4">Recommended</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    {[
                        {
                            id: 1,
                            title: "The Future of Real Estate",
                            image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
                            category: "Real Estate",

                        },
                        {
                            id: 2,
                            title: "Investing in Cryptocurrency",
                            image: "https://images.unsplash.com/photo-1639322537228-f710d846310a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
                            category: "Cryptocurrency",

                        },
                        {
                            id: 3,
                            title: "Advanced Trading Strategies",
                            image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
                            category: "Stock Market",

                        }
                    ].map(course => (
                        <div 
                            key={course.id} 
                            className="flex flex-col bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                            onClick={handleArticleClick}
                        >
                            <div className="h-32 overflow-hidden">
                                <img
                                    src={course.image}
                                    alt={course.title}
                                    className="w-full h-full object-cover rounded"
                                />
                            </div>
                            <div className="p-3">
                                <h5 className="font-medium text-sm text-blue-800">{course.title}</h5>
                                <p className="text-xs text-gray-500">{course.category}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}