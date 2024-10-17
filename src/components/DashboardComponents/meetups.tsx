import React from "react";

interface Meetup {
  month: string;
  day: number;
  title: string;
  location: string;
  img: string;
  types: string[];
}

interface MeetupsProps {
  meetupsData: Meetup[];
}



export const ForumMeetupsData = [
  {
    month: "Apr",
    day: 10,
    title: "Startup Pitch Night",
    location: "Startup Hub • New York, USA",
    img: "/assets/images/dashboard/dashboard/comp.png",
    types: ["Pitch", "Networking", "Startup"]
  },
  {
    month: "May",
    day: 22,
    title: "Developer Conference 2023",
    location: "Dev Center • Berlin, Germany",
    img: "/assets/images/dashboard/dashboard/comp.png",
    types: ["Conference", "Tech", "Developer"]
  },
  {
    month: "May",
    day: 22,
    title: "Developer Conference 2023",
    location: "Dev Center • Berlin, Germany",
    img: "/assets/images/dashboard/dashboard/comp.png",
    types: ["Conference", "Tech", "Developer"]
  },
  // Add more meetups as needed
];


const Meetups: React.FC<MeetupsProps> = ({ meetupsData }) => {
  return (
    <div>
      {meetupsData.map((meetup, index) => (
        <div key={index} className="flex space-between py-4 space-x-2">
          <div className="date bg-blue-800 text-white text-xl rounded-lg py-2 px-2 text-center font-semibold space-y-4">
            <p>{meetup.month}</p>
            <p>{meetup.day}</p>
          </div>
          <div>
            <p className="company font-semibold">{meetup.title}</p>
            <div className="flex space-x-2 py-1">
              <div>
                <img
                  src={meetup.img}
                  alt=""
                  width={18}
                  height={18}
                  className="rounded-full mr-1 shadow-md"
                />
              </div>
              <div>
                <p className="text-sm text-gray-500">{meetup.location}</p>
              </div>
            </div>
            <div className="meetup-type flex space-x-4 py-1">
              {meetup.types.map((type, typeIndex) => (
                <p
                  key={typeIndex}
                  className="text-sm text-gray-300 bg-black-500 px-2 py-2 rounded-lg overflow-hidden text-ellipsis whitespace-nowrap"
                  style={{ maxWidth: "100px" }} // Adjust the max-width as needed
                >
                  {type}
                </p>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Meetups;