import Meetups, { ForumMeetupsData, } from "@/components/DashboardComponents/meetups";
import NewsForum, { MessageBoxForum } from "@/components/DashboardComponents/newsForum";
import RecentMsg from "@/components/DashboardComponents/recentMsg";
import { AuthLayout } from "@/components/Layout/layout";
import { ArrowRightIcon } from "@heroicons/react/24/solid";
import { FaCalendarDay } from "react-icons/fa";

export default function MessageBox() {

    return (
        <AuthLayout>
            <div className="py-4 px-6 ">
                <div className="flex flex-col-reverse md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 md:space-x-24">
                    <div className="max-w-full md:max-w-xl py-6">
                        <h2 className="text-2xl md:text-4xl text-black-700 font-bold">Message Box</h2>
                        <p className="text-sm md:text-base">
                            Create unlimited PreMatch strategies to automatically find valuable matches that
                            meets your rules and conditions within minutes! Or import Preset strategies created by other Predictivo. .
                        </p>
                    </div>
                    <a href="/groups">
                        <div className="flex justify-start md:justify-end w-full md:w-auto mb-4 md:mb-10">
                            <button className="bg-red-800 text-white px-8 md:px-16 py-2 shadow-md flex items-center space-x-2 transform transition-transform duration-300"><a href="/groups">View group  </a><FaCalendarDay className="inlind-block ml-2" /> </button>
                        </div></a>
                </div>

                <div className="flex flex-wrap mt-10 space-x-6">
                    <div className=" w-full lg:w-7/12">
                        <NewsForum forumData={MessageBoxForum} />

                        <div className="my-5">
                            <p className="font-semibold">General</p>
                        </div>
                        <div className="bg-white flex rounded-lg space-x-6 py-6 px-3 justify-between items-center">
                            <div className="bg-blue-900 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                                <p className="text-white text-center">ES</p>
                            </div>

                            <div className="w-full md:w-auto flex-grow">
                                <textarea
                                    name="post"
                                    id="post"
                                    placeholder="Message"
                                    className="w-full p-2 border rounded-lg bg-[#F9F9F9]"
                                    rows={1.4} // Adjust the number of rows as needed
                                ></textarea>
                            </div>

                            <button className="px-5 bg-blue-800 rounded-lg text-white flex-shrink-0">Post</button>
                        </div>


                        <p className="font-medium py-8">Sort Post by <span className="font-semibold">Most Recent</span></p>
                        <RecentMsg />
                    </div>

                    <div className="w-full lg:w-4/12">

                        <div className="bg-white rounded-lg pt-4 pb-14 px-4 my-5">
                            <div>
                                <img src="assets/images/dashboard/dashboard/detail.png" alt="" />
                                <p className="font-semibold py-3 text-xl">Details</p>
                                <p>

                                    Community wide announcements and discussions
                                </p>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg px-4 py-4 ">
                            <button className="font-semibold transition-transform duration-300 transform hover:scale-105 hover:bg-blue-600 active:scale-95 rounded-lg px-2 py-2 hover:text-white">
                                Meetups <ArrowRightIcon className="inline-block mr-2 w-6" />
                            </button>
                            <Meetups meetupsData={ForumMeetupsData} />
                        </div>
                    </div>




                </div>


            </div>
        </AuthLayout>
    )
}