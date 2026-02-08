import { useState } from 'react';
import { GraduationCap, Shield, Mail, User as UserIcon, UserPlus, CheckCircle } from 'lucide-react';
import type { User, UserType } from '../App';
import { supabase } from '../backend/config/supabaseClient'; // ← adjust path when your friend adds the file

interface LoginPageProps {
  onLogin: (user: User) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [loginType, setLoginType] = useState<UserType>('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showSignUp, setShowSignUp] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [authLoading, setAuthLoading] = useState(false); // new: for loading state during auth calls

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');
    setPasswordError('');

    // Email validation (kept as your team has it)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!emailRegex.test(email)) {
      setEmailError('Invalid Email');
      return;
    }

    if (loginType === 'student') {
      if (showSignUp) {
        // Signup validation
        if (!password || password.length < 6) {
          setPasswordError('Password must be at least 6 characters');
          return;
        }

        setAuthLoading(true);

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name }, // store username/name in user metadata
          },
        });

        setAuthLoading(false);

        if (error) {
          setPasswordError(error.message); // show error in password field or change to a general error
          return;
        }

        if (data.user) {
          setShowSuccessModal(true); // show your modal
          // Note: Supabase may not auto-login after signup if confirmation is enabled
          // For submission, we force login-like behavior
          onLogin({
            id: data.user.id,
            name,
            email: data.user.email || email,
            type: 'student',
          });
        }
      } else {
        // Login
        if (!password) {
          setPasswordError('Password is required');
          return;
        }

        setAuthLoading(true);

        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        setAuthLoading(false);

        if (error) {
          setPasswordError(error.message);
          return;
        }

        if (data.user) {
          onLogin({
            id: data.user.id,
            name: data.user.user_metadata?.full_name || name || email.split('@')[0],
            email: data.user.email || email,
            type: 'student',
          });
        }
      }
    } else {
      // Admin login - completely unchanged
      if (adminPassword !== 'admin123') {
        setPasswordError('Incorrect password');
        return;
      }
      onLogin({
        id: 'admin-1',
        name: 'Admin',
        email,
        type: 'admin',
      });
    }
  };

  const handleModalOk = () => {
    setShowSuccessModal(false);
    // After modal OK, the onLogin already happened in signup block
    // If needed, you can add redirect logic here later
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 relative">
      {/* Header - unchanged */}
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
          {/* Left Side - Hero - unchanged */}
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
            {/* Feature Cards - unchanged */}
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
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 relative">
            {/* Toggle - unchanged */}
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
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  {loginType === 'student'
                    ? showSignUp
                      ? 'Sign Up'
                      : 'Welcome, Student!'
                    : 'Admin Portal'}
                </h3>
                <p className="text-sm text-slate-600">
                  {loginType === 'student'
                    ? showSignUp
                      ? 'Create your account to start learning'
                      : 'Enter your details to start practicing'
                    : 'Access the admin control center'}
                </p>
              </div>

              {loginType === 'student' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {showSignUp ? 'Username' : 'Full Name'}
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={showSignUp ? 'Username' : 'Enter your name'}
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
                {emailError && <p className="text-red-600 text-xs mt-1">{emailError}</p>}
              </div>

              {loginType === 'student' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={showSignUp ? 'Create a password' : 'Enter your password'}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  {passwordError && <p className="text-red-600 text-xs mt-1">{passwordError}</p>}
                </div>
              )}

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
                  {passwordError && <p className="text-red-600 text-xs mt-1">{passwordError}</p>}
                </div>
              )}

              {/* Buttons */}
              <div className="flex flex-col items-center gap-4">
                <button
                  type="submit"
                  disabled={authLoading}
                  className={`w-full py-3 px-4 rounded-md font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all flex items-center justify-center gap-2 ${
                    authLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {authLoading
                    ? 'Processing...'
                    : loginType === 'student'
                    ? showSignUp
                      ? 'Sign Up'
                      : 'Login'
                    : 'Access Admin Panel'}
                </button>

                {/* Sign Up button */}
                {loginType === 'student' && !showSignUp && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowSignUp(true);
                      setPassword('');
                      setPasswordError('');
                    }}
                    className="py-3 px-4 rounded-md font-medium bg-blue-600 text-white shadow-sm hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                    style={{ width: '150px' }}
                  >
                    <UserPlus className="w-5 h-5" /> Sign Up
                  </button>
                )}

                {/* Back to login */}
                {loginType === 'student' && showSignUp && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowSignUp(false);
                      setPassword('');
                      setPasswordError('');
                    }}
                    className="mt-2 text-blue-600 text-sm hover:underline"
                  >
                    Back to Login
                  </button>
                )}
              </div>
            </form>

            {loginType === 'student' && (
              <div className="mt-6 pt-6 border-t border-slate-200">
                <p className="text-xs text-slate-600 text-center">
                  By continuing, you agree to PrepSavvy's Terms of Service and Privacy Policy
                </p>
              </div>
            )}

            {/* Success Modal - unchanged */}
            {showSuccessModal && (
              <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                <div className="bg-white p-8 rounded-2xl shadow-xl w-96 max-w-[90%] flex flex-col items-center gap-4 text-center">
                  <CheckCircle className="w-14 h-14 text-green-600" />
                  <h3 className="text-xl font-bold text-slate-900">Account created successfully!</h3>
                  <button
                    onClick={handleModalOk}
                    className="mt-4 py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold"
                  >
                    OK
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}