import { useState } from 'react';
import { GraduationCap, Shield, Mail, User as UserIcon } from 'lucide-react';
import type { User, UserType } from '../App';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [loginType, setLoginType] = useState<UserType>('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loginType === 'student') {
      if (name && email) {
        onLogin({
          id: Date.now().toString(),
          name,
          email,
          type: 'student'
        });
      }
    } else {
      // Simple admin login (in production, this would be secure)
      if (email && adminPassword === 'admin123') {
        onLogin({
          id: 'admin-1',
          name: 'Admin',
          email,
          type: 'admin'
        });
      } else {
        alert('Invalid admin credentials. Use password: admin123');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-xl text-slate-900">PrepSavvy</h1>
              <p className="text-xs text-slate-600">Placement Preparation Platform</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Side - Hero */}
          <div className="space-y-6">
            <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              🎯 Ace Your Placement Interviews
            </div>
            <h2 className="text-4xl font-bold text-slate-900 leading-tight">
              Master Your Skills with Daily Practice
            </h2>
            <p className="text-lg text-slate-600">
              PrepSavvy provides curated daily practice sets across Aptitude, Logical Reasoning, Verbal, and Coding to help you excel in placement tests.
            </p>
            
            {/* Feature Cards */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-xl">📚</span>
                </div>
                <h3 className="font-semibold text-slate-900 text-sm">Daily Practice</h3>
                <p className="text-xs text-slate-600 mt-1">Fresh questions every day</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-xl">📊</span>
                </div>
                <h3 className="font-semibold text-slate-900 text-sm">Track Progress</h3>
                <p className="text-xs text-slate-600 mt-1">Monitor your improvement</p>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
            {/* Login Type Toggle */}
            <div className="flex gap-2 p-1 bg-slate-100 rounded-lg mb-6">
              <button
                onClick={() => setLoginType('student')}
                className={`flex-1 py-3 px-4 rounded-md font-medium transition-all flex items-center justify-center gap-2 ${
                  loginType === 'student'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <GraduationCap className="w-5 h-5" />
                Student Login
              </button>
              <button
                onClick={() => setLoginType('admin')}
                className={`flex-1 py-3 px-4 rounded-md font-medium transition-all flex items-center justify-center gap-2 ${
                  loginType === 'admin'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Shield className="w-5 h-5" />
                Admin Login
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  {loginType === 'student' ? 'Welcome, Student!' : 'Admin Portal'}
                </h3>
                <p className="text-sm text-slate-600">
                  {loginType === 'student' 
                    ? 'Enter your details to start practicing' 
                    : 'Access the admin control center'}
                </p>
              </div>

              {loginType === 'student' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {loginType === 'admin' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="Enter admin password"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <p className="text-xs text-slate-500 mt-1">Demo password: admin123</p>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors shadow-sm"
              >
                {loginType === 'student' ? 'Start Learning' : 'Access Admin Panel'}
              </button>
            </form>

            {loginType === 'student' && (
              <div className="mt-6 pt-6 border-t border-slate-200">
                <p className="text-xs text-slate-600 text-center">
                  By continuing, you agree to PrepSavvy's Terms of Service and Privacy Policy
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}