"use client";

import { useEffect, useState } from 'react'; 
import Link from 'next/link';

export default function DashboardPage() {
  const [userName, setUserName] = useState("User"); 

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between p-6 hidden md:flex shrink-0">
        <div>
          <div className="flex items-center space-x-2 mb-10">
            <div className="bg-indigo-600 text-white text-xs font-bold px-2 py-1.5 rounded-md">FF</div>
            <span className="font-bold text-slate-900 text-lg">FormFlow</span>
          </div>

          <nav className="space-y-1">
            <Link href="/dashboard" className="flex items-center space-x-3 px-3 py-2.5 rounded-xl bg-indigo-50 text-indigo-600 font-medium text-sm">
              <span>🏠</span><span>Dashboard</span>
            </Link>
            <Link href="/dashboard/forms" className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 font-medium text-sm">
              <span>📄</span><span>My Forms</span>
            </Link>
            <Link href="/dashboard/create" className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 font-medium text-sm">
              <span>➕</span><span>Create New Form</span>
            </Link>
            <Link href="/dashboard/analytics" className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 font-medium text-sm">
              <span>📊</span><span>Analytics</span>
            </Link>
            <Link href="/dashboard/settings" className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 font-medium text-sm">
              <span>⚙️</span><span>Settings</span>
            </Link>
          </nav>
        </div>

        <div>
          <Link href="/login" onClick={() => localStorage.clear()} className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-red-50 hover:text-red-600 font-medium text-sm transition">
            <span>🚪</span><span>Logout</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 overflow-x-hidden">
        <div className="flex items-center justify-between mb-8">
          <div className="relative w-full max-w-xs">
            <input type="text" placeholder="Search your forms..." className="w-full h-10 pl-9 pr-4 bg-white border border-slate-200 rounded-full text-xs text-slate-800 focus:outline-none focus:border-indigo-600 shadow-sm" />
            <span className="absolute left-3 top-3 text-slate-400 text-xs">🔍</span>
          </div>

          <div className="flex items-center space-x-4 shrink-0">
            <button className="w-9 h-9 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-600 shadow-sm relative">
              <span>🔔</span><span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 capitalize">
            Hello, {userName}! 👋
          </h1>
          <p className="text-slate-500 text-xs md:text-sm mt-1">
            Welcome back! Ready to create something amazing?
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-xl font-bold shrink-0">📄</div>
            <div><div className="text-2xl font-bold text-slate-900">3</div><div className="text-xs text-slate-500 font-medium">Total Forms</div></div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center text-xl font-bold shrink-0">👥</div>
            <div><div className="text-2xl font-bold text-slate-900">120</div><div className="text-xs text-slate-500 font-medium">Total Responses</div></div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center text-xl font-bold shrink-0">✅</div>
            <div><div className="text-2xl font-bold text-slate-900">2</div><div className="text-xs text-slate-500 font-medium">Active Forms</div></div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center text-xl font-bold shrink-0">📝</div>
            <div><div className="text-2xl font-bold text-slate-900">1</div><div className="text-xs text-slate-500 font-medium">Draft Forms</div></div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-indigo-50/90 via-indigo-50/40 to-white p-6 md:p-8 rounded-3xl border border-indigo-100/60 mb-8 flex flex-col md:flex-row items-center justify-between shadow-sm relative overflow-hidden">
          <div className="max-w-xl mb-4 md:mb-0 z-10">
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 mb-2">Create Your First Form</h2>
            <p className="text-slate-600 text-xs leading-relaxed mb-6">
              Design beautiful forms and collect responses easily.
            </p>
            {/* YAHAN CHANGE KIYA HAI: Button ko hata kar Link laga diya */}
            <Link href="/dashboard/create" className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium text-xs shadow-md transition flex items-center space-x-2 w-fit">
              <span>+</span>
              <span>Create New Form</span>
            </Link>
          </div>

          <div className="relative flex items-center z-10 mt-4 md:mt-0">
            <div className="bg-white p-4 rounded-2xl shadow-lg border border-slate-200/80 w-52 transform -rotate-2">
              <div className="flex space-x-1 mb-2">
                <div className="w-2 h-2 rounded-full bg-red-400"></div>
                <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2"><div className="w-3.5 h-3.5 rounded bg-indigo-600 text-white flex items-center justify-center text-[9px] font-bold">✓</div><div className="h-2 bg-slate-100 rounded-full w-4/5"></div></div>
                <div className="flex items-center space-x-2"><div className="w-3.5 h-3.5 rounded bg-indigo-600 text-white flex items-center justify-center text-[9px] font-bold">✓</div><div className="h-2 bg-slate-100 rounded-full w-3/5"></div></div>
                <div className="flex items-center space-x-2"><div className="w-3.5 h-3.5 rounded bg-indigo-600 text-white flex items-center justify-center text-[9px] font-bold">✓</div><div className="h-2 bg-slate-100 rounded-full w-full"></div></div>
              </div>
            </div>
            <div className="ml-4 text-indigo-600 text-4xl transform rotate-12 drop-shadow-md">✈️</div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-slate-900">Recent Forms</h3>
            <button className="text-xs text-indigo-600 font-medium hover:underline">View All Forms →</button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3">Form Name</th>
                  <th className="pb-3">Responses</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Created On</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-xs text-slate-700">
                {/* Table content kept same for brevity */}
                <tr className="hover:bg-slate-50/50 transition">
                  <td className="py-4 font-medium flex items-center space-x-2"><span>🎓</span><span>Student Registration Form</span></td>
                  <td className="py-4">45</td>
                  <td className="py-4"><span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-semibold">● Published</span></td>
                  <td className="py-4 text-slate-500">Nov 1, 2026</td>
                  <td className="py-4 text-right">
                    <div className="flex items-center justify-end space-x-1.5">
                      <button className="p-1.5 bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 rounded-lg">👁️</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}