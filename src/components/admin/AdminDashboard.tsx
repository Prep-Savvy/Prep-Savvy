import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Calendar, 
  Users, 
  LogOut,
  GraduationCap 
} from 'lucide-react';
import type { User } from '../../App';
import AdminOverview from './AdminOverview';
import QuestionBank from './QuestionBank';
import DailySetManager from './DailySetManager';
import StudentAnalytics from './StudentAnalytics';
import { getDailySets } from '../../backend/admin/dailySetService'; // import real service

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
}

type AdminView = 'overview' | 'questions' | 'daily-sets' | 'analytics';

export default function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const [currentView, setCurrentView] = useState<AdminView>('overview');
  const [recentActivity, setRecentActivity] = useState<any[]>([]); // real data
  const [loadingActivity, setLoadingActivity] = useState(true);

  const menuItems = [
    { id: 'overview' as AdminView, label: 'Overview', icon: LayoutDashboard },
    { id: 'questions' as AdminView, label: 'Question Bank', icon: BookOpen },
    { id: 'daily-sets' as AdminView, label: 'Daily Sets', icon: Calendar },
    { id: 'analytics' as AdminView, label: 'Student Analytics', icon: Users }
  ];

  // Fetch real recent activity (latest published daily sets as example)
  useEffect(() => {
    const fetchRecent = async () => {
      try {
        setLoadingActivity(true);
        const { sets } = await getDailySets({ date: undefined, limit: 5 }); // latest 5 published sets
        const activity = sets.map((set: any) => ({
          id: set.id,
          action: 'Daily set published',
          user: 'Admin',
          time: new Date(set.created_at).toLocaleString(),
          category: set.category,
        }));
        setRecentActivity(activity);
      } catch (err) {
        console.error('Failed to load recent activity', err);
        // fallback to empty
        setRecentActivity([]);
      } finally {
        setLoadingActivity(false);
      }
    };

    fetchRecent();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-slate-900">PrepSavvy</h1>
              <p className="text-xs text-slate-600">Admin Portal</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-slate-200">
          <div className="bg-slate-50 rounded-lg p-4 mb-3">
            <p className="text-xs text-slate-600 mb-1">Logged in as</p>
            <p className="font-semibold text-slate-900 text-sm">{user.email}</p>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-medium transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {currentView === 'overview' && <AdminOverview />}
        {currentView === 'questions' && <QuestionBank />}
        {currentView === 'daily-sets' && <DailySetManager />}
        {currentView === 'analytics' && <StudentAnalytics />}
      </main>
    </div>
  );
}