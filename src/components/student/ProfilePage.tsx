import { useEffect, useState } from 'react';
import { fetchProgress, type StudentProgress } from '../../backend/student/progressService';
import { ArrowLeft, User as UserIcon, Mail, Trophy, Calendar, Clock, TrendingUp, AlertCircle, Target, Zap } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { User } from '../../App';

interface ProfilePageProps {
  user: User;
  onBack: () => void;
  onLogout: () => void;
}

// Type for weak/strong area items
interface AreaStat {
  category: string;
  percentage: number;
  correct?: number;
  total?: number;
}

export default function ProfilePage({ user, onBack, onLogout }: ProfilePageProps) {
  const [progress, setProgress] = useState<StudentProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProgress = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchProgress(user.email);
        setProgress(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load profile data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProgress();
  }, [user.email]);

  if (loading) {
    return <div className="p-8 text-center">Loading profile...</div>;
  }

  if (error || !progress) {
    return <div className="p-8 text-center text-red-600">{error || 'No data available'}</div>;
  }

  const { totalAttempts, averageScore, attempts } = progress;

  if (attempts.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 p-8">
        <div className="max-w-6xl mx-auto">
          <button onClick={onBack} className="flex items-center gap-2 text-slate-600 mb-6">
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>
          <div className="bg-white rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">No Test Attempts Yet</h2>
            <p className="text-slate-600 mb-6">
              Start practicing to see your progress and stats here!
            </p>
            <button
              onClick={onBack}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold"
            >
              Go to Practice
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Real stats
  const totalCorrect = attempts.reduce((acc, test) => acc + test.score, 0);
  const totalQuestions = attempts.reduce((acc, test) => acc + test.total_questions, 0);
  const avgScoreRounded = Math.round(averageScore);

  // Category stats (no topic field available → fallback to single category)
  const categoryStats = {
    Overall: { correct: totalCorrect, total: totalQuestions }
  };

  // Progress graph data
  const progressData = attempts
    .sort((a, b) => new Date(a.attempted_at).getTime() - new Date(b.attempted_at).getTime())
    .map((test) => ({
      date: new Date(test.attempted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      score: Math.round((test.score / test.total_questions) * 100),
      category: 'Overall'
    }));

  // Weak/strong areas — typed properly
  const weakAreas: AreaStat[] = Object.entries(categoryStats)
    .map(([category, stats]) => ({
      category,
      percentage: Math.round((stats.correct / stats.total) * 100)
    }))
    .filter(area => area.percentage < 70)
    .sort((a, b) => a.percentage - b.percentage);

  const strongAreas: AreaStat[] = Object.entries(categoryStats)
    .map(([category, stats]) => ({
      category,
      percentage: Math.round((stats.correct / stats.total) * 100)
    }))
    .filter(area => area.percentage >= 70)
    .sort((a, b) => b.percentage - a.percentage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Dashboard</span>
            </button>
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 mb-8">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center flex-shrink-0">
              <UserIcon className="w-12 h-12 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">{user.name}</h2>
              <div className="flex items-center gap-2 text-slate-600 mb-4">
                <Mail className="w-4 h-4" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  🎓 Student
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  ✓ Active
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-4xl font-bold text-slate-900">{totalAttempts}</span>
            </div>
            <h3 className="font-semibold text-slate-900 mb-1">Total Attempts</h3>
            <p className="text-sm text-slate-600">All practice tests taken</p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Trophy className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-4xl font-bold text-slate-900">{avgScoreRounded}%</span>
            </div>
            <h3 className="font-semibold text-slate-900 mb-1">Average Score</h3>
            <p className="text-sm text-slate-600">Overall performance</p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-4xl font-bold text-slate-900">{totalCorrect}</span>
            </div>
            <h3 className="font-semibold text-slate-900 mb-1">Questions Solved</h3>
            <p className="text-sm text-slate-600">Correct answers</p>
          </div>
        </div>

        {/* Progress Graph */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-8">
          <h3 className="font-bold text-lg text-slate-900 mb-6">Progress Over Time</h3>
          {progressData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  tickLine={{ stroke: '#cbd5e1' }}
                />
                <YAxis
                  label={{ value: 'Score (%)', angle: -90, position: 'insideLeft', fill: '#64748b' }}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  tickLine={{ stroke: '#cbd5e1' }}
                  domain={[0, 100]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '8px 12px'
                  }}
                  labelStyle={{ color: '#1e293b', fontWeight: '600' }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{ fill: '#2563eb', r: 5 }}
                  activeDot={{ r: 7, fill: '#1d4ed8' }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-slate-600 py-8">No progress data yet</p>
          )}
        </div>

        {/* Improvement Section */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-orange-600" />
            </div>
            <h3 className="font-bold text-lg text-slate-900">Areas for Improvement</h3>
          </div>

          {weakAreas.length > 0 ? (
            <div className="space-y-4">
              <p className="text-slate-600 mb-4">
                Focus on these areas to boost your overall performance:
              </p>
              {weakAreas.map((area) => (
                <div key={area.category} className="border border-orange-200 bg-orange-50 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-slate-900">{area.category}</h4>
                        <p className="text-sm text-slate-600">
                          Current Score: {area.percentage}%
                        </p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-orange-200 text-orange-800 rounded-full text-xs font-semibold">
                      Needs Focus
                    </span>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-orange-200">
                    <p className="text-sm text-slate-700 mb-2">
                      <strong>💡 Recommendation:</strong>
                    </p>
                    <ul className="text-sm text-slate-600 space-y-1 ml-5 list-disc">
                      <li>Practice daily to improve accuracy</li>
                      <li>Review incorrect answers and understand concepts</li>
                      <li>Target score: 70%+ for strong foundation</li>
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="font-semibold text-slate-900 mb-2">Excellent Performance!</h4>
              <p className="text-slate-600">
                You're scoring well overall. Keep up the consistency!
              </p>
            </div>
          )}

          {strongAreas.length > 0 && (
            <div className="mt-6 pt-6 border-t border-slate-200">
              <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Zap className="w-5 h-5 text-green-600" />
                Your Strengths
              </h4>
              <div className="flex flex-wrap gap-2">
                {strongAreas.map((area) => (
                  <span
                    key={area.category}
                    className="px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium"
                  >
                    {area.category} ({area.percentage}%)
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Test History */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="font-bold text-lg text-slate-900 mb-6">Test History</h3>
          <div className="space-y-3">
            {attempts.map((test, index) => {
              const percentage = Math.round((test.score / test.total_questions) * 100);
              const isPassed = percentage >= 60;

              return (
                <div
                  key={index}
                  className="border border-slate-200 rounded-lg p-4 hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 rounded-lg flex items-center justify-center ${
                        isPassed ? 'bg-green-100' : 'bg-orange-100'
                      }`}>
                        <span className={`text-2xl font-bold ${isPassed ? 'text-green-700' : 'text-orange-700'}`}>
                          {percentage}%
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900">Practice Attempt</h4>
                        <div className="flex items-center gap-4 text-sm text-slate-600 mt-1">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(test.attempted_at).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>~{Math.floor(test.total_questions / 2)} mins</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-slate-900">
                        {test.score}/{test.total_questions}
                      </p>
                      <p className="text-sm text-slate-600">Score</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Motivational Banner */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-2">🎯 Keep Up The Great Work!</h3>
          <p className="text-blue-100">
            You're making excellent progress. Continue practicing daily to achieve your placement goals!
          </p>
        </div>
      </main>
    </div>
  );
}