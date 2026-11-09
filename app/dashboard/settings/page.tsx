'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function SettingsPage() {
  // State Management
  const [emailNotif, setEmailNotif] = useState(true);
  const [responseNotif, setResponseNotif] = useState(true);
  const [theme, setTheme] = useState('light');
  
  // Profile State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Shivani Sharma',
    email: 'shivani@example.com'
  });

  // Password Reset State
  const [resetStatus, setResetStatus] = useState<'idle' | 'input' | 'loading' | 'sent'>('idle');
  const [resetEmailInput, setResetEmailInput] = useState('');
  const [resetError, setResetError] = useState('');

  // Load Data from Local Storage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('formflow_settings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setProfileData({ name: parsed.name || 'Shivani Sharma', email: parsed.email || 'shivani@example.com' });
      setTheme(parsed.theme || 'light');
      setEmailNotif(parsed.emailNotif ?? true);
      setResponseNotif(parsed.responseNotif ?? true);
    }
  }, []);

  // Save Data to Local Storage whenever settings change
  useEffect(() => {
    localStorage.setItem('formflow_settings', JSON.stringify({
      ...profileData, theme, emailNotif, responseNotif
    }));
  }, [profileData, theme, emailNotif, responseNotif]);

  // ===================== PASSWORD RESET LOGIC (DATABASE/API LINKED) =====================
  const handleStartPasswordReset = () => {
    setResetStatus('input');
    setResetEmailInput('');
    setResetError('');
  };

  const handleCancelReset = () => {
    setResetStatus('idle');
    setResetEmailInput('');
    setResetError('');
  };

  const handleSendResetCode = async () => {
    if (!resetEmailInput) {
      setResetError('Please enter an email address.');
      return;
    }

    setResetError('');
    setResetStatus('loading');
    
    try {
      // Backend API par request bhejna jo actual database check karega
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: resetEmailInput }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Agar database me email nahi mili ya error aaya
        setResetError(data.message || 'Email does not match our records.');
        setResetStatus('input');
        return;
      }

      // Agar email mil gayi aur database ne success bheja
      setResetStatus('sent');
      setTimeout(() => {
        setResetStatus('idle');
        setResetEmailInput('');
      }, 4000); // Wapas idle state me 4 sec baad

    } catch (error) {
      setResetError('Something went wrong checking the database. Please try again.');
      setResetStatus('input');
    }
  };
  // ================================================================

  // Dynamic Theme Classes
  const isDark = theme === 'dark';
  const bgMain = isDark ? 'bg-slate-900' : 'bg-slate-50';
  const bgSidebar = isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200';
  const bgCard = isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100';
  const textMain = isDark ? 'text-white' : 'text-slate-900';
  const textMuted = isDark ? 'text-slate-400' : 'text-slate-500';
  const borderLine = isDark ? 'border-slate-700' : 'border-slate-100';
  const inputBg = isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800';
  const linkHover = isDark ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-50 text-slate-600';

  return (
    <div className={`min-h-screen flex transition-colors duration-300 ${bgMain}`}>
      {/* Sidebar */}
      <aside className={`w-64 border-r flex flex-col justify-between p-6 hidden md:flex shrink-0 transition-colors duration-300 ${bgSidebar}`}>
        <div>
          {/* Logo */}
          <div className="flex items-center space-x-2 mb-10">
            <div className="bg-indigo-600 text-white text-xs font-bold px-2 py-1.5 rounded-md">FF</div>
            <span className={`font-bold text-lg ${textMain}`}>FormFlow</span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <Link href="/dashboard" className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl font-medium text-sm transition ${linkHover}`}>
              <span>🏠</span>
              <span>Dashboard</span>
            </Link>
            <Link href="/dashboard/forms" className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl font-medium text-sm transition ${linkHover}`}>
              <span>📄</span>
              <span>My Forms</span>
            </Link>
            <Link href="/dashboard/create" className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl font-medium text-sm transition ${linkHover}`}>
              <span>➕</span>
              <span>Create New Form</span>
            </Link>
            <Link href="/dashboard/analytics" className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl font-medium text-sm transition ${linkHover}`}>
              <span>📊</span>
              <span>Analytics</span>
            </Link>
            <Link href="/dashboard/settings" className="flex items-center space-x-3 px-3 py-2.5 rounded-xl bg-indigo-50 text-indigo-600 font-medium text-sm">
              <span>⚙️</span>
              <span>Settings</span>
            </Link>
          </nav>
        </div>

        {/* User Info & Logout */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3 px-2">
            <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-xs">
              {profileData.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className={`text-xs font-bold ${textMain}`}>{profileData.name}</div>
              <div className="text-[10px] text-slate-400">Free Plan</div>
            </div>
          </div>

          <Link href="/login" className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600 font-medium text-sm transition">
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Logout</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 overflow-x-hidden">
        {/* Top Header Bar */}
        <div className={`flex items-center justify-between mb-8 pb-4 border-b ${borderLine}`}>
          <div className="relative w-full max-w-xs">
            <input 
              type="text" 
              placeholder="Search anything..." 
              className={`w-full h-10 pl-9 pr-4 border rounded-full text-xs focus:outline-none focus:border-indigo-600 shadow-sm transition-colors ${inputBg}`}
            />
            <span className="absolute left-3 top-3 text-slate-400 text-xs">🔍</span>
          </div>
        </div>

        {/* Page Title */}
        <div className="mb-6">
          <h1 className={`text-2xl font-extrabold ${textMain}`}>Settings</h1>
          <p className={`text-xs mt-0.5 ${textMuted}`}>Manage your account preferences.</p>
        </div>

        {/* Settings Grid Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Card 1: Profile Settings */}
          <div className={`p-6 rounded-3xl border shadow-sm transition-colors duration-300 ${bgCard}`}>
            <div className={`flex items-center justify-between mb-4 pb-3 border-b ${borderLine}`}>
              <div>
                <h3 className={`font-bold text-sm ${textMain}`}>Profile Settings</h3>
                <p className={`text-[11px] ${textMuted}`}>Update your personal information.</p>
              </div>
              <button 
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition flex items-center space-x-1 ${isEditingProfile ? 'bg-indigo-600 text-white hover:bg-indigo-700' : (isDark ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-slate-50 text-slate-700 hover:bg-slate-100')}`}
              >
                <span>{isEditingProfile ? '💾' : '✏️'}</span>
                <span>{isEditingProfile ? 'Save Profile' : 'Edit Profile'}</span>
              </button>
            </div>

            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-md relative">
                {profileData.name.charAt(0).toUpperCase()}
                <span className={`absolute bottom-0 right-0 w-5 h-5 border rounded-full flex items-center justify-center text-[10px] shadow-sm cursor-pointer ${isDark ? 'bg-slate-700 border-slate-600' : 'bg-white border-slate-200'}`}>📷</span>
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">Name</label>
                  {isEditingProfile ? (
                    <input 
                      type="text" 
                      value={profileData.name}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-xl text-xs font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 ${inputBg}`}
                    />
                  ) : (
                    <div className={`px-3 py-2 border rounded-xl text-xs font-medium flex items-center space-x-2 ${inputBg}`}>
                      <span>👤</span>
                      <span>{profileData.name}</span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">Email Address</label>
                  {isEditingProfile ? (
                    <input 
                      type="email" 
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-xl text-xs font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 ${inputBg}`}
                    />
                  ) : (
                    <div className={`px-3 py-2 border rounded-xl text-xs font-medium flex items-center space-x-2 ${inputBg}`}>
                      <span>✉️</span>
                      <span>{profileData.email}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Appearance Settings */}
          <div className={`p-6 rounded-3xl border shadow-sm transition-colors duration-300 ${bgCard}`}>
            <div className={`mb-4 pb-3 border-b ${borderLine}`}>
              <h3 className={`font-bold text-sm ${textMain}`}>Appearance Settings</h3>
              <p className={`text-[11px] ${textMuted}`}>Choose your preferred theme.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div 
                onClick={() => setTheme('light')}
                className={`p-4 rounded-2xl border-2 cursor-pointer flex flex-col items-center justify-center transition ${
                  theme === 'light' 
                    ? 'border-indigo-600 bg-indigo-50/20' 
                    : (isDark ? 'border-slate-700 bg-slate-800 hover:border-slate-600' : 'border-slate-200 bg-white hover:border-slate-300')
                }`}
              >
                <div className="text-2xl mb-2">🌞</div>
                <div className={`text-xs font-bold ${textMain}`}>Light</div>
              </div>

              <div 
                onClick={() => setTheme('dark')}
                className={`p-4 rounded-2xl border-2 cursor-pointer flex flex-col items-center justify-center transition ${
                  theme === 'dark' 
                    ? 'border-indigo-600 bg-indigo-50/20' 
                    : (isDark ? 'border-slate-700 bg-slate-800 hover:border-slate-600' : 'border-slate-200 bg-white hover:border-slate-300')
                }`}
              >
                <div className="text-2xl mb-2">🌙</div>
                <div className={`text-xs font-bold ${textMain}`}>Dark</div>
              </div>
            </div>
          </div>

          {/* Card 3: Notification Settings */}
          <div className={`p-6 rounded-3xl border shadow-sm transition-colors duration-300 ${bgCard}`}>
            <div className={`mb-4 pb-3 border-b ${borderLine}`}>
              <h3 className={`font-bold text-sm ${textMain}`}>Notification Settings</h3>
              <p className={`text-[11px] ${textMuted}`}>Manage your notification preferences.</p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <div className={`font-bold ${textMain}`}>Email Notifications</div>
                  <div className={`text-[10px] ${textMuted}`}>Get updates about your forms and responses.</div>
                </div>
                <div 
                  onClick={() => setEmailNotif(!emailNotif)}
                  className={`w-9 h-5 rounded-full relative cursor-pointer flex items-center px-0.5 transition-colors ${
                    emailNotif ? 'bg-indigo-600' : (isDark ? 'bg-slate-600' : 'bg-slate-300')
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    emailNotif ? 'transform translate-x-4' : 'transform translate-x-0'
                  }`}></div>
                </div>
              </div>

              <div className={`flex items-center justify-between pt-3 border-t ${borderLine}`}>
                <div>
                  <div className={`font-bold ${textMain}`}>New Response Notifications</div>
                  <div className={`text-[10px] ${textMuted}`}>Receive alerts for new submissions.</div>
                </div>
                <div 
                  onClick={() => setResponseNotif(!responseNotif)}
                  className={`w-9 h-5 rounded-full relative cursor-pointer flex items-center px-0.5 transition-colors ${
                    responseNotif ? 'bg-indigo-600' : (isDark ? 'bg-slate-600' : 'bg-slate-300')
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    responseNotif ? 'transform translate-x-4' : 'transform translate-x-0'
                  }`}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 4: Security Settings (Updated with API Verification) */}
          <div className={`p-6 rounded-3xl border shadow-sm transition-colors duration-300 ${bgCard}`}>
            <div className={`mb-4 pb-3 border-b ${borderLine}`}>
              <h3 className={`font-bold text-sm ${textMain}`}>Security Settings</h3>
              <p className={`text-[11px] ${textMuted}`}>Keep your account secure.</p>
            </div>

            <div className="space-y-4 text-xs">
              {resetStatus === 'input' ? (
                <div className="py-2 space-y-3 animate-fadeIn">
                  <div className={`font-bold ${textMain}`}>Enter your registered email to receive a reset code:</div>
                  <input 
                    type="email" 
                    placeholder="Enter valid email..."
                    value={resetEmailInput}
                    onChange={(e) => {
                      setResetEmailInput(e.target.value);
                      setResetError('');
                    }}
                    className={`w-full px-3 py-2 border rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors ${
                      resetError ? 'border-red-500 focus:ring-red-500' : inputBg
                    }`}
                  />
                  {resetError && <div className="text-red-500 text-[10px] font-medium">{resetError}</div>}
                  <div className="flex space-x-2 pt-1">
                    <button 
                      onClick={handleSendResetCode}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition"
                    >
                      Send Code
                    </button>
                    <button 
                      onClick={handleCancelReset}
                      className={`px-4 py-2 border rounded-xl font-medium transition ${
                        isDark ? 'bg-slate-700 text-slate-300 border-slate-600 hover:bg-slate-600' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between py-2">
                  <div>
                    <div className={`font-bold ${textMain}`}>Change Password</div>
                    <div className={`text-[10px] ${textMuted}`}>Update your password via email verification.</div>
                  </div>
                  
                  <button 
                    onClick={handleStartPasswordReset}
                    disabled={resetStatus !== 'idle'}
                    className={`px-3 py-1.5 border rounded-xl font-medium transition flex items-center space-x-1 ${
                      resetStatus === 'sent' 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-200' 
                        : (isDark ? 'bg-slate-700 hover:bg-indigo-600 text-white border-slate-600' : 'bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 border-slate-200 text-slate-700')
                    }`}
                  >
                    {resetStatus === 'idle' && <span>Change</span>}
                    {resetStatus === 'loading' && <span className="animate-spin">⏳</span>}
                    {resetStatus === 'sent' && <span>✅ Code Sent</span>}
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}