import React from 'react';
import { AuthLayout } from '@/components/Layout/layout';
import { FaCaretDown } from 'react-icons/fa';
import { Dropdown } from 'flowbite-react';
import TimelineWithoutBody from '../Tools/timeLineWithoutBody';
import TimelineT, { TimelinedData } from '../Tools/timeLine';

// import { HiArrowNarrowRight } from 'react-icons/hi';

const ForumGroup: React.FC = () => {



  return (
    <AuthLayout>
      <>
        <div className="px-6">j
          <div className="flex flex-wrap items-center justify-between">
            <div className="flex items-center w-full lg:w-6/12">
              <div className="flex flex-col">
                <p className="text-blue-800 font-semibold">Forum History</p>
                <div className="h-1 bg-gradient-to-r from-blue-700 to-gray-400 w-36 mt-1"></div>
              </div>
            </div>
            <div className="flex items-center w-full lg:w-6/12 justify-end ">
              <p className="text-[#A098AE]">
                view :
              </p>
              <Dropdown label="" dismissOnClick={false} renderTrigger={() => 
                <button className="flex items-center space-x-1 border border-[#a098ae] px-2 py-1 rounded">
                <span>All type</span>
                <FaCaretDown />
              </button>

              }>
                <Dropdown.Item>Dashboard</Dropdown.Item>
                <Dropdown.Item>Settings</Dropdown.Item>
                <Dropdown.Item>Earnings</Dropdown.Item>
                <Dropdown.Item>Sign out</Dropdown.Item>
              </Dropdown>
              
            </div>
          </div>


          <div>
            <div>
              <p className='text-xl font-semibold'>Today</p>
            </div>
            <TimelineT TimelineD={TimelinedData} />
          </div>

              <div>
                <h2>19 May 2024</h2>
              </div>

          <div>
            <div>
              <p className='text-xl font-semibold'>Today</p>
            </div>
            <TimelineWithoutBody TimelineD={TimelinedData} />
          </div>
        </div>
      </>
    </AuthLayout>
  );
};
export default ForumGroup;