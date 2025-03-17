import { useState } from 'react';

// Sample course data
const courses = [
  {
    id: 1,
    title: "Become a Data Analyst",
    description: "Apply for our new Platinum Course today and enjoy 20% discount and free mentorship.",
    price: 150,
    category: "data",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    title: "Investment Fundamentals",
    description: "Learn core investment strategies to build wealth through smart portfolio management.",
    price: 120,
    category: "investing",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    title: "Technical Analysis Mastery",
    description: "Master chart patterns and technical indicators for more effective trading decisions.",
    price: 180,
    category: "trading",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 4, 
    title: "Financial Planning Essentials",
    description: "Create comprehensive financial plans for yourself or clients with expert guidance.",
    price: 140,
    category: "planning",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 5,
    title: "Machine Learning for Finance",
    description: "Apply ML algorithms to predict market trends and optimize investment strategies.",
    price: 220,
    category: "data",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 6,
    title: "Retirement Planning",
    description: "Build a resilient retirement strategy to ensure financial security in your later years.",
    price: 130,
    category: "planning",
    image: "https://images.unsplash.com/photo-1559519529-0936e4058364?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 7,
    title: "Cryptocurrency Fundamentals",
    description: "Learn the basics of blockchain technology and how to invest safely in digital assets.",
    price: 160,
    category: "investing",
    image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 8,
    title: "Day Trading Strategies",
    description: "Develop profitable day trading techniques with risk management principles.",
    price: 190,
    category: "trading",
    image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 9,
    title: "Python for Financial Analysis",
    description: "Use Python programming to automate financial analysis and visualization tasks.",
    price: 175,
    category: "data",
    image: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 10,
    title: "Estate Planning 101",
    description: "Understand the essentials of estate planning to protect your assets and legacy.",
    price: 115,
    category: "planning",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  }
];

export default function EduCard() {
    const [searchTerm, setSearchTerm] = useState('');
    const [priceFilter, setPriceFilter] = useState('all');
    
    // Filter courses based on search term and price range
    const filteredCourses = courses.filter(course => {
        // Search term filter
        const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              course.description.toLowerCase().includes(searchTerm.toLowerCase());
        
        // Price filter
        let matchesPrice = true;
        if (priceFilter === 'under100') matchesPrice = course.price < 100;
        else if (priceFilter === '100-150') matchesPrice = course.price >= 100 && course.price <= 150;
        else if (priceFilter === '150-200') matchesPrice = course.price > 150 && course.price <= 200;
        else if (priceFilter === 'over200') matchesPrice = course.price > 200;
        
        return matchesSearch && matchesPrice;
    });

    return (
        <>
            {/* Search and Filter Bar */}
            <div className="mb-8 px-4">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-4">
                    {/* Search Input */}
                    <div className="w-full md:w-1/2">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search for courses..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                    
                    {/* Price Filter */}
                    <div className="w-full md:w-auto">
                        <select 
                            value={priceFilter}
                            onChange={(e) => setPriceFilter(e.target.value)}
                            className="w-full md:w-auto p-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All Prices</option>
                            <option value="under100">Under $100</option>
                            <option value="100-150">$100 - $150</option>
                            <option value="150-200">$150 - $200</option>
                            <option value="over200">Over $200</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Course Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {filteredCourses.map(course => (
                    <div key={course.id} className="shadow-md p-4 bg-white rounded-lg">
                        <div className="h-48 overflow-hidden rounded-lg">
                            <img 
                                src={course.image} 
                                alt={course.title} 
                                className="w-full h-full object-cover rounded-lg"
                            />
                        </div>
                        <h5 className="text-sm py-2 font-normal">{course.title}</h5>
                        <h5 className="text-xs font-light">{course.description}</h5>
                        <div className="flex justify-between text-sm py-2">
                            <button 
                                className="text-blue-500 p-2 rounded-lg"
                                onClick={() => window.location.href = `/course`}
                            >
                                View Course
                            </button>
                            <h6 className="font-medium">${course.price}</h6>
                        </div>
                    </div>
                ))}
                
                {filteredCourses.length === 0 && (
                    <div className="col-span-full text-center py-10">
                        <p className="text-gray-500">No courses match your search criteria.</p>
                    </div>
                )}
            </div>
        </>
    );
}