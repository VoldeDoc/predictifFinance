import { AuthLayout } from "@/components/Layout/layout";
import { BsFacebook, BsInstagram, BsLink, BsTwitterX } from "react-icons/bs";

export default function CourseDetail() {
  return (
    <AuthLayout>
      <div className="px-16 sm:px-8">
        <div className="flex flex-col lg:flex-row w-full gap-7">
          <div className="w-full lg:w-2/3">
            <div className="video-container">
              <div className="relative pt-[56.25%] bg-black rounded-lg overflow-hidden shadow-lg">
                {/* 16:9 aspect ratio container */}
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src=""
                  // src="https://www.youtube.com/embed/dQw4w9WgXcQ" // Replace with actual video ID
                  title="Course Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>

              <div className="mt-4">
                <h2 className="text-2xl font-semibold text-blue-800">Become a  cyber security personnel</h2>
                <div className="mt-3">
                  <div className="grid grid-cols-[140px_1fr] gap-y-2 text-gray-600">
                    <span className="font-normal">Promo period</span>
                    <span className="font-medium">Nov 1 - Nov 30, 2028</span>
                    
                    <span className="font-normal">Usage Period</span>
                    <span className="font-medium">During the promo period and completed by March 31, 2029</span>
                    
                    <span className="font-normal">Minimum Transaction</span>
                    <span className="font-medium">$250</span>
                  </div>
                </div>
              </div>

            </div>

            <div className="border-t bg-black-500 h-0.5 my-5"></div>

            <div className="my-5">
              <h3>About</h3>
              <p className="text-gray-700">Earn triple points on all travel-related purchases when booking through our exclusive partner portals. Perfect for frequent travelers looking to maximize rewards on their trips. Enjoy the freedom to explore new destinations while accumulating rewards faster, ensuring your travel budget works harder for you.</p>
            </div>
            <div className="my-5">
              <h3>How To</h3>
              <p className="text-gray-700">Log into your Coinest account, navigate to the 'Rewards' section, and use the links provided to book your travel. Points automatically triple for all eligible transactions.</p>
            </div>
            <div className="my-5">
              <h3>Terms & Conditions</h3>
              <ul className="list-disc pl-5 text-gray-700">
                <li>Must book travel through designated Coinest partner portals.</li>
                <li>Triple points apply only to the first $5,000 of travel expenses.</li>
                <li>Points are awarded after travel is completed.</li>
                <li>Cancellations may result in forfeiture of bonus points.</li>
              </ul>
            </div>

            <div className="my-5">
              <h3>Partners</h3>
              <ul className="list-disc pl-5 text-gray-700">
                <li>Expedia</li>
                <li>Booking.com</li>
                <li>Aitbnb</li>
              </ul>
            </div>

            <div className="my-8">
              <button
                className="bg-blue-800 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg
                transform transition-all duration-300 hover:scale-105 active:scale-95 
                shadow-lg hover:shadow-xl"
              >
                <span className="inline-block animate-pulse">Buy Now</span>
              </button>
            </div>

          </div>
          <div className="w-full lg:w-[30%]">
            <div>
              <h4>Share </h4>
              <div className="flex space-x-4 mt-2">
                <button className="bg-blue-200 hover:bg-blue-300 text-black-400 font-bold py-2 px-2 rounded-lg"><BsTwitterX /></button>
                <button className="bg-blue-200 hover:bg-blue-300 text-black-400 font-bold py-2 px-2 rounded-lg"><BsFacebook /></button>
                <button className="bg-blue-200 hover:bg-blue-300 text-black-400 font-bold py-2 px-2 rounded-lg"><BsInstagram /></button>
                <button className="bg-blue-200 hover:bg-blue-300 text-black-400 font-bold py-2 px-2 rounded-lg"><BsLink /></button>

              </div>
            </div>
            <div className="border-t-2 bg-black-500 my-5"></div>
            <h4>Related Courses</h4>
            <div className="mt-4 space-y-4"></div>

            {[
              {
              id: 1,
              name: "Introduction to Financial Security",
              image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
              },
              {
              id: 2,
              name: "Blockchain Fundamentals",
              image: "https://images.unsplash.com/photo-1639322537228-f710d846310a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
              },
              {
              id: 3,
              name: "Advanced Trading Strategies",
              image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
              }
            ].map(course => (
              <div key={course.id} className="flex flex-col bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow  my-5">
                <div className="h-32 overflow-hidden p-2">
                <img
                src={course.image}
                alt={course.name}
                className="w-full h-full object-cover rounded"
                />
                </div>
              <div className="p-3">
                <h5 className="font-medium text-sm text-blue-800">{course.name}</h5>
              </div>
              </div>
            ))}          </div>
        </div>

      </div>
    </AuthLayout>
  )
}