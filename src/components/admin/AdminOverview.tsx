import { BookOpen, Users, Calendar, TrendingUp, Activity } from 'lucide-react';

export default function AdminOverview() {
  const stats = {
    totalQuestions: 342,
    activeStudents: 156,
    testsToday: 89,
    avgCompletion: 76
  };

  const recentActivity = [
    { id: '1', action: 'New student registered', user: 'John Doe', time: '5 mins ago' },
    { id: '2', action: 'Daily set published', user: 'Admin', time: '2 hours ago' },
    { id: '3', action: '15 questions added', user: 'Admin', time: '3 hours ago' },
    { id: '4', action: 'Test completed', user: 'Sarah Smith', time: '4 hours ago' }
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Admin Dashboard</h1>
        <p className="text-slate-600">Welcome to the PrepSavvy Admin Control Center</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-3xl font-bold text-slate-900">{stats.totalQuestions}</span>
          </div>
          <h3 className="font-semibold text-slate-900 mb-1">Total Questions</h3>
          <p className="text-sm text-slate-600">In question bank</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-3xl font-bold text-slate-900">{stats.activeStudents}</span>
          </div>
          <h3 className="font-semibold text-slate-900 mb-1">Active Students</h3>
          <p className="text-sm text-slate-600">Currently enrolled</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-3xl font-bold text-slate-900">{stats.testsToday}</span>
          </div>
          <h3 className="font-semibold text-slate-900 mb-1">Tests Today</h3>
          <p className="text-sm text-slate-600">Completed attempts</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-3xl font-bold text-slate-900">{stats.avgCompletion}%</span>
          </div>
          <h3 className="font-semibold text-slate-900 mb-1">Avg Completion</h3>
          <p className="text-sm text-slate-600">Test completion rate</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <Activity className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-lg text-slate-900">Recent Activity</h3>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 pb-4 border-b border-slate-100 last:border-0">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2" />
                <div className="flex-1">
                  <p className="text-slate-900 font-medium">{activity.action}</p>
                  <p className="text-sm text-slate-600">{activity.user} • {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="font-bold text-lg text-slate-900 mb-6">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full p-4 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg text-left transition-colors group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 group-hover:text-blue-700">Add Questions</h4>
                  <p className="text-sm text-slate-600">Create new practice questions</p>
                </div>
              </div>
            </button>

            <button className="w-full p-4 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg text-left transition-colors group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 group-hover:text-green-700">Publish Daily Set</h4>
                  <p className="text-sm text-slate-600">Create today's practice set</p>
                </div>
              </div>
            </button>

            <button className="w-full p-4 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg text-left transition-colors group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 group-hover:text-purple-700">View Analytics</h4>
                  <p className="text-sm text-slate-600">Check student performance</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Admin Image */}
      <div className="mt-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-2xl font-bold mb-2">💼 Manage Your Platform</h3>
          <p className="text-blue-100 max-w-xl">
            Use the sidebar navigation to manage questions, publish daily sets, and monitor student performance. Keep the platform running smoothly!
          </p>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1765648684555-de2d0f6af467?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b3Jrc3BhY2UlMjBsYXB0b3B8ZW58MXx8fHwxNzY5MDYzMTgyfDA&ixlib=rb-4.1.0&q=80&w=1080"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
