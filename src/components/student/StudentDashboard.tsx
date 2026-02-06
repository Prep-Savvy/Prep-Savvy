import { useEffect, useState } from 'react';
import { fetchProgress } from '../../backend/student/progressService';
import {
  GraduationCap,
  LogOut,
  User as UserIcon,
  Trophy,
  BookOpen,
  Clock
} from 'lucide-react';
import type { User } from '../../App';
import TestInterface from './TestInterface';
import ProfilePage from './ProfilePage';
import ResultsScreen from './ResultsScreen';

interface StudentDashboardProps {
  user: User;
  onLogout: () => void;
}

export interface Question {
  id: string;
  category: string;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
}

export interface TestAttempt {
  id: string;
  date: string;
  category: string;
  score: number;
  totalQuestions: number;
  timeSpent: string;
}

export default function StudentDashboard({ user, onLogout }: StudentDashboardProps) {
  const [currentView, setCurrentView] = useState<'home' | 'test' | 'profile' | 'results'>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [lastTestResult, setLastTestResult] = useState<{
    score: number;
    total: number;
    questions: Question[];
    userAnswers: number[];
  } | null>(null);

  const [stats, setStats] = useState({
    totalAttempts: 0,
    averageScore: 0,
    testsToday: 0
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProgress = async () => {
      try {
        setLoading(true);
        setError(null);

        const progress = await fetchProgress(user.email);

        const attempts = progress.attempts ?? [];

        const today = new Date().toDateString();
        const testsToday = attempts.filter((a: any) =>
          new Date(a.attempted_at).toDateString() === today
        ).length;

        setStats({
          totalAttempts: progress.totalAttempts ?? 0,
          averageScore: Math.round(progress.averageScore ?? 0),
          testsToday
        });
      } catch (err) {
        setError('Failed to load progress');
        console.error('Failed to load student progress', err);
      } finally {
        setLoading(false);
      }
    };

    loadProgress();
  }, [user.email]);

  const practiceCategories = [
    {
      id: 'aptitude',
      name: 'Aptitude',
      icon: '🔢',
      color: 'bg-blue-100 text-blue-700 border-blue-200',
      questionsCount: 15,
      duration: '20 mins'
    },
    {
      id: 'logical',
      name: 'Logical Reasoning',
      icon: '🧩',
      color: 'bg-purple-100 text-purple-700 border-purple-200',
      questionsCount: 12,
      duration: '15 mins'
    },
    {
      id: 'verbal',
      name: 'Verbal Ability',
      icon: '📝',
      color: 'bg-green-100 text-green-700 border-green-200',
      questionsCount: 10,
      duration: '12 mins'
    },
    {
      id: 'coding',
      name: 'Coding',
      icon: '💻',
      color: 'bg-orange-100 text-orange-700 border-orange-200',
      questionsCount: 8,
      duration: '30 mins'
    }
  ];

  const handleStartTest = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentView('test');
  };

  const handleTestSubmit = (
    score: number,
    total: number,
    questions: Question[],
    userAnswers: number[]
  ) => {
    setLastTestResult({ score, total, questions, userAnswers });
    setCurrentView('results');
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setSelectedCategory('');
  };

  if (currentView === 'test') {
    return (
      <TestInterface
        category={selectedCategory}
        onBack={handleBackToHome}
        onSubmit={handleTestSubmit}
        user={user}  // ← this line added (fixes the error)
      />
    );
  }

  if (currentView === 'results' && lastTestResult) {
    return (
      <ResultsScreen
        score={lastTestResult.score}
        total={lastTestResult.total}
        category={selectedCategory}
        questions={lastTestResult.questions}
        userAnswers={lastTestResult.userAnswers}
        onBackToHome={handleBackToHome}
      />
    );
  }

  if (currentView === 'profile') {
    return (
      <ProfilePage
        user={user}
        onBack={handleBackToHome}
        onLogout={onLogout}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-xl text-slate-900">PrepSavvy</h1>
                <p className="text-xs text-slate-600">
                  Welcome back, {user.name}!
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentView('profile')}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
              >
                <UserIcon className="w-4 h-4" />
                <span className="text-sm font-medium">Profile</span>
              </button>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-3xl font-bold text-slate-900">
                {loading ? '-' : stats.totalAttempts}
              </span>
            </div>
            <h3 className="font-semibold text-slate-900">Total Attempts</h3>
            <p className="text-sm text-slate-600">All-time practice tests</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Trophy className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-3xl font-bold text-slate-900">
                {loading ? '-' : `${stats.averageScore}%`}
              </span>
            </div>
            <h3 className="font-semibold text-slate-900">Average Score</h3>
            <p className="text-sm text-slate-600">Keep up the good work!</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-3xl font-bold text-slate-900">
                {loading ? '-' : stats.testsToday}
              </span>
            </div>
            <h3 className="font-semibold text-slate-900">Tests Today</h3>
            <p className="text-sm text-slate-600">Daily practice streak</p>
          </div>
        </div>

        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 md:p-8 mb-8 text-white">
          <div className="max-w-full">
            <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm font-medium mb-3">
              📅 {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </span>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Today's Practice Sets</h2>
            <p className="text-blue-100 text-base md:text-lg">
              Complete all categories to maximize your preparation. Fresh questions await!
            </p>
          </div>
        </div>

        {/* Practice Categories */}
        <div>
          <h3 className="text-xl font-bold text-slate-900 mb-4">Choose Your Category</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {practiceCategories.map((category) => (
              <div
                key={category.id}
                className={`bg-white rounded-xl p-6 border-2 ${category.color} hover:shadow-lg transition-all cursor-pointer group`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-4xl">{category.icon}</div>
                    <div>
                      <h4 className="font-bold text-lg text-slate-900">{category.name}</h4>
                      <p className="text-sm text-slate-600">Daily Practice Set</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 mb-4 text-sm text-slate-600">
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    <span>{category.questionsCount} Questions</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{category.duration}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleStartTest(category.id)}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 rounded-lg transition-colors group-hover:scale-[1.02] transition-transform"
                >
                  Start Practice
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Motivational Section */}
        <div className="mt-8 bg-white rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center gap-6">
            <img
              src="https://images.unsplash.com/photo-1758518731027-78a22c8852ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhY2hpZXZlbWVudCUyMHN1Y2Nlc3MlMjBjZWxlYnJhdGlvbnxlbnwxfHx8fDE3NjkxMzcyMjB8MA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Success"
              className="w-32 h-32 rounded-xl object-cover"
            />
            <div>
              <h4 className="font-bold text-lg text-slate-900 mb-2">💪 Keep Practicing Daily!</h4>
              <p className="text-slate-600">
                Consistency is key to success. Complete at least one practice set every day to see significant improvement in your placement preparation.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}