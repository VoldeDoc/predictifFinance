import { FaStar } from 'react-icons/fa';
import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { AuthLayout } from '@/components/Layout/layout';
import { useNavigate } from 'react-router-dom';

export default function Course() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  
  // Sample courses data with individual modules as separate courses
  const courses = [
    {
      id: 1,
      name: "Data Science 1: Introduction to Financial Data",
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: 2,
      name: "Data Science 2: Statistical Analysis",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: 3,
      name: "Data Science 3: Predictive Modeling",
      rating: 4.3,
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: 4,
      name: "Data Science 4: Machine Learning Applications",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: 5,
      name: "Data Science 5: Financial Forecasting",
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: 6,
      name: "Data Science 6: Portfolio Optimization",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1535320903710-d993d3d77d29?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    }
  ];

  // Function to handle course click
  const handleCourseClick = () => {
    navigate(`/course-detail`);
  };

  // Filter courses based on search term
  const filteredCourses = courses.filter(course => 
    course.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
  <AuthLayout>
  <div className="px-16 sm:px-8">
  <div className="space-y-6">
      {/* Search bar at the top */}
      <div className="relative mb-6">
        <div className="flex items-center border rounded-lg overflow-hidden">
          <div className="px-3 py-2">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search courses..."
            className="w-full px-2 py-2 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Display courses in a vertical stack */}
      <div className="space-y-4">
        {filteredCourses.length > 0 ? (
          filteredCourses.map(course => (
            <div 
              key={course.id} 
              className="flex items-center border rounded-lg shadow-sm overflow-hidden p-3 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => handleCourseClick()}
            >
              {/* Smaller course image on the left */}
              <div className="w-24 h-24 rounded-md overflow-hidden flex-shrink-0">
                <img 
                  src={course.image} 
                  alt={course.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Course details to the right of the image */}
              <div className="ml-4 flex-grow">
                {/* Course name and rating */}
                <h2 className="text-lg font-bold mb-1">{course.name}</h2>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      size={14}
                      className={`${i < Math.floor(course.rating) ? 'text-yellow-500' : 'text-gray-300'}`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">{course.rating}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">No courses found. Try a different search term.</p>
          </div>
        )}
      </div>
    </div>
  </div>
  </AuthLayout>
  );
}