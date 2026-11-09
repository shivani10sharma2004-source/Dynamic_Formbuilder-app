'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function MyFormsPage() {
  const [forms, setForms] = useState<any[]>([]);
  const [selectedFormForShare, setSelectedFormForShare] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Page load hone par Backend + LocalStorage se Forms fetch karna
  useEffect(() => {
    const fetchForms = async () => {
      try {
        const res = await fetch('https://dynamic-formbuilder-app-2.onrender.com/api/forms');
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            setForms(data);
            return;
          }
        }
      } catch (error) {
        console.log("Backend offline, falling back to localStorage");
      }

      // Fallback to localStorage if backend fetch fails
      const savedForms = localStorage.getItem('formflow_forms');
      if (savedForms) {
        setForms(JSON.parse(savedForms));
      } else {
        setForms([
          { id: 1, name: 'Sample Contact Form', formId: 'DEMO67', type: 'Conversational Form', responses: '46 👤', updated: 'October 30, 2026', active: true },
          { id: 2, name: 'Sample Event Registration', formId: 'DEMO58', type: 'Traditional Form', responses: '28 👤', updated: 'October 28, 2026', active: true },
        ]);
      }
    };

    fetchForms();
  }, []);

  // Filter forms based on search
  const filteredForms = forms.filter(f => (f.name || f.title || '').toLowerCase().includes(searchQuery.toLowerCase()));

  const toggleStatus = (id: any) => {
    const updatedForms = forms.map(form => (form.id === id || form._id === id) ? { ...form, active: !form.active } : form);
    setForms(updatedForms);
    localStorage.setItem('formflow_forms', JSON.stringify(updatedForms));
  };

  const deleteForm = (id: any) => {
    if(confirm("Are you sure you want to delete this form?")) {
      const updatedForms = forms.filter(form => form.id !== id && form._id !== id);
      setForms(updatedForms);
      localStorage.setItem('formflow_forms', JSON.stringify(updatedForms));
    }
  };

  // FIXED: Localhost link generation for proper testing
  const handleCopyLink = (formId: string) => {
    const publicLink = `http://localhost:3000/form/${formId}`;
    navigator.clipboard.writeText(publicLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
            <Link href="/dashboard" className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 font-medium text-sm"><span>🏠</span><span>Dashboard</span></Link>
            <Link href="/dashboard/forms" className="flex items-center space-x-3 px-3 py-2.5 rounded-xl bg-indigo-50 text-indigo-600 font-medium text-sm"><span>📄</span><span>My Forms</span></Link>
            <Link href="/dashboard/create" className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 font-medium text-sm"><span>➕</span><span>Create New Form</span></Link>
            <Link href="/dashboard/analytics" className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 font-medium text-sm"><span>📊</span><span>Analytics</span></Link>
            <Link href="/dashboard/settings" className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 font-medium text-sm"><span>⚙️</span><span>Settings</span></Link>
          </nav>
        </div>
        <div className="flex items-center space-x-3 px-2 pt-4 border-t border-slate-100">
          <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-xs">S</div>
          <div><div className="text-xs font-bold text-slate-900">Sujal Sharma</div><div className="text-[10px] text-slate-400">Free Plan</div></div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 overflow-visible">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100 relative z-50">
          <div className="relative w-full max-w-xs">
            <input 
              type="text" 
              placeholder="Search your forms..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-4 bg-white border border-slate-200 rounded-full text-xs text-slate-800 focus:outline-none focus:border-indigo-600 shadow-sm"
            />
            <span className="absolute left-3 top-3 text-slate-400 text-xs">🔍</span>
          </div>

          <div className="flex items-center space-x-4 shrink-0 relative">
            <button className="w-9 h-9 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-600 shadow-sm relative">
              <span>🔔</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="w-9 h-9 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md focus:outline-none hover:ring-2 hover:ring-indigo-300 transition cursor-pointer">S</button>
              {showProfileMenu && (
                <div className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-[9999] text-left">
                  <div className="px-4 py-2 border-b border-slate-100 mb-1">
                    <div className="font-bold text-slate-900 text-xs">Sujal Sharma</div>
                    <div className="text-[10px] text-slate-400">sujal@example.com</div>
                  </div>
                  <Link href="/dashboard/settings" onClick={() => setShowProfileMenu(false)} className="w-full px-4 py-2 hover:bg-slate-50 text-slate-700 flex items-center space-x-2.5 text-xs font-medium"><span>👤</span><span>My Profile</span></Link>
                  <Link href="/dashboard/settings" onClick={() => setShowProfileMenu(false)} className="w-full px-4 py-2 hover:bg-slate-50 text-slate-700 flex items-center space-x-2.5 text-xs font-medium"><span>⚙️</span><span>Settings</span></Link>
                  <div className="border-t border-slate-100 my-1"></div>
                  <Link href="/login" onClick={() => setShowProfileMenu(false)} className="w-full px-4 py-2 hover:bg-red-50 text-red-600 flex items-center space-x-2.5 text-xs font-medium">
                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg><span>Logout</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Page Title & Button */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">All Forms</h1>
            <p className="text-xs text-slate-500 mt-0.5">Manage and track all your created forms in one place.</p>
          </div>
          <Link href="/dashboard/create" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-medium text-xs shadow-md transition flex items-center space-x-2">
            <span>+</span><span>Create Form</span>
          </Link>
        </div>

        {/* Forms Table */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 overflow-hidden">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <div className="flex items-center space-x-4 text-xs text-slate-500">
              <span>All Forms ({filteredForms.length})</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 w-8"><input type="checkbox" className="rounded border-slate-300" /></th>
                  <th className="pb-3">Name</th>
                  <th className="pb-3">Shortcode</th>
                  <th className="pb-3">Responses</th>
                  <th className="pb-3">Updated</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-xs text-slate-700">
                {filteredForms.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-slate-500">
                      <span className="text-3xl block mb-2">📭</span>
                      No forms found. Create one!
                    </td>
                  </tr>
                ) : (
                  filteredForms.map((form) => (
                    <tr key={form.id || form._id} className="hover:bg-slate-50/50 transition">
                      <td className="py-4"><input type="checkbox" className="rounded border-slate-300" /></td>
                      <td className="py-4 font-medium flex items-center space-x-2">
                        <span className="p-1.5 text-white bg-indigo-600 rounded-lg">📋</span>
                        <div>
                          <div className="font-bold text-slate-900">{form.name || form.title}</div>
                          <div className="text-[10px] text-slate-400">ID #{String(form.formId || form.id)}</div>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className="px-2.5 py-1 bg-slate-100 rounded-md text-[10px] text-slate-600 font-mono">
                          [formgen_id="{form.formId}"]
                        </span>
                      </td>
                      <td className="py-4 font-semibold text-indigo-600">{form.responses || '0 👤'}</td>
                      <td className="py-4 text-slate-500">{form.updated || 'Recent'}</td>
                      <td className="py-4">
                        <div className="flex items-center space-x-2">
                          <div onClick={() => toggleStatus(form.id || form._id)} className={`w-9 h-5 rounded-full relative cursor-pointer flex items-center px-0.5 transition-colors ${form.active ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${form.active ? 'transform translate-x-4' : 'transform translate-x-0'}`}></div>
                          </div>
                          <span className={`font-medium text-[11px] ${form.active ? 'text-slate-700' : 'text-slate-500'}`}>{form.active ? 'Active' : 'Inactive'}</span>
                        </div>
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button 
                            onClick={() => form.active && setSelectedFormForShare(form)}
                            disabled={!form.active}
                            title={form.active ? "Share Form" : "Activate form to share"}
                            className={`px-2.5 py-1.5 rounded-lg font-medium text-xs transition flex items-center space-x-1 shadow-sm ${form.active ? 'bg-indigo-50 hover:bg-indigo-100 text-indigo-600 cursor-pointer' : 'bg-slate-100 text-slate-400 cursor-not-allowed opacity-60'}`}
                          >
                            <span>🔗</span><span>Share</span>
                          </button>
                          
                          {/* DELETE BUTTON */}
                          <button onClick={() => deleteForm(form.id || form._id)} title="Delete Form" className="p-1.5 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-600 transition rounded-lg">
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Share Modal Popup */}
      {selectedFormForShare && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-md p-6 relative">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <span className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">🔗</span>
                <h3 className="font-bold text-slate-900 text-sm">Share & Embed Form</h3>
              </div>
              <button onClick={() => setSelectedFormForShare(null)} className="w-7 h-7 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full flex items-center justify-center font-bold text-xs">✕</button>
            </div>
            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Form Name</label>
                <input type="text" readOnly value={selectedFormForShare.name || selectedFormForShare.title} className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium" />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Public Link</label>
                <div className="flex items-center space-x-2">
                  <input type="text" readOnly value={`http://localhost:3000/form/${selectedFormForShare.formId}`} className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-mono text-[11px]" />
                  <button onClick={() => handleCopyLink(selectedFormForShare.formId)} className="px-4 h-9 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium shrink-0 transition shadow-sm">{copied ? 'Copied! ✨' : 'Copy'}</button>
                </div>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Website Embed Code (HTML)</label>
                <textarea readOnly rows={3} value={`<iframe src="http://localhost:3000/form/${selectedFormForShare.formId}" width="100%" height="500px" style="border:none;"></iframe>`} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-mono text-[10px] resize-none" />
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
              <button onClick={() => setSelectedFormForShare(null)} className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium text-xs transition">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}