import { ClockIcon } from '@heroicons/react/24/outline';

interface ActivityItem {
  id: string;
  user: string;
  action: string;
  time: string;
  date: string;
}

interface RecentActivityProps {
  activities?: ActivityItem[];
  maxItems?: number;
}

export default function RecentActivity({ activities, maxItems = 5 }: RecentActivityProps) {
  // Default activity data if none provided
  const defaultActivities: ActivityItem[] = [
    {
      id: 'act1',
      user: 'Jamie Smith',
      action: 'updated account settings',
      time: '16:05',
      date: 'Today'
    },
    {
      id: 'act2',
      user: 'Alex Johnson',
      action: 'logged in',
      time: '13:05',
      date: 'Today'
    },
    {
      id: 'act3',
      user: 'Morgan Lee',
      action: 'added a new savings goal for vacation',
      time: '02:05',
      date: 'Today'
    },
    {
      id: 'act4',
      user: 'Taylor Green',
      action: 'reviewed recent transactions',
      time: '21:05',
      date: 'Yesterday'
    },
    {
      id: 'act5',
      user: 'Wilson Baptista',
      action: 'transferred funds to emergency fund',
      time: '09:05',
      date: 'Yesterday'
    }
  ];

  const displayActivities = activities || defaultActivities;
  
  // Group activities by date
  const groupedActivities: { [key: string]: ActivityItem[] } = {};
  
  displayActivities.forEach(activity => {
    if (!groupedActivities[activity.date]) {
      groupedActivities[activity.date] = [];
    }
    groupedActivities[activity.date].push(activity);
  });

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mt-6">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <ClockIcon className="w-5 h-5 mr-2 text-gray-500" />
        Recent Activity
      </h2>
      
      <div className="space-y-6">
        {Object.keys(groupedActivities).map(date => (
          <div key={date}>
            <h3 className="text-sm font-medium text-gray-500 mb-3">{date}</h3>
            
            <div className="space-y-4">
              {groupedActivities[date].slice(0, maxItems).map((activity) => (
                <div key={activity.id} className="flex">
                  {/* Timeline vertical line with blue circle */}
                  <div className="relative mr-4">
                    <div className="h-full w-0.5 bg-gray-200 absolute left-2.5"></div>
                    <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <p className="text-sm">
                        <span className="font-medium">{activity.user}</span> {activity.action}
                      </p>
                      <span className="text-xs text-gray-500">{activity.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}