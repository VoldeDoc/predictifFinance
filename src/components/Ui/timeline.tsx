import { Timeline, TimelineBody, TimelineContent, TimelineItem, TimelinePoint, TimelineTime, TimelineTitle } from 'flowbite-react';
import React from 'react';
import { FaPlus } from 'react-icons/fa';

interface Timelined {
  author: string;
  course: string;
  time: Date;
  invites: string;
  completed: string;
  students: string[];
  initials: string;
}

interface TimelineProps {
  TimelineD: Timelined[];
}

export const TimelinedData: Timelined[] = [
  {
    time: new Date(),
    author: "Prof Ken Humpry",
    course: "Design Thinking & Innovation Courses",
    completed: "Completed",
    invites:"UX Research",
    students: [
      "assets/images/dashboard/dashboard/Ellipse 427.png",
      "assets/images/dashboard/dashboard/Ellipse 427.png",
      "assets/images/dashboard/dashboard/Ellipse 427.png",
    ],
    initials: "KH",
  },
  {
    time: new Date(),
    author: "Dr. Jane Doe",
    course: "Advanced Machine Learning",
    completed: "Progress",
    invites:"UX Research",
    students: [
      "assets/images/dashboard/dashboard/Ellipse 427.png",
      "assets/images/dashboard/dashboard/Ellipse 427.png",
    ],
    initials: "JD",
  },
  {
    time: new Date(),
    author: "Mr. John Smith",
    course: "Introduction to Programming",
    completed: "Started",
    invites:"UX Research",
    students: [
      "assets/images/dashboard/dashboard/Ellipse 427.png",
    ],
    initials: "JS",
  },
];

const getColorFromInitials = (initials: string): string => {
  const colors = [
    "bg-red-500",
    "bg-green-500",
    "bg-blue-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
  ];
  const index = initials.charCodeAt(0) % colors.length;
  return colors[index];
};

const TimelineT: React.FC<TimelineProps> = ({ TimelineD }) => {
  return (
    <div>
      {TimelineD.map((timeline, index) => (
        <div key={index}>
          <Timeline>
            <TimelineItem>
              <TimelinePoint />
              <TimelineContent>
                <TimelineTime>{timeline.time.toLocaleTimeString()}</TimelineTime>
                <TimelineTitle>
                  <div className='flex justify-between space-x-5'>
                    <div className='flex space-x-3'>
                      <div className={`${getColorFromInitials(timeline.initials)} px-2 py-2 rounded-lg text-sm`}>
                        <p>{timeline.initials}</p>
                      </div>
                      <div>
                        <p className='text-black-500 text-sm'>
                          <span className='font-bold'>{timeline.author}</span>: {timeline.course}
                        </p>
                      </div>
                    </div>
                    <div className=''>
                      <button className='text-red-500 text-sm border-2 border-red-500 px-2 py-1 rounded-md'>
                        {timeline.completed}
                      </button>
                    </div>
                  </div>
                </TimelineTitle>
                <TimelineBody>
                  <div className='relative flex space-x-4 mt-4'>
                    {timeline.students.map((student, studentIndex) => (
                      <div key={studentIndex} className='relative'>
                        <img src={student} alt="" width={50} height={50} className='rounded-full shadow-md' />
                        <div className='absolute bottom-1 right-1'>
                          <button
                            className="flex items-center justify-center w-4 h-4 bg-[#F0F3F5] text-white rounded-full transition-transform duration-300"
                          >
                            <FaPlus className='text-black-500 w-3 h-3' />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </TimelineBody>
              </TimelineContent>
            </TimelineItem>
          </Timeline>
        </div>
      ))}


    </div>
  );
};

export default TimelineT;