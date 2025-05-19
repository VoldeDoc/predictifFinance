import { Timeline, TimelineContent, TimelineItem, TimelinePoint, TimelineTime, TimelineTitle } from 'flowbite-react';
import React from 'react';

interface Timelined {
  author: string;
  invites: string;
  time: Date;
  completed: string;
  students: string[];
  initials: string;
}

interface TimelineProps {
  TimelineD: Timelined[];
}

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

const TimelineWithoutBody: React.FC<TimelineProps> = ({ TimelineD }) => {
  return (
    <div>
      {TimelineD.map((timeline, index) => (
        <div key={index}>
          <Timeline>
            <TimelineItem>
              <TimelinePoint />
              <TimelineContent>
                <TimelineTime>{timeline.time.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })}</TimelineTime>
                <TimelineTitle>
                  <div className='flex justify-between space-x-5'>
                    <div className='flex space-x-3'>
                      <div className={`${getColorFromInitials(timeline.initials)} px-2 py-2 rounded-lg text-sm`}>
                        <p>{timeline.initials}</p>
                      </div>
                      <div>
                        <p className='text-black-500 text-sm'>
                          <span className='font-bold'>{timeline.author}  </span>: is inviting you to {timeline.invites}
                        </p>
                      </div>
                    </div>
                    <div className=''>
                      <button className='text-white text-sm bg-blue-800  px-2 py-1 rounded-md'>
                        Join now
                      </button>
                    </div>
                  </div>
                </TimelineTitle>
              </TimelineContent>
            </TimelineItem>
          </Timeline>
        </div>
      ))}
    </div>
  );
};

export default TimelineWithoutBody;