import { useAuth } from '../contexts/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();

  const stats = [
    { label: 'Active Projects', value: '12', change: '+3 this week' },
    { label: 'Open Bids', value: '8', change: '+1 today' },
    { label: 'Awarded Contracts', value: '5', change: 'This month' },
    { label: 'Total Earned (AED)', value: '1.2M', change: '+15% vs last month' },
  ];

  const recentProjects = [
    {
      id: '1',
      title: 'Luxury Villa Construction - Palm Jumeirah',
      status: 'open',
      budget: 'AED 2,500,000',
      deadline: '2025-03-15',
      bids: 12,
    },
    {
      id: '2',
      title: 'Commercial Office Building - DIFC',
      status: 'bidding',
      budget: 'AED 8,500,000',
      deadline: '2025-02-28',
      bids: 8,
    },
    {
      id: '3',
      title: 'Residential Complex - Dubai Marina',
      status: 'awarded',
      budget: 'AED 5,200,000',
      deadline: '2025-04-10',
      bids: 15,
    },
  ];

  const statusColors: Record<string, string> = {
    open: 'bg-green-100 text-green-800',
    bidding: 'bg-blue-100 text-blue-800',
    awarded: 'bg-purple-100 text-purple-800',
    completed: 'bg-gray-100 text-gray-800',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.name ?? 'User'}!
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Here's what's happening with your projects today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-500 truncate">{stat.label}</p>
                  <p className="mt-1 text-3xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
              <p className="mt-3 text-sm text-green-600">{stat.change}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Projects */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Recent Projects</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {recentProjects.map((project) => (
            <div key={project.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-primary-600 truncate">{project.title}</p>
                  <div className="mt-1 flex items-center gap-4 text-sm text-gray-500">
                    <span>{project.budget}</span>
                    <span>Deadline: {project.deadline}</span>
                    <span>{project.bids} bids</span>
                  </div>
                </div>
                <span
                  className={`ml-4 px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors[project.status] ?? 'bg-gray-100 text-gray-800'}`}
                >
                  {project.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
