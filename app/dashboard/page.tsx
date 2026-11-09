'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function DashboardPage() {
  const [userName, setUserName] = useState('User'); // Default fallback

  const [stats, setStats] = useState({
    totalForms: 0,
    totalResponses: 0, 
    activeForms: 0,
    draftForms: 0
  });

  const [recentForms, setRecentForms] = useState<any[]>([]);

  useEffect(() => {
    // 1. Real logged-in user name load karna localStorage se
    const savedName = localStorage.getItem('userName');
    if (savedName) {
      setUserName(savedName);
    }

    // 2. LocalStorage se form data read karna
    const existingFormsJSON = localStorage.getItem('formflow_forms');
    let savedForms = [];
    if (existingFormsJSON) {
      savedForms = JSON.parse(existingFormsJSON);
    }

    // FIX: 'active: true' / 'active: false' ke basis par count karna taaki My Forms se match kare
    const activeCount = savedForms.filter((f: any) => f.active === true || f.status === 'Published').length;
    const draftCount = savedForms.filter((f: any) => f.active === false || f.status === 'Draft').length;

    setStats({
      totalForms: savedForms.length,
      totalResponses: 0, 
      activeForms: activeCount,
      draftForms: draftCount
    });

    setRecentForms(savedForms.slice(0, 5));
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
            <Link href="/dashboard" className="flex items-center space-x-3 px-3 py-2.5 rounded-xl bg-indigo-50 text-indigo-600 font-medium text-sm"><span>🏠</span><span>Dashboard</span></Link>
            <Link href="/dashboard/forms" className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 font-medium text-sm"><span>📄</span><span>My Forms</span></Link>
            <Link href="/dashboard/create" className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 font-medium text-sm"><span>➕</span><span>Create New Form</span></Link>
            <Link href="/dashboard/analytics" className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 font-medium text-sm"><span>📊</span><span>Analytics</span></Link>
            <Link href="/dashboard/settings" className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 font-medium text-sm"><span>⚙️</span><span>Settings</span></Link>
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        
        {/* Top Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="relative w-full max-w-xs">
            <input 
              type="text" 
              placeholder="Search your forms..." 
              className="w-full h-10 pl-9 pr-4 bg-white border border-slate-200 rounded-full text-xs text-slate-800 focus:outline-none focus:border-indigo-600 shadow-sm"
            />
            <span className="absolute left-3 top-3 text-slate-400 text-xs">🔍</span>
          </div>

          <div className="flex items-center space-x-4 shrink-0">
            <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md cursor-pointer">
              {userName !== 'User' ? userName.charAt(0).toUpperCase() : 'S'}
            </div>
          </div>
        </div>

        {/* Welcome Section (Dynamic User Name) */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 flex items-center space-x-2">
            <span>Hello, {userName}!</span> <span>👋</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">Welcome back! Ready to create something amazing?</p>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
            <div className="w-12 h-12 bg-slate-50 text-slate-600 flex items-center justify-center rounded-xl text-xl">📄</div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{stats.totalForms}</div>
              <div className="text-xs text-slate-500 font-medium">Total Forms</div>
            </div>
          </div>
          
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 flex items-center justify-center rounded-xl text-xl">👥</div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{stats.totalResponses}</div>
              <div className="text-xs text-slate-500 font-medium">Total Responses</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 flex items-center justify-center rounded-xl text-xl">✅</div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{stats.activeForms}</div>
              <div className="text-xs text-slate-500 font-medium">Active Forms</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
            <div className="w-12 h-12 bg-amber-50 text-amber-500 flex items-center justify-center rounded-xl text-xl">📝</div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{stats.draftForms}</div>
              <div className="text-xs text-slate-500 font-medium">Draft Forms</div>
            </div>
          </div>
        </div>

        {/* Create Your First Form Banner */}
        {stats.totalForms === 0 && (
          <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-8 mb-8 flex flex-col items-start shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-1">Create Your First Form</h2>
            <p className="text-sm text-slate-600 mb-4">Design beautiful forms and collect responses easily.</p>
            <Link href="/dashboard/create" className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium text-xs transition shadow-sm">
              + Create New Form
            </Link>
          </div>
        )}

        {/* Recent Forms Table */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Recent Forms</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 w-1/2">FORM NAME</th>
                  <th className="pb-3">RESPONSES</th>
                  <th className="pb-3">STATUS</th>
                  <th className="pb-3">CREATED ON</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-xs text-slate-700">
                {recentForms.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-500">
                      No forms created yet. Click "Create New Form" to get started!
                    </td>
                  </tr>
                ) : (
                  recentForms.map((form) => (
                    <tr key={form.id} className="hover:bg-slate-50/50 transition">
                      <td className="py-4 font-medium text-slate-900 flex items-center space-x-2">
                        <span className={`w-2 h-2 rounded-full ${form.active ? 'bg-emerald-500' : 'bg-amber-400'}`}></span>
                        <span>{form.name}</span>
                      </td>
                      <td className="py-4 text-slate-500">{form.responses}</td>
                      <td className="py-4">
                        {form.active ? (
                          <span className="text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md text-[10px] font-bold">Published</span>
                        ) : (
                          <span className="text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md text-[10px] font-bold">Draft</span>
                        )}
                      </td>
                      <td className="py-4 text-slate-500">{form.updated}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}