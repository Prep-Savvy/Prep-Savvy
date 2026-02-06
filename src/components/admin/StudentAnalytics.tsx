import { useState, useEffect } from 'react';
import { getAttemptsOverview, getAttemptsList } from '../../backend/admin/analyticsService';
import { Search, TrendingUp, TrendingDown, Award, BarChart3 } from 'lucide-react';

interface Student {
  identifier: string; // from backend topStudents
  email?: string; // fallback if needed
  name?: string;
  attempts: number;
  avgPercentage: number;
  topCategory?: string; // derived or add later
}

export default function StudentAnalytics() {
  const [students, setStudents] = useState<Student[]>([]);
  const [overview, setOverview] = useState({
    totalAttempts: 0,
    averagePercentage: 0,
    totalQuestionsAttempted: 0,
    topStudents: [] as Student[]
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'attempts' | 'score'>('score');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch overview stats
        const overviewData = await getAttemptsOverview();
        setOverview(overviewData);

        // Fetch full attempts list (for student details)
        const { attempts } = await getAttemptsList({
  daily_set_id: undefined,
  student_email: undefined,
  startDate: undefined,
  endDate: undefined,
  limit: 100,
  page: 1
}); // large limit for admin

        // Group by student_email for unique students
        const studentMap = new Map<string, Student>();
        attempts.forEach((a: any) => {
          const email = a.student_email || a.student_name || 'anonymous';
          if (!studentMap.has(email)) {
            studentMap.set(email, {
              identifier: email,
              email,
              name: a.student_name || email.split('@')[0],
              attempts: 0,
              avgPercentage: 0,
              topCategory: 'Unknown'
            });
          }
          const s = studentMap.get(email)!;
          s.attempts++;
          s.avgPercentage = overviewData.averagePercentage; // fallback, refine later
        });

        setStudents(Array.from(studentMap.values()));
      } catch (err: any) {
        setError(err.message || 'Failed to load analytics');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredStudents = students
    .filter((s) =>
      (s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       s.email?.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
      if (sortBy === 'attempts') return b.attempts - a.attempts;
      return b.avgPercentage - a.avgPercentage;
    });

  const totalStudents = students.length;
  const avgScore = Math.round(overview.averagePercentage);
  const activeToday = 0; // add real logic later if you have lastActive field
  const topPerformer = overview.topStudents[0] || { identifier: 'None', avgPercentage: 0 };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Student Analytics</h1>
        <p className="text-slate-600">Monitor student performance and engagement</p>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {loading && <p className="text-slate-600 mb-4">Loading analytics...</p>}

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-3xl font-bold text-slate-900">{totalStudents}</span>
          </div>
          <h3 className="font-semibold text-slate-900 mb-1">Total Students</h3>
          <p className="text-sm text-slate-600">Registered users</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-3xl font-bold text-slate-900">{avgScore}%</span>
          </div>
          <h3 className="font-semibold text-slate-900 mb-1">Average Score</h3>
          <p className="text-sm text-slate-600">Platform-wide</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-3xl font-bold text-slate-900">{activeToday}</span>
          </div>
          <h3 className="font-semibold text-slate-900 mb-1">Active Today</h3>
          <p className="text-sm text-slate-600">Current engagement</p>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-5 h-5" />
            <span className="text-sm font-medium">Top Performer</span>
          </div>
          <p className="font-bold text-lg mb-1">{topPerformer.identifier}</p>
          <p className="text-2xl font-bold">{topPerformer.avgPercentage}%</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search students by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
            >
              <option value="score">Sort by Score</option>
              <option value="attempts">Sort by Attempts</option>
              <option value="name">Sort by Name</option>
            </select>
          </div>
        </div>
      </div>

      {/* Student Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Student</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Email</th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-slate-900">Attempts</th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-slate-900">Avg Score</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Top Category</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Last Active</th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-slate-900">Performance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredStudents.map((student) => {
                const performanceTrend = student.avgPercentage >= 75 ? 'up' : student.avgPercentage >= 60 ? 'stable' : 'down';

                return (
                  <tr key={student.identifier} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                          {(student.name || student.identifier).charAt(0)}
                        </div>
                        <span className="font-semibold text-slate-900">{student.name || student.identifier}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{student.email || student.identifier}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-semibold text-slate-900">{student.attempts}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center justify-center w-16 h-8 rounded-full font-bold text-sm ${
                        student.avgPercentage >= 75
                          ? 'bg-green-100 text-green-700'
                          : student.avgPercentage >= 60
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {student.avgPercentage}%
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                        {student.topCategory || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      N/A {/* No lastActive in current backend - add later */}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-1">
                        {performanceTrend === 'up' && (
                          <>
                            <TrendingUp className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium text-green-700">Excellent</span>
                          </>
                        )}
                        {performanceTrend === 'stable' && (
                          <>
                            <TrendingUp className="w-4 h-4 text-orange-600" />
                            <span className="text-sm font-medium text-orange-700">Good</span>
                          </>
                        )}
                        {performanceTrend === 'down' && (
                          <>
                            <TrendingDown className="w-4 h-4 text-red-600" />
                            <span className="text-sm font-medium text-red-700">Needs Help</span>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Category Performance Overview */}
      <div className="mt-8 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h3 className="font-bold text-lg text-slate-900 mb-6">Category Performance Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Aptitude', 'Logical Reasoning', 'Verbal Ability', 'Coding'].map((category) => {
            const categoryStudents = students.filter(s => s.topCategory === category);
            const categoryAvg = categoryStudents.length > 0
              ? Math.round(categoryStudents.reduce((acc, s) => acc + s.avgPercentage, 0) / categoryStudents.length)
              : 0;

            return (
              <div key={category} className="border border-slate-200 rounded-lg p-4">
                <h4 className="font-semibold text-slate-900 mb-2">{category}</h4>
                <p className="text-3xl font-bold text-blue-600 mb-1">{categoryAvg}%</p>
                <p className="text-sm text-slate-600">{categoryStudents.length} students</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}