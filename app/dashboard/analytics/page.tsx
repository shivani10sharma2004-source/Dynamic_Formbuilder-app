'use client';

import Link from 'next/link';

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between p-6 hidden md:flex shrink-0">
        <div>
          {/* Logo */}
          <div className="flex items-center space-x-2 mb-10">
            <div className="bg-indigo-600 text-white text-xs font-bold px-2 py-1.5 rounded-md">FF</div>
            <span className="font-bold text-slate-900 text-lg">FormFlow</span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <Link href="/dashboard" className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 font-medium text-sm">
              <span>🏠</span>
              <span>Dashboard</span>
            </Link>
            <Link href="/dashboard/forms" className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 font-medium text-sm">
              <span>📄</span>
              <span>My Forms</span>
            </Link>
            <Link href="/dashboard/create" className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 font-medium text-sm">
              <span>➕</span>
              <span>Create New Form</span>
            </Link>
            <Link href="/dashboard/analytics" className="flex items-center space-x-3 px-3 py-2.5 rounded-xl bg-indigo-50 text-indigo-600 font-medium text-sm">
              <span>📊</span>
              <span>Analytics</span>
            </Link>
            <Link href="/dashboard/settings" className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 font-medium text-sm">
              <span>⚙️</span>
              <span>Settings</span>
            </Link>
          </nav>
        </div>

        {/* User Info (Logout removed) */}
        <div className="flex items-center space-x-3 px-2 pt-4 border-t border-slate-100">
          <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-xs">
            S
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">Shivani Sharma</div>
            <div className="text-[10px] text-slate-400">Free Plan</div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 overflow-x-hidden">
        {/* Top Bar with Dynamic Greeting */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-900">
              Hello, Shivani! 👋
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">Here is how your forms are performing overall.</p>
          </div>
        </div>

        {/* Analytics Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Form Analytics</h2>
            <p className="text-xs text-slate-500">An overview of your form performance and submissions.</p>
          </div>
          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            <select className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 font-medium shadow-sm focus:outline-none">
              <option>Last 30 days</option>
              <option>Last 7 days</option>
              <option>All time</option>
            </select>
            <select className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 font-medium shadow-sm focus:outline-none">
              <option>All Forms</option>
              <option>Student Registration Form</option>
              <option>Feedback Form</option>
            </select>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400 font-medium mb-1">Total Forms Created</div>
              <div className="text-2xl font-extrabold text-slate-900">28</div>
            </div>
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-bold">📄</div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400 font-medium mb-1">Total Responses</div>
              <div className="text-2xl font-extrabold text-slate-900">1,289</div>
            </div>
            <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center font-bold">👥</div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400 font-medium mb-1">Conversion Rate</div>
              <div className="text-2xl font-extrabold text-slate-900">21.5%</div>
            </div>
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center font-bold">📈</div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400 font-medium mb-1">Avg. Completion Time</div>
              <div className="text-2xl font-extrabold text-slate-900">1m 24s</div>
            </div>
            <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center font-bold">⏱️</div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1: Responses Over Time */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-900 text-sm mb-4">Responses Over Time</h3>
            <div className="h-64 flex items-end justify-between px-4 pt-6 pb-2 border-b border-slate-100 relative">
              <div className="absolute inset-x-6 top-10 bottom-6 flex items-center justify-between pointer-events-none">
                <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
                  <path d="M 0,120 Q 80,40 160,80 T 320,30 T 480,50" fill="none" stroke="#6366f1" strokeWidth="3" />
                </svg>
              </div>
            </div>
            <div className="flex justify-between text-[11px] text-slate-400 pt-3">
              <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
            </div>
          </div>

          {/* Chart 2: Top 5 Forms by Responses */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-900 text-sm mb-6">Top 5 Forms by Responses</h3>
            <div className="space-y-4 text-xs text-slate-600">
              <div>
                <div className="flex justify-between mb-1 font-medium"><span>Feedback Survey</span> <span className="text-slate-400">450 responses</span></div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden"><div className="bg-indigo-600 h-full w-[90%] rounded-full"></div></div>
              </div>
              <div>
                <div className="flex justify-between mb-1 font-medium"><span>Contact Us</span> <span className="text-slate-400">320 responses</span></div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden"><div className="bg-indigo-500 h-full w-[65%] rounded-full"></div></div>
              </div>
              <div>
                <div className="flex justify-between mb-1 font-medium"><span>Feature Poll</span> <span className="text-slate-400">240 responses</span></div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden"><div className="bg-indigo-400 h-full w-[50%] rounded-full"></div></div>
              </div>
              <div>
                <div className="flex justify-between mb-1 font-medium"><span>Usability Test</span> <span className="text-slate-400">150 responses</span></div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden"><div className="bg-purple-400 h-full w-[35%] rounded-full"></div></div>
              </div>
              <div>
                <div className="flex justify-between mb-1 font-medium"><span>Job Application</span> <span className="text-slate-400">80 responses</span></div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden"><div className="bg-indigo-300 h-full w-[20%] rounded-full"></div></div>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}