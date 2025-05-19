import { AuthLayout } from "@/components/Layout/layout";
import Button from '@/components/Ui/Button'; 
import { FaCalendarDay } from "react-icons/fa";
// import { ArrowRightIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import NewsForum from "../Tools/newsForum";
// import LastMessages from "@/components/DashboardComponents/meetups";
const Forum = () => {
  const [isMeetupsEnlarged, setIsMeetupsEnlarged] = useState(false);

  const handleMeetupsClick = () => {
    setIsMeetupsEnlarged(!isMeetupsEnlarged);

  };
  return (
    <AuthLayout>
      <div className="py-4 px-6 ">
        <div className="flex flex-col-reverse md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 md:space-x-24">
          <div className="max-w-full md:max-w-xl py-6">
            <h2 className="text-2xl md:text-4xl text-black-700 font-bold">Forums</h2>
            <p className="text-sm md:text-base">
              Create unlimited PreMatch strategies to automatically find valuable matches that
              meets your rules and conditions within minutes! Or import Preset strategies created by other Predictivo.
            </p>
          </div>
          <div className="flex justify-start md:justify-end w-full md:w-auto mb-4 md:mb-10">
            <Button
              text="Create group"
              icon={FaCalendarDay}
              iconPosition="right"
              className="bg-red-800 text-white px-8 md:px-16 py-2 shadow-md flex items-center space-x-2"
              link="/create-group"
            />
          </div>
        </div>


        {/* create post */}
        <div className="flex flex-wrap mt-10 space-x-6">

          <div className="w-full lg:w-7/12">
{/* 
            <div className="bg-blue-800 flex rounded-xl space-x-6 py-4 px-3 justify-between">
              <div className="img hidden md:block">

                {username ? (
                  <img
                    src={user}
                    alt="User"
                    width={32}
                    height={32}
                    className="rounded-full mr-1 border-2  border-white shadow-sm"
                  />
                ) : (
                  <img
                    src=""
                    alt="Default User"
                    width={32}
                    height={32}
                    className="rounded-full mr-1 border-2 border-white shadow-sm"
                  />
                )}
              </div>

              <div className="w-full md:w-auto flex-grow">
                <input
                  type="text"
                  name="post"
                  id="post"
                  placeholder="Let's share what's going on your mind"
                  className="w-full  p-2 border rounded-lg"
                />
              </div>


              <div className="w-full md:w-auto flex justify-center md:justify-end">
                <Button
                  text="Create Post"
                  className="bg-slate-950   text-white px-6 py-3 rounded-lg shadow-lg transition-transform duration-300 transform hover:scale-105 "
                  onClick={() => alert('Custom Styled Button Clicked!')}
                />
              </div>

            </div> */}

            {!isMeetupsEnlarged && (
              <div>
                <NewsForum  />
              </div>
            )}
          </div>

          <div className={`transition-transform duration-1000 transform ${isMeetupsEnlarged ? 'w-full h-screen' : 'w-full lg:w-4/12'}`}>
            <div className="bg-white rounded-lg px-4 py-4" onClick={handleMeetupsClick}>
              <button className="font-semibold transition-transform duration-300 transform hover:scale-105 hover:bg-blue-600 active:scale-95 rounded-lg px-2 py-2 hover:text-white">
                {/* Last Messages <ArrowRightIcon className="inline-block mr-2 w-6" /> */}
              </button>
              {/* <LastMessages /> */}
            </div>

            {/* {!isMeetupsEnlarged && (
              <div className="bg-white rounded-lg px-4 py-4 my-8">
                <p className="font-semibold">
                  Podcasts <ArrowRightIcon className="inline-block mr-2 w-4" />
                </p>
                <Podcast podcastData={PodcastData} />
              </div>
            )} */}
          </div>
        </div>


      </div>
    </AuthLayout>
  );
};

export default Forum;